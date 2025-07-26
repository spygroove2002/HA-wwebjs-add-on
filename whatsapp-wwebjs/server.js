import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const app = express();
const port = 3000;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "/session" }),
  puppeteer: { headless: true, args: ["--no-sandbox"] }
});

client.on("qr", (qr) => {
  console.log("Scan this QR code in WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

app.get("/chats", async (req, res) => {
  const chats = await client.getChats();
  res.json(chats.map((c) => ({ id: c.id._serialized, name: c.name })));
});

app.get("/messages/:chatId", async (req, res) => {
  const chat = await client.getChatById(req.params.chatId);
  const messages = await chat.fetchMessages({ limit: 50 });
  res.json(messages.map((m) => ({ from: m.from, body: m.body })));
});

client.initialize();
app.listen(port, () => console.log(`REST API running on port ${port}`));
