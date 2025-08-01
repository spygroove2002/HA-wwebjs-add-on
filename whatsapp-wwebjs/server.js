const express = require("express");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const port = 3000;

console.log("Initializing WhatsApp client with session path: /config/whatsapp-wwebjs-session");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "/config/whatsapp-wwebjs-session" }),
  puppeteer: {
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
      "--single-process"
    ]
  }
});

// Serve OpenAPI specification
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

// QR Code event
client.on("qr", (qr) => {
  console.log("Scan this QR code in WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Ready event
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

// List chats
app.get("/chats", async (req, res) => {
  const chats = await client.getChats();
  res.json(chats.map((c) => ({
    id: c.id._serialized,
    name: c.name
  })));
});

// Get last 50 messages (newest first)
app.get("/messages/:chatId", async (req, res) => {
  const chat = await client.getChatById(req.params.chatId);
  const messages = await chat.fetchMessages({ limit: 50 });
  res.json(messages.reverse());
});

// Send message
app.use(express.json());
app.post("/messages", async (req, res) => {
  const { chatId, message } = req.body;
  if (!chatId || !message) {
    return res.status(400).json({ error: "chatId and message are required" });
  }
  const chat = await client.getChatById(chatId);
  await chat.sendMessage(message);
  res.json({ status: "Message sent", chatId, message });
});

client.initialize();
app.listen(port, () => console.log(`REST API running on port ${port}`));
