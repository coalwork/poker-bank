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
    game.__pot = {
      name: 'pot',
      amount: 0
    };
    socket.emit('state', game);

    socket.on('amountchange', (
      type,
      amount,
      player1,
      player2 = null
    ) => {
      const p1 = game[player1];
      const p2 = game[player2];
      const pot = game.__pot;

      if (type === 'deposit') {
        p1.amount += amount;
      } else if (type === 'withdrawal') {
        p1.amount -= amount;
        p2.amount += amount;
      } else if (type === 'bet') {
        pot.amount += amount;
        p1.amount -= amount;
      }

      socket.emit('state', game);
    });
    
    socket.on('givepotamount', (player) => {
      game[player].amount += game.__pot.amount;
      game.__pot.amount = 0;

      socket.emit('state', game);
    })

    socket.on('disconnect', () => {
      games.splice(gameId, 1);
    });
  });

});

httpServer.listen(3000);
