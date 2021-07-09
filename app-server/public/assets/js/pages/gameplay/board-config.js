/**
 * https://chessboardjs.com/examples.html#5003
 */

'use strict';

const game = new Chess();
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

const removeGreySquares = () => {
  $('#chess-board .square-55d63').css('background', '');
};

const greySquare = square => {
  let $square = $('#chess-board .square-' + square);

  let background = whiteSquareGrey;
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey;
  }

  $square.css('background', background);
};

const onDragStart = (source, piece) => {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // or if it's not that side's turn
  if (
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
};

const onDrop = (source, target) => {
  removeGreySquares();

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q', // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    return 'snapback';
  }
};

const onMouseoverSquare = (square, piece) => {
  // get list of possible moves for this square
  const moves = game.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) {
    return;
  }

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

const onMouseoutSquare = (square, piece) => {
  removeGreySquares();
};

const onSnapEnd = () => {
  board.position(game.fen());
};

const board_config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onChange: () => {
    console.log(ChessBoard.objToFen(board.position()));
  },
};
