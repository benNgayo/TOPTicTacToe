const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (index, symbol) => {
    if (index >= 0 && index < 9 && board[index] === "") {
      board[index] = symbol;
    }
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return {
    getBoard,
    updateBoard,
    resetBoard,
  };
})();

const Player = (name, symbol) => {
  return {
    name,
    symbol,
  };
};

const GameController = (() => {
  let currentPlayer;
  let otherPlayer;
  let gameOver = false;

  const startGame = (player1, player2) => {
    currentPlayer = player1;
    otherPlayer = player2;
    gameOver = false;
    Gameboard.resetBoard();
    renderBoard();
  };

  const switchPlayer = () => {
    [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
  };

  const makeMove = (index) => {
    if (!gameOver && Gameboard.getBoard()[index] === "") {
      Gameboard.updateBoard(index, currentPlayer.symbol);
      if (checkWin()) {
        alert(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (Gameboard.getBoard().every((cell) => cell !== "")) {
        alert("It's a tie!");
        gameOver = true;
      } else {
        switchPlayer();
      }
      renderBoard();
    }
  };

  const checkWin = () => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    return winPatterns.some(
      (pattern) =>
        b[pattern[0]] === currentPlayer.symbol &&
        b[pattern[1]] === currentPlayer.symbol &&
        b[pattern[2]] === currentPlayer.symbol
    );
  };

  const renderBoard = () => {
    const cells = document.querySelectorAll(".cell");
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  return {
    startGame,
    makeMove,
    renderBoard,
  };
})();

document.getElementById("start-game").addEventListener("click", () => {
  const player1Name =
    document.getElementById("player1-name").value || "Player 1";
  const player1Symbol = document.getElementById("player1-symbol").value || "X";
  const player2Name =
    document.getElementById("player2-name").value || "Player 2";
  const player2Symbol = document.getElementById("player2-symbol").value || "O";

  const player1 = Player(player1Name, player1Symbol);
  const player2 = Player(player2Name, player2Symbol);

  GameController.startGame(player1, player2);

  document.getElementById("player-setup").classList.add("hidden");
  document.getElementById("game-board").classList.remove("hidden");
});

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    GameController.makeMove(index);
  });
});

document.getElementById("reset-game").addEventListener("click", () => {
  GameController.startGame(Player("Player 1", "X"), Player("Player 2", "O"));
  document.getElementById("player-setup").classList.remove("hidden");
  document.getElementById("game-board").classList.add("hidden");
});
