'use strict';

/**
 * Reference: https://chessboardjs.com/examples.html#5003
 */

class CHESS_BOARD {
  constructor(config) {
    this.div_id = config.div_id;
    this.localPlayer = config.localPlayer;
    this.board = null;
    this.game = null;
    this.gameEvents = null;
    this.defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.initialize_board();
  }

  initialize_board() {
    const div_id = this.div_id;
    const gameTurn = this.localPlayer;
    const defaultFen = this.defaultFen;
    const game = new Chess();
    const whiteSquareGrey = '#a9a9a9';
    const blackSquareGrey = '#696969';
    const board = Chessboard(div_id, {
      draggable: true,
      orientation: gameTurn,
      onDragStart,
      onDrop,
      onMouseoutSquare,
      onMouseoverSquare,
      onSnapEnd,
    });

    game.load(defaultFen);
    game.setTurn(gameTurn);
    game.freeze_board = true;
    game.custom_event_target = new EventTarget();
    board.position(defaultFen, true);
    window.addEventListener('resize', board.resize);

    this.board = board;
    this.game = game;
    this.gameEvents = game.custom_event_target;

    function removeGreySquares() {
      $('#chess-board .square-55d63').css('background', '');
    }

    function greySquare(square) {
      let $square = $('#chess-board .square-' + square);

      let background = whiteSquareGrey;
      if ($square.hasClass('black-3c85d')) background = blackSquareGrey;

      $square.css('background', background);
    }

    function onDragStart(source, piece) {
      if (game.freeze_board) return false;

      // do not pick up pieces if the game is draw
      if (game.in_draw()) {
        const game_draw_custom_event = new CustomEvent('draw', {});
        game.custom_event_target.dispatchEvent(game_draw_custom_event);
        return false;
      }

      // do not pick up pieces if the game is over
      if (game.game_over()) {
        const game_over_custom_event = new CustomEvent('gameover', {});
        game.custom_event_target.dispatchEvent(game_over_custom_event);
        return false;
      }

      // if in check
      if (game.in_check()) {
        const check_custom_event = new CustomEvent('check', {});
        game.custom_event_target.dispatchEvent(check_custom_event);
      }

      // or if it's not that side's turn
      if (
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)
      )
        return false;
    }

    function onDrop(source, target) {
      if (game.freeze_board) return false;

      removeGreySquares();

      // see if the move is legal
      const move = game.move({
        from: source,
        to: target,
        promotion: 'q', // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return 'snapback';
    }

    function onMouseoverSquare(square, piece) {
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
    }

    function onMouseoutSquare(square, piece) {
      removeGreySquares();
    }

    function onSnapEnd() {
      if (game.freeze_board) return false;

      const fen = game.fen();
      board.position(fen, true);

      game.custom_event_target.dispatchEvent(
        new CustomEvent('localmove', {
          detail: { fen },
        })
      );
    }
  }

  refresh_board() {
    this.initialize_board();
  }

  getBoardObj() {
    return this.board;
  }

  getGameObj() {
    return this.game;
  }

  setBoardFreeze(bool_val) {
    const game = this.getGameObj();
    game.freeze_board = bool_val;
  }

  isBoardFreezed() {
    const game = this.getGameObj();
    return game.freeze_board;
  }

  setFen(fen) {
    const game = this.getGameObj();
    const board = this.getBoardObj();

    game.load(fen);
    board.position(fen, true);
  }

  getFen() {
    const game = this.getGameObj();
    return game.fen();
  }
}
