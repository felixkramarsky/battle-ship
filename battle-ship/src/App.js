import './App.css';
import React from "react";

const size = 7;

function Square(props) {
  // a square is just a button
  return (
    <button className="square" onClick={() => props.onClick()}>
      { props.value }
    </button>
  );
}

class Game extends React.Component {
  //This is function is passed to the board and then to the square
  handleClick(i,j){
    //if there is a winner, do nothing
    if(this.state.winner){return}
    // the new board is the board of the player who just clicked
    let replaceBoard = this.state.player1Turn ? JSON.parse(JSON.stringify(this.state.player1Board)): JSON.parse(JSON.stringify(this.state.player2Board));
    if(!replaceBoard[i][j].hit){
    replaceBoard[i][j].hit = true;
    console.log(replaceBoard[i][j].hit)
    console.log(this.state.player1Board[i][j].hit)
    if(replaceBoard[i][j].ship){
      let winner = this.state.player1Turn ? "1": "2";
      for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
          if(replaceBoard[i][j].ship && !replaceBoard[i][j].hit){
            winner = null;
          }
        }
      }
      this.setState({
        winner: winner
      })
    }
    this.setState({
      player1Board: this.state.player1Turn ? replaceBoard: this.state.player1Board,
      player2Board: this.state.player1Turn ? this.state.player2Board: replaceBoard,
      player1Turn: !this.state.player1Turn,
    })
    }
    return;
  }

  genEnemyBoard(board){
    const newBoard = JSON.parse(JSON.stringify(board));
    for(let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        if(newBoard[i][j].ship && !newBoard[i][j].hit){
          newBoard[i][j].ship = false;
        }
      }
    }
    return newBoard;
  }

  constructor(props){
    const newBoard = new Array(size).fill(0).map((i) => new Array(size).fill({ship: false, hit: false}));
    let player1Board = JSON.parse(JSON.stringify(newBoard));
    player1Board[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)].ship = true;
    let player2Board = JSON.parse(JSON.stringify(newBoard));
    player2Board[Math.floor(Math.random()*size)][Math.floor(Math.random()*size)].ship = true;
    super(props);
    this.state = {
        player1Board: player1Board,
        player2Board: player2Board,
        player1Turn: true,
        winner: null
     }

  }
  render(){
    return (
      <div id = "game">
        {this.state.winner? <h1>Player {this.state.winner} Wins!</h1>: null}
        {this.state.player1Turn? <h1>Player 1</h1>: <h1>Player 2</h1>} 
        <Board clickable = {true} size = {size} board = "enemy" currentBoard = {this.state.player1Turn ? this.genEnemyBoard(this.state.player1Board): this.genEnemyBoard(this.state.player2Board)} onClick = {(x,y) => this.handleClick(x,y)} />
        <Board clickable = {false} size = {size} board = "me" currentBoard = {this.state.player1Turn ? this.state.player2Board: this.state.player1Board} onClick = {(x,y) => this.handleClick(x,y)} />
      </div>
    )
  }
}

class Board extends React.Component {

  getValue(square){
    if(square.hit){
      if(square.ship){
        return "X";
      }
      return "O";
    }
    if(square.ship){
      return "S";
    }
    return null;
  }

  renderSquare(i,j) {
    return (
      <Square
        key = {i*this.props.size+j}
        value={this.getValue(this.props.currentBoard[i][j])}
        onClick={this.props.clickable?() => this.props.onClick(i,j):null}
      />
    );
  }
  
  render() {
    return (
      <div>
        {this.props.board === "enemy"? <h2>Enemy Board</h2>: <h2>Allied Board</h2>}    
        <div>
        {
          this.props.currentBoard.map((row, i) => {
            return(
              <div key = {i} className = "board-row">
                {this.props.currentBoard[0].map((square, j) => {
                  return this.renderSquare(i, j);
                })}
              </div>
            )
            })
        }
        </div>
      </div>
    );
  }
}

function App() {
  return <Game />
}

export default App;
