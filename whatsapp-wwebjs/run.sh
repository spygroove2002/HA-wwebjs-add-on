#!/bin/sh
SESSION_DIR="/config/whatsapp-wwebjs-session"

# Ensure persistent session directory exists
mkdir -p "$SESSION_DIR"
chmod -R 777 "$SESSION_DIR"

echo "Launching with session directory: $SESSION_DIR"

node server.js
