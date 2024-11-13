const socket = io();

const chatList = document.querySelector(".chat-list");
const messageDisplay = document.getElementById("message-content");

// Armazenar as mensagens de cada cliente
const clientMessages = {};

// Botões para pausar e continuar
document.getElementById("pause-btn").addEventListener("click", () => {
  socket.emit("pause");
});

document.getElementById("resume-btn").addEventListener("click", () => {
  socket.emit("resume");
});

// Ouvir o status do servidor
socket.on("status", (status) => {
  const statusText = document.getElementById("status-text");
  statusText.innerText = status === "paused" ? "Pausado" : "Ativo";
  statusText.style.color = status === "paused" ? "#FFA500" : "#4caf50";
});

// Ouvir novas mensagens e atualizar a lista de clientes e mensagens
socket.on("newMessage", ({ clientId, message, name, avatar, senderType }) => {
  if (!clientMessages[clientId]) {
    clientMessages[clientId] = {
      messages: [],
      name: name,
      avatar: avatar,
    };
    addClientToChatList(clientId);
  }

  clientMessages[clientId].messages.push({
    sender: senderType === "agent" ? "agent" : "client",
    text: message,
    avatar: avatar
  });

  const chatItem = document.querySelector(`[data-client-id="${clientId}"] .chat-last-message`);
  if (chatItem) {
    chatItem.textContent = message;
  }

  if (document.querySelector(".active")?.dataset.clientId === clientId) {
    displayMessages(clientId);
  }
});

function addClientToChatList(clientId) {
  const client = clientMessages[clientId];
  const chatItem = document.createElement("div");
  chatItem.classList.add("chat-item");
  chatItem.dataset.clientId = clientId;
  chatItem.innerHTML = `
      <img src="${client.avatar || "../public/img/avatar.png"}" alt="Avatar" class="avatar">
      <div class="chat-info">
          <span class="chat-name">${client.name}</span>
          <span class="chat-last-message">Última mensagem recebida...</span>
      </div>
  `;
  chatItem.addEventListener("click", () => openChat(clientId));
  chatList.appendChild(chatItem);
}

function openChat(clientId) {
  document.querySelectorAll(".chat-item").forEach((item) => item.classList.remove("active"));
  document.querySelector(`[data-client-id="${clientId}"]`).classList.add("active");
  displayMessages(clientId);
}

function displayMessages(clientId) {
  messageDisplay.innerHTML = "";
  const client = clientMessages[clientId];
  client.messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
      "message",
      message.sender === "client" ? "client-message" : "agent-message"
    );

    // Adicionar avatar à mensagem
    messageElement.innerHTML = `
      <img src="${message.avatar}" alt="Avatar" class="message-avatar">
      <span class="message-text">${message.text}</span>
    `;

    messageDisplay.appendChild(messageElement);
  });
}

document.getElementById("send-message-btn").addEventListener("click", sendMessage);

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();
  const activeChatItem = document.querySelector(".chat-item.active");
  if (message && activeChatItem) {
    const clientId = activeChatItem.dataset.clientId;
    socket.emit("sendMessage", { clientId, message });

    clientMessages[clientId].messages.push({
      sender: "agent",
      text: message,
      avatar: "/path/to/ana-avatar.png"
    });
    displayMessages(clientId);

    messageInput.value = "";
  }
}
