const socket = io(); // Conexão com o servidor WebSocket

const chatList = document.querySelector(".chat-list");
const messageDisplay = document.getElementById("message-content");

// Armazenar as mensagens de cada cliente
const clientMessages = {};

// Botões para pausar e continuar
document.getElementById("pause-btn").addEventListener("click", () => {
    socket.emit("pause"); // Envia o evento de pausa ao servidor
});

document.getElementById("resume-btn").addEventListener("click", () => {
    socket.emit("resume"); // Envia o evento de continuar ao servidor
});

// Ouvir o status do servidor
socket.on("status", (status) => {
    const statusText = document.getElementById("status-text");
    if (status === "paused") {
        statusText.innerText = "Pausado";
        statusText.style.color = "#FFA500"; // Laranja para "Pausado"
        return;
    }

    statusText.innerText = "Ativo";
    statusText.style.color = "#4caf50"; // Verde para "Ativo"
});

// Ouvir novas mensagens e atualizar a lista de clientes e mensagens
socket.on("newMessage", ({ clientId, message }) => {
    // Verificar se o cliente já está na lista
    if (!clientMessages[clientId]) {
        clientMessages[clientId] = [];
        addClientToChatList(clientId);
    }

    // Adicionar a nova mensagem ao histórico do cliente
    clientMessages[clientId].push(message);

    // Atualizar a última mensagem na lista de conversas
    const chatItem = document.querySelector(`[data-client-id="${clientId}"] .chat-last-message`);
    if (chatItem) {
        chatItem.textContent = message;
    }

    // Exibir a mensagem se o cliente estiver aberto
    if (document.querySelector(".active")?.dataset.clientId === clientId) {
        displayMessages(clientId);
    }
});

// Função para adicionar o cliente à lista de conversas
function addClientToChatList(clientId) {
    const chatItem = document.createElement("div");
    chatItem.classList.add("chat-item");
    chatItem.dataset.clientId = clientId;
    chatItem.innerHTML = `
        <img src="../public/img/avatar.png" alt="Avatar" class="avatar">
        <div class="chat-info">
            <span class="chat-name">${clientId}</span>
            <span class="chat-last-message">Última mensagem recebida...</span>
        </div>
    `;
    chatItem.addEventListener("click", () => openChat(clientId));
    chatList.appendChild(chatItem);
}

// Função para abrir o chat de um cliente e exibir suas mensagens
function openChat(clientId) {
    document.querySelectorAll(".chat-item").forEach((item) => item.classList.remove("active"));
    document.querySelector(`[data-client-id="${clientId}"]`).classList.add("active");

    displayMessages(clientId);
}

// Função para exibir mensagens do cliente selecionado
function displayMessages(clientId) {
    messageDisplay.innerHTML = ""; // Limpar o conteúdo anterior
    clientMessages[clientId].forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        messageDisplay.appendChild(messageElement);
    });
}
