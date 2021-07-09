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
});

// let chess_board = update_chess_board({
//   div_id: 'chess-board',
//   turn: 'black',
//   fenString: 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
// });

sessionStorage.setItem('boardFen', 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
sessionStorage.setItem('localTurn', 'black');
sessionStorage.setItem('chessboard_div_id', 'chess-board');
sessionStorage.setItem('freezeBoard', false);

update_chess_board();

setTimeout(() => {
  sessionStorage.setItem(
    'boardFen',
    'r1bqkb1r/pppppppp/n6n/8/8/N6N/PPPPPPPP/R1BQKB1R w KQkq - 0 1'
  );
  sessionStorage.setItem('freezeBoard', 'true');
  update_chess_board();
}, 5 * 1000);

setTimeout(() => {
  sessionStorage.setItem(
    'boardFen',
    'r1bqkb1r/pp1pp1pp/n6n/2p2p2/2P2P2/N6N/PP1PP1PP/R1BQKB1R w KQkq - 0 1'
  );
  sessionStorage.setItem('freezeBoard', 'false');
  update_chess_board();
}, 10 * 1000);

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

/**
 * Functions
 */

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
