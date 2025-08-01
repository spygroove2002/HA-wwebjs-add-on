FROM node:18-alpine

# Install Chromium & required fonts for Puppeteer
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package.json
RUN npm install --omit=dev

# Copy application files
COPY server.js server.js
COPY run.sh run.sh
COPY openapi.yaml openapi.yaml
RUN chmod +x run.sh

VOLUME ["/session"]
CMD ["sh", "/app/run.sh"]
