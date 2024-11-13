const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const WhatsAppController = require("./controllers/whatsappController");
const SocketManager = require("./socket/SocketManager");
const path = require("path"); // Importando o módulo path

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { Client } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
    ],
  },
});

client.initialize();

SocketManager.setup(io);
WhatsAppController.initialize(io);

// Ajuste para servir arquivos estáticos da pasta "public" fora de "src"
app.use(express.static(path.join(__dirname, "../public")));

// Rota para o painel
app.get("/painel", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "painel.html"));
});


server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
