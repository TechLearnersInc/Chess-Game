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

// Receive move from server
socket.on('move', async message => {
  console.log(message);
  const chess_game = new CHESS_BOARD({
    div_id: chessBoardID.id,
    localPlayer: 'black',
  });
  chess_game.setBoardFreeze(false);
  let old_fen = chess_game.getFen();

  let ok = setInterval(() => {
    const new_fen = old_fen !== chess_game.getFen();
    console.log(new_fen);
    if (new_fen) {
      console.log(chess_game.getFen());
      chess_game.setBoardFreeze(true);
      clearInterval(ok);
    }
  }, 50);
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
