#!/bin/sh
SESSION_DIR="/config/whatsapp-wwebjs-session"

# Ensure persistent session directory exists
mkdir -p "$SESSION_DIR"
chmod -R 777 "$SESSION_DIR"

# No symlink needed
node server.js
