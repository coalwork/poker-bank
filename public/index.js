const socket = io();

const get = document.getElementById.bind(document);

addEventListener('DOMContentLoaded', () => {
  const gameCreatorForm = get('create-game');
  const playerInputTemplate = get('player-input');
  const addPlayerButton = get('add-players');
  const playerCardTemplate = get('player-card');
  const playersContainer = get('players');
  const toPlayer = get('pot-to-player');
  const givePot = get('give-pot');

  for (let i = 0; i < 2; i++) {
    const playerInput = playerInputTemplate.content.cloneNode(true);
    gameCreatorForm.prepend(playerInput);
  }

  addPlayerButton.addEventListener('click', () => {
    const playerInput = playerInputTemplate.content.cloneNode(true);
    gameCreatorForm.prepend(playerInput);
  });

  gameCreatorForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputs = document.getElementsByClassName('player-input');
    const game = [...inputs].reduce((obj, input) => {
      obj[input.value] = {
        name: input.value,
        amount: 0
      };
      return obj;
    }, {});

    socket.emit('creategame', game);
    gameCreatorForm.classList.add('hidden');
  });

  givePot.addEventListener('click', () => {
    socket.emit('givepotamount', toPlayer.value);
  });

  socket.on('state', (game) => {
    playersContainer.innerHTML = '';

    const potAmount = get('pot-amount');
    potAmount.textContent = game.__pot.amount;

    Object.values(game).forEach((player) => {
      if (player.name === 'pot') return;

      const playerCard = playerCardTemplate.content.cloneNode(true);
      const name = playerCard.getElementById('name');
      const amount = playerCard.getElementById('amount');
      const deposit = playerCard.getElementById('deposit');
      const bet = playerCard.getElementById('bet');
      const multi = playerCard.getElementById('multi-amount');

      deposit.addEventListener('click', () => {
        socket.emit(
          'amountchange',
          'deposit',
          +multi.value,
          player.name
        );
      });
      bet.addEventListener('click', () => {
        socket.emit(
          'amountchange',
          'bet',
          +multi.value,
          player.name
        );
      });

      name.textContent = player.name;
      amount.textContent = player.amount;
      
      playersContainer.append(playerCard);
    });
  });
});
