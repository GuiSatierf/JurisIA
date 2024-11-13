const { Client } = require("whatsapp-web.js");
const GPTService = require("../services/gptService");
const QRCodeService = require("../services/QRCodeService");
const SocketManager = require("../socket/SocketManager");

const whatsappClient = new Client();

class WhatsAppController {
  static initialize(io) {
    whatsappClient.on("qr", async (qr) => {
      const qrCodeUrl = await QRCodeService.generateQRCodeUrl(qr);
      io.emit("qr", qrCodeUrl);
    });

    whatsappClient.on("ready", () => {
      io.emit("status", "connected");
      console.log("WhatsApp conectado e pronto.");
    });

    whatsappClient.on("message", (msg) => this.handleMessage(msg, io));
    whatsappClient.initialize();

    io.on("connection", (socket) => {
      console.log("Um usuário se conectou.");

      socket.on("userMessage", async (message) => {
        const chatId = socket.id;

        await GPTService.initializeChatSession(chatId);

        if (SocketManager.isPaused()) {
    
          socket.emit("botResponse");
          return;
        }

        const response = await GPTService.getResponse(message, chatId);
        socket.emit("botResponse", response);
      });

      socket.on("pauseChat", () => {
        SocketManager.setPaused(true);
        io.emit("botResponse", "O chat foi pausado para manutenção.");
      });

      socket.on("resumeChat", () => {
        SocketManager.setPaused(false);
        io.emit("botResponse", "O chat foi retomado.");
      });
    });
  }

  static async handleMessage(msg, io) {
    const chatId = msg.from;

    if (msg.from.includes("@g.us") || SocketManager.isPaused()) {

      io.emit("botResponse");
      return;
    }

    await GPTService.initializeChatSession(chatId);

    // Obter informações do contato
    const contact = await msg.getContact();
    const name = contact.pushname || contact.number; // Nome do contato ou número se o nome não estiver disponível
    const profilePicUrl = await contact.getProfilePicUrl(); // URL da foto de perfil

    // Emitir a mensagem recebida do cliente para o frontend
    io.emit("newMessage", {
      clientId: chatId,
      message: msg.body,
      name: name, // Nome real do cliente
      avatar: profilePicUrl || "/img/avatar.png", // Caminho relativo da foto de perfil padrão
      senderType: "client"
    });

    const response = await GPTService.getResponse(msg.body, chatId);
    msg.reply(response);

    // Emitir a resposta da IA para o frontend
    io.emit("newMessage", {
      clientId: chatId,
      message: response,
      name: "Ana", // Nome da IA
      avatar: "/img/avatar.png", // Caminho relativo da foto de perfil da IA
      senderType: "agent"
    });
  }
}

module.exports = WhatsAppController;
