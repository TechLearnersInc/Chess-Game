'use strict';

const chessBoardID = document.getElementById('chess-board');
const modalPinCodeID = document.getElementById('modalPinCode');
const modalPinCode = new bootstrap.Modal(modalPinCodeID, { keyboard: false });
const modalSendMessageID = document.getElementById('modalSendMessage');
const modalSendMessage = new bootstrap.Modal(modalSendMessageID, { keyboard: false });
const showPinCode = document.getElementById('showPinCode');
const sendMessage = document.getElementById('sendMessage');
const sendMessageNow = document.getElementById('sendMessageNow');
const joinGamePinCode = document.getElementById('joinGamePinCode');
const opponentPlayerMsgRow = document.getElementById('opponentPlayerMsgRow');
const opponentPlayerMsg = document.getElementById('opponentPlayerMsg');
const userTextMessage = document.getElementById('userTextMessage');
const notificationToastID = document.getElementById('notificationToast');
const notificationToastTitle = document.getElementById('notificationToastTitle');
const notificationToastText = document.getElementById('notificationToastText');
const notificationToast = new bootstrap.Toast(notificationToastID, {
  animation: true,
  autohide: true,
  delay: 5000,
});

const socket = io({
  path: '/gameserver',
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelayMax: 5000,
});

notificationToastID.addEventListener('show.bs.toast', () => {
  notificationToastID.classList.add('animate__animated');
  notificationToastID.classList.add('animate__fadeInDown');
});

notificationToastID.addEventListener('hide.bs.toast', () => {
  notificationToastID.classList.remove('animate__fadeInDown');
  notificationToastID.classList.add('animate__fadeOutUp');
});

notificationToastID.addEventListener('hidden.bs.toast', () => {
  notificationToastID.classList.remove('animate__animated');
  notificationToastID.classList.remove('animate__fadeInDown');
  notificationToastID.classList.remove('animate__fadeOutUp');
});

sendMessage.addEventListener('click', event => {
  event.preventDefault();
  opponentPlayerMsgRow.hidden = true;
  modalSendMessage.show();
});

showPinCode.addEventListener('click', event => {
  event.preventDefault();
  try {
    const chess_game = socket.locals.chess_game;
    socket.emit('pincode-request', chess_game.localPlayer);
  } catch (err) {
    throw error;
  }
});

/**
 * Socketio
 */

// If server refuses connection intentionally
socket.on('connect_error', err => {
  const message = err.message;
  console.error(message);
  notification({
    title: 'Error',
    text: `${message}, Redirectiong to home...`,
    action: 'show',
  });
  socket.close();
  setTimeout(() => window.location.replace('/'), 3 * 1000 /* 3 second */);
});

// Initialize board
socket.on('initialize_board', message => {
  socket.locals = {
    chess_game: new CHESS_BOARD({
      div_id: chessBoardID.id,
      localPlayer: message.player,
    }),
  };
  console.log(message);
});

// Receive move from server
socket.on('move', message => {
  const chess_game = socket.locals.chess_game;
  const gameEvents = chess_game.gameEvents;
  console.log(message);

  if (message.turn === chess_game.localPlayer) {
    chess_game.setBoardFreeze(false);
    chess_game.setFen(message.fen);
    notification({
      title: 'Your Turn!',
      text: "It's your time to make an intelligent move.",
      action: 'show',
    });
  } else {
    chess_game.setBoardFreeze(true);
    chess_game.setFen(message.fen);
    notification({
      title: "Opponent's Turn!",
      text: "It's your opponent's time to make an intelligent move.",
      action: 'show',
    });
  }

  // Local player move
  gameEvents.addEventListener('localmove', event => {
    socket.emit('move', chess_game.localPlayer, event.detail.fen);
    chess_game.setBoardFreeze(true);
  });

  // Check
  gameEvents.addEventListener('check', event => {
    notification({
      title: 'Check!',
      text: "You've got a check to deal with.",
      action: 'show',
    });
  });

  // Draw
  gameEvents.addEventListener('draw', event => {
    socket.emit('gameover');
    notification({
      title: 'Draw!',
      text: 'Unfortunately the game is in draw.',
      action: 'show',
    });
  });

  // Gameover
  gameEvents.addEventListener('gameover', event => {
    socket.emit('gameover');
    notification({
      title: 'Game over!',
      text: 'Unfortunately you lost the game.',
      action: 'show',
    });
  });
});

// Send Message
sendMessageNow.addEventListener('click', event => {
  event.preventDefault();
  try {
    const message = userTextMessage.value;
    socket.emit('send-message', message.trim());
  } catch (err) {
    notification({
      title: 'Status',
      text: 'Message send unsuccessfully.',
      action: 'show',
    });
    throw err;
  }
  modalSendMessage.hide();
  notification({
    title: 'Status',
    text: 'Message send successfully.',
    action: 'show',
  });
});

// Receive Message
socket.on('recv-message', message => {
  opponentPlayerMsgRow.hidden = false;
  opponentPlayerMsg.textContent = message.trim();
  userTextMessage.value = '';
  modalSendMessage.show();
});

// Pincode
socket.on('recv-pincode', obj => {
  joinGamePinCode.value = obj.playerPin;
  modalPinCode.show();
});

// On disconnect
socket.on('disconnect', () => {
  notification({
    title: 'Disconnected',
    text: 'Got disconnected from server. Refresh is recommended.',
    action: 'show',
  });
});

/**
 * Functions
 */

// Notification Toast Show
function notification(args = {}) {
  if (args.action == 'show') {
    const title = args.title || 'Title';
    const text = args.text || 'Body Text';
    notificationToastTitle.innerText = title;
    notificationToastText.innerText = text;
    notificationToast.show();
  } else if (args.action == 'hide') notificationToast.hide();
  else console.error(new Error('Invalid arguement'));
}
