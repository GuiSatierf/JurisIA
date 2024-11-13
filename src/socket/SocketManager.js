// SocketManager.js - Backend
const { Client } = require("whatsapp-web.js");
const whatsappClient = new Client();
let paused = false;

class SocketManager {
  static setup(io) {
    io.on("connection", (socket) => {
      console.log("Cliente conectado ao sistema de chat.");

      // Pausar e retomar o chat
      socket.on("pause", () => {
        paused = true;
        io.emit("status", "paused");
      });

      socket.on("resume", () => {
        paused = false;
        io.emit("status", "active");
      });

      // Evento para enviar uma mensagem ao WhatsApp do cliente
      socket.on("sendMessage", ({ clientId, message }) => {
        whatsappClient.sendMessage(clientId, message);
        console.log(`Mensagem enviada para ${clientId}: ${message}`);
      });

      // Evento de status inicial
      socket.emit("status", paused ? "paused" : "active");
    });

    // Evento para quando o QR Code é gerado
    whatsappClient.on("qr", (qr) => {
      io.emit("qr", qr);
    });

    // Evento para quando o WhatsApp está pronto
    whatsappClient.on("ready", () => {
      io.emit("status", "connected");
      console.log("WhatsApp conectado e pronto.");
    });

    // Evento para receber mensagens do WhatsApp e emitir para o frontend
    whatsappClient.on("message", (msg) => {
      const clientId = msg.from;
      const message = msg.body;
      io.emit("newMessage", { clientId, message });
    });

    whatsappClient.initialize();
  }

  static isPaused() {
    return paused;
  }

  static setPaused(value) {
    paused = value;
  }
}

module.exports = SocketManager;
