const express = require("express");
const app = express();
const port = 3000;
const TelegramBot = require("node-telegram-bot-api");
// Serve all static files from the current directory
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const bot = new TelegramBot("....", {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendGame(
    msg.chat.id,
    "https://t.me/knocker_poker_bot?game=knocker_poker"
  );
});

bot.on("callback_query", (query) => {
  bot.answerCallbackQuery(query.id, {
    url: "http://localhost:3000",
  });
});
