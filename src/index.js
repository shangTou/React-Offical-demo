import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

let winnerArray = [];
let winnerType = '';

function Square(props) {
  return (
    <button
      className={props.clsName}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boardRow: 3,
      boardRowSquare: 3,
    }
  }

  renderSquare(i, key) {
    return (
      <Square
        clsName='square'
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={key}
      />
    );
  }

  render() {
    let listArr = [];
    let squareIndex = -1;

    for (let i = 0; i < 3; i++) {
      let squares = (
        <div className="border-row" key={squareIndex}>
          {
            // eslint-disable-next-line no-loop-func
            [0, 1, 2].map(() => {
              squareIndex += 1;
              return this.renderSquare(squareIndex, squareIndex)
            })
          }
        </div>
      )
      listArr.push(squares)
    }

    return (
      <div className={winnerArray.length ? `content ${winnerType}` : 'content'}>
        {listArr}
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coord: {
            x: 0,
            y: 0
          }
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coord = getCoordinate(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        coord
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move},第${step.coord.x}行,第${step.coord.y}列` : 'Go to game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'current' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (this.state.stepNumber === 9) {
        status = '平局';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game" >
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerArray = lines[i];
      if (i < 3) {
        winnerType = `horizontal hor${i + 1}`;
      } else if (i < 6) {
        winnerType = `vertical ver${i - 2}`;
      } else if (i === 6) {
        winnerType = 'left_bias';
      } else if (i === 7) {
        winnerType = 'right_bias';
      }
      return squares[a];
    }
  }
  return null;
}

function getCoordinate(index) {
  // 计算x坐标和y坐标
  let x = 0;
  let y = parseInt(index % 3 + 1);

  index += 1;
  if (index % 3 === 0) {
    x = parseInt(index / 3);
  } else {
    x = parseInt(index / 3) + 1;
  }

  return {
    x,
    y
  }
}
