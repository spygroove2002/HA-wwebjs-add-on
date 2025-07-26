#!/bin/sh
if [ ! -d /config/whatsapp-wwebjs-session ]; then
  mkdir -p /config/whatsapp-wwebjs-session
fi
ln -s /config/whatsapp-wwebjs-session /session
node server.js
