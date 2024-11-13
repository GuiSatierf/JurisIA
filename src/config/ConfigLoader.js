const fs = require("fs");

class ConfigLoader {
  static load() {
    try {
      const configData = fs.readFileSync("config.json", "utf8");
      return JSON.parse(configData);
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
      throw new Error("Erro ao carregar configuração");
    }
  }
}

module.exports = ConfigLoader;
