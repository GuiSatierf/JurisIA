const qrcode = require("qrcode");

class QRCodeService {
  constructor() {
    this.cache = new Map();
  }

  async generateQRCodeUrl(qr) {
    if (this.cache.has(qr)) {
      return this.cache.get(qr);
    }

    try {
      const qrCodeUrl = await qrcode.toDataURL(qr); // Gera uma URL base64
      this.cache.set(qr, qrCodeUrl); // Armazena em cache
      return qrCodeUrl;
    } catch (error) {
      console.error("Erro ao gerar QR code:", error);
      throw new Error("Erro ao gerar QR Code");
    }
  }
}

module.exports = new QRCodeService();
