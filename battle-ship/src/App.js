import './App.css';
import React from "react";


function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {
      //props.value
      }
      hi
    </button>
  );
}

class Game extends React.Component {
  handleClick(x,y){
    return;
  }

  constructor(props){
    super(props);
    this.state = {
        player1Board: new Array(7).fill(0).map(() => new Array(7)),
        player2Board: new Array(7).fill(0).map(() => new Array(7)),
        player1Turn: true,
     }
  }
  render(){
    return (
      <Board currentBoard = {this.state.player1Turn ? this.state.player1Board: this.state.player2Board} onClick = {(x,y) => this.handleClick(x,y)} />
    )
  }
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        value={this.props.currentBoard[i][j]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  renderRow(i){
    const row = document.createElement("div");
    row.className = "board-row";
    
    for(let j = 0; j < this.props.currentBoard.length; j++){
      const square =this.renderSquare(i, j);
      row.appendChild(square);
    }
    return row;
  }
  renderBoard(){
    const board = document.createElement("div");
    for(let i = 0; i < this.props.currentBoard.length; i++){
      const row = document.createElement(this.renderRow(i));
      board.appendChild(row);
    }
    return board;
  }
  render() {
    return (
      <div>
        hi
        
        
        {
        //this.renderBoard()
        this.props.currentBoard.map((row, i) => {return this.renderRow(i)})
        }
      </div>
    );
  }
}

function App() {
  return <Game />
}

export default App;
