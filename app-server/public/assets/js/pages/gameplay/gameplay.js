'use strict';

const chessBoardID = document.getElementById('chess-board');
const modalConfirmID = document.getElementById('modalConfirm');
const modalConfirmNoID = document.getElementById('modalConfirmNo');
const modalConfirmYesID = document.getElementById('modalConfirmYes');
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
let USER_IS_VALID = true;

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

/**
 * Socketio
 */

// Setup board
socket.on('initialize-board', async message => {
  USER_IS_VALID = true;
  console.log(message);
  updateChessBoard({
    boardFen: message.fen,
    localTurn: message.player,
    freezeBoard: message.freeze,
  })
    .then(freeze => {
      if (!freeze) waitAndSendMoveToServer();
    })
    .catch(err => console.error(err));
});

// If valid
socket.on('invalid', async message => {
  USER_IS_VALID = false;
  console.error(`'Server says, ${message}'`);
  notification({
    title: 'Error',
    text: message,
    action: 'show',
  });
  // socket.close();
});

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

// Send move to server
function waitAndSendMoveToServer() {
  const intervalID = setInterval(() => {
    const localFen = sessionStorage.getItem('localFen');
    if (localFen) {
      socket.emit('move', localFen);
      sessionStorage.removeItem('localFen');
      clearInterval(intervalID);
    } else console.log('Waiting for your move...');
  }, 200 /* 200 mlisecond */);

  setTimeout(() => {
    clearInterval(intervalID);
  }, 20 * 1000 /* 20 second */);
}

// Receive move from server
socket.on('move', async message => {});

// On disconnect
socket.on('disconnect', () => {
  if (!USER_IS_VALID) return;
  notification({
    title: 'Disconnected',
    text: 'Got disconnected from server. Will autoreconnect soon but manual refresh is recommended.',
    action: 'show',
  });
});

socket.on('reconnect_failed', () => {
  console.log('Hello World');
});

/**
 * Functions
 */

function updateChessBoard(data) {
  return new Promise((resolve, reject) => {
    try {
      sessionStorage.setItem('chessboard_div_id', chessBoardID.id);
      if (data.boardFen) sessionStorage.setItem('boardFen', data.boardFen);
      if (data.localTurn) sessionStorage.setItem('localTurn', data.localTurn);
      if (data.freezeBoard) sessionStorage.setItem('freezeBoard', data.freezeBoard);
      CHESS_BOARD(); // Update
      resolve(data.freezeBoard);
    } catch (err) {
      reject(err);
    }
  });
}

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
