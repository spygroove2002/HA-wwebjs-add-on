FROM node:18-alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
WORKDIR /app

# Install app dependencies
COPY package.json package.json
RUN npm install

# Copy app files
COPY server.js server.js
COPY run.sh run.sh
RUN chmod +x run.sh

VOLUME ["/session"]
CMD ["sh", "/app/run.sh"]
