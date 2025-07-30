#!/bin/sh
SESSION_DIR="/config/whatsapp-wwebjs-session"

# Ensure persistent session directory exists
mkdir -p "$SESSION_DIR"

# Remove /session if it exists (file, dir, or broken symlink)
rm -rf /session

# Create a symlink: /session → /config/whatsapp-wwebjs-session
ln -s "$SESSION_DIR" /session

# Start your app
node server.js
