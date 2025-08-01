const express = require("express");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const port = 3000;

// WhatsApp client with session persistence & system Chromium path for Alpine
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "/session" }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Serve OpenAPI specification
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.yaml"));
});

// WhatsApp QR Code event
client.on("qr", (qr) => {
  console.log("Scan this QR code in WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// WhatsApp Ready event
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

// REST API: List chats
app.get("/chats", async (req, res) => {
  const chats = await client.getChats();
  res.json(chats.map((c) => ({
    id: c.id._serialized,
    name: c.name
  })));
});

// REST API: Get last 50 messages from a chat
app.get("/messages/:chatId", async (req, res) => {
  const chat = await client.getChatById(req.params.chatId);
  const messages = await chat.fetchMessages({ limit: 50 });
  res.json(messages.map((m) => ({
    from: m.from,
    body: m.body
  })));
});

// Initialize WhatsApp client
client.initialize();

// Start REST API
app.listen(port, () => console.log(`REST API running on port ${port}`));
