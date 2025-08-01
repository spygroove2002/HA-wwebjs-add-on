FROM node:18-bullseye-slim

RUN echo "nameserver 1.1.1.1" > /etc/resolv.conf

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package.json
RUN npm install --omit=dev

COPY server.js server.js
COPY run.sh run.sh
COPY openapi.yaml openapi.yaml
RUN chmod +x run.sh

VOLUME ["/session"]
CMD ["sh", "/app/run.sh"]
