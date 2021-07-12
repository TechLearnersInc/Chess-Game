'use strict';

/**
 * Refrence: https://chessboardjs.com/examples.html#5003
 */

function CHESS_BOARD() {
  const boardFen = sessionStorage.getItem('boardFen');
  const gameTurn = sessionStorage.getItem('localTurn');
  const div_id = sessionStorage.getItem('chessboard_div_id');
  const freezeBoard = sessionStorage.getItem('freezeBoard') === 'true';

  sessionStorage.removeItem('localFen');

  const game = new Chess(boardFen);
  const whiteSquareGrey = '#a9a9a9';
  const blackSquareGrey = '#696969';

  game.setTurn(gameTurn);

  const removeGreySquares = () => {
    $('#chess-board .square-55d63').css('background', '');
  };

  const greySquare = square => {
    let $square = $('#chess-board .square-' + square);

    let background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) background = blackSquareGrey;

    $square.css('background', background);
  };

  const onDragStart = (source, piece) => {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // or if it's not that side's turn
    if (
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)
    )
      return false;
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
    if (move === null) return 'snapback';
  };

  const onMouseoverSquare = (square, piece) => {
    // get list of possible moves for this square
    const moves = game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i += 1) greySquare(moves[i].to);
  };

  const onMouseoutSquare = (square, piece) => {
    removeGreySquares();
  };

  const onSnapEnd = () => {
    const fen = game.fen();
    board.position(fen, true);
    sessionStorage.setItem('localFen', fen);
  };

  let board_config;
  switch (freezeBoard) {
    case true:
      board_config = {
        draggable: false,
        orientation: gameTurn,
        onDragStart: (source, piece) => {
          return false;
        },
        onDrop: (source, target) => {
          return false;
        },
        onMouseoutSquare,
        onMouseoverSquare,
        onSnapEnd: () => {},
      };
      break;
    case false:
      board_config = {
        draggable: true,
        orientation: gameTurn,
        onDragStart,
        onDrop,
        onMouseoutSquare,
        onMouseoverSquare,
        onSnapEnd,
      };
      break;
    default:
      throw new Error('Invalid freeze argunement.');
  }

  const board = Chessboard(div_id, board_config);
  board.position(boardFen, true);

  $(window).resize(board.resize);
}
