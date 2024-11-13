class SocketManager {
    constructor() {
        this.socket = io();
    }

    initialize() {
        this.socket.on("qr", this.handleQRCode.bind(this));
        this.socket.on("status", this.handleStatus.bind(this));
    }

    handleQRCode(qrCodeUrl) {
        const qrCodeImg = document.getElementById("qr-code");

        if (!qrCodeImg) return;

        // Log para verificar o URL do QR Code
        console.log("QR Code URL recebido:", qrCodeUrl);

        qrCodeImg.onload = () => {
            console.log("QR Code carregado com sucesso.");
            qrCodeImg.style.display = "block";
            this.removeCheckIcon();
        };

        qrCodeImg.onerror = () => {
            console.error("Erro ao carregar o QR Code.");
            qrCodeImg.style.display = "none";
            setTimeout(() => {
                qrCodeImg.src = qrCodeUrl; // Tenta recarregar o QR Code após um breve intervalo
            }, 1000); // Tenta recarregar a cada segundo
        };

        qrCodeImg.src = qrCodeUrl; // Define o src do QR Code recebido
    }

    handleStatus(status) {
        const loadingText = document.getElementById("loading-text");
        const qrCodeImg = document.getElementById("qr-code");

        if (!loadingText || !qrCodeImg) return;

        loadingText.innerText = status === "connected" ? "Conectado!" : "Gerando QR Code...";

        if (status === "connected") {
            qrCodeImg.style.display = "none";
            qrCodeImg.removeAttribute("src"); // Remove o src para evitar imagem quebrada
            this.addCheckIcon();
            window.location.href = "/painel";
        }
    }

    addCheckIcon() {
        const qrcodeBox = document.querySelector(".qrcodebox");

        if (!qrcodeBox) return;

        if (!document.getElementById("qr-code-icon")) {
            const checkIcon = document.createElement("i");
            checkIcon.className = "bi bi-check-circle";
            checkIcon.id = "qr-code-icon";
            checkIcon.style.fontSize = "5em";
            checkIcon.style.color = "#4CAF50";
            qrcodeBox.appendChild(checkIcon);
        }
    }

    removeCheckIcon() {
        const checkIcon = document.getElementById("qr-code-icon");
        if (checkIcon) checkIcon.remove();
    }
}

const socketManager = new SocketManager();
socketManager.initialize();
export default socketManager;
