import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardContent = [];

    for (let i = 0; i < 3; i++) {
      boardContent.push(
        <div className="board-row" key={i}>
          {this.renderSquare(i * 3)}
          {this.renderSquare(i * 3 + 1)}
          {this.renderSquare(i * 3 + 2)}
        </div>
      );
    }

    return <div>{boardContent}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      movesHistory: [{ row: 0, column: 0 }],
      xIsNext: true,
      stepNumber: 0,
      sortAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const movesHistory = this.state.movesHistory.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const newMove = calculatePosition(i);

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      movesHistory: movesHistory.concat(newMove),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const movesHistory = this.state.movesHistory;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const { row, column } = movesHistory[move];
      const desc = move
        ? `Go to move ${move} (${column}, ${row})`
        : "Go to game start";
      return (
        <li
          key={move}
          style={
            move === this.state.stepNumber
              ? { fontWeight: "bold" }
              : { fontWeight: "normal" }
          }
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    function sortList(moves) {
      // console.log(moves);
      // moves.sort((a, b) => {
      //   return a.key - b.key;
      // });
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
            <button className="sort-button" onClick={() => sortList(moves)}>
              Sort
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculatePosition(position) {
  const row = Math.trunc(position / 3) + 1;
  const column = Math.trunc(position % 3) + 1;
  return { row: row, column: column };
}
