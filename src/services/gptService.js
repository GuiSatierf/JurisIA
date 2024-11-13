const { OpenAIApi, Configuration } = require("openai");
const ConfigLoader = require("../config/ConfigLoader");

const config = ConfigLoader.load();
const openai = new OpenAIApi(new Configuration({ apiKey: config.apiKey }));
const activeChats = new Map();

class GPTService {
  static async initializeChatSession(chatId) {
    if (activeChats.has(chatId)) return;
    activeChats.set(chatId, [
      { role: "system", content: config.assistant_instructions },
    ]);
  }

  static async getResponse(currentMessage, chatId) {
    const messages = activeChats.get(chatId);
    if (!messages) throw new Error("Sessão de chat não inicializada");

    messages.push({ role: "user", content: currentMessage });

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 150,
      });

      const botResponse = response.data.choices[0].message.content.trim();
      messages.push({ role: "assistant", content: botResponse });

      return botResponse;
    } catch (error) {
      console.error("Erro ao obter resposta da GPT:", error);
      return "Desculpe, não consegui processar sua mensagem agora.";
    }
  }

  static async getPreviousResponse(chatId) {
    const messages = activeChats.get(chatId);
    if (!messages || messages.length <= 1) return null;

    return messages[messages.length - 1].content;
  }
}

module.exports = GPTService;
