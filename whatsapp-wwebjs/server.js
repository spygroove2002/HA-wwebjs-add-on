const express = require("express");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const port = 3000;

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
  const chats = await client.getChats
