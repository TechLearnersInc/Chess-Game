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

// function checkFlag() {
//   if (flag == false) {
//     window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
//   } else {
//     /* do something*/
//   }
// }
// checkFlag();

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

socket.on('valid', async message => {
  USER_IS_VALID = true;

  const boardInitialState = {
    boardFen: message.fen,
    localTurn: message.player,
    turn: message.turn,
    freezeBoard: message.freeze,
  };

  updateChessBoard(boardInitialState);
});

socket.on('invalid', async message => {
  USER_IS_VALID = false;
  console.error(`'Server says, ${message}'`);
  notification({
    title: 'Error',
    text: message,
    action: 'show',
  });
  socket.close();
});

socket.on('disconnect', () => {
  if (!USER_IS_VALID) return;
  notification({
    title: 'Disconnected',
    text: 'Got disconnected from server. Will autoreconnect soon but manual refresh is recommended.',
    action: 'show',
  });
});

/**
 * Functions
 */

function updateChessBoard(data) {
  //'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1'
  sessionStorage.setItem('boardFen', data.boardFen);
  sessionStorage.setItem('localTurn', data.localTurn);
  sessionStorage.setItem('chessboard_div_id', chessBoardID.id);
  sessionStorage.setItem('freezeBoard', data.freezeBoard);
  CHESS_BOARD();
}

// notification({ title: "Hi!", text: "Hello World", action: "show" });

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
