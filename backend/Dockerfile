FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Make Stockfish executable
RUN chmod +x ./stockfish/stockfish

EXPOSE 3000

CMD ["node", "server.js"]
