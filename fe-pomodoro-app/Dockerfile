FROM node:22.14.0-slim

WORKDIR /app

COPY /public ./public
COPY /src ./src
COPY /package*.json ./
COPY .env ./
COPY server.js ./

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]