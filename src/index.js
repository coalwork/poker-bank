const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const games = [];

app.use(express.static(path.resolve(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.once('creategame', (game) => {
    const gameId = games.push(game) - 1;

    socket.on('amountchange', (type, amount, player1, player2 = null) => {
      if (type === 'deposit') {
        player1.deposit(amount);
      } else if (type === 'withdrawal') {
        player1.withdraw(amount, player2);
      }
    });

    socket.on('disconnect', () => {
      games.splice(gameId, 1);
    });
  });

  console.log(games);
});

httpServer.listen(3000);
