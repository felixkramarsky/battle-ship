import './App.css';
import React from "react";

const size = 7;
const shipsPerPlayer = 5;

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
    //create a new history
    let newHistory = [...this.state.history, {player1Board: this.state.player1Board, player2Board: this.state.player2Board}];
    //if there is a winner, do nothing
    if(this.state.winner){return}
    // the new board is the board of the player who just clicked
    let newBoard = this.state.player1Turn ? JSON.parse(JSON.stringify(this.state.player2Board)): JSON.parse(JSON.stringify(this.state.player1Board));
    //if the square has not been hit, hit it
    if(!newBoard[i][j].hit){
    newBoard[i][j].hit = true;
    //if the square has a ship, check if the player has won
    if(newBoard[i][j].ship){
      //set winner to the player who just clicked
      let winner = this.state.player1Turn ? "1": "2";
      //if any of the squares have a ship that hasnt been hit, set winner to null
      for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
          if(newBoard[i][j].ship && !newBoard[i][j].hit){
            winner = null;
          }
        }
      }
      //update the winner
      this.setState({
        winner: winner
      })
    }
    // if not hit, switch to other's turn
   if(!newBoard[i][j].ship){
      this.setState({
        waiting: true,
        player1Turn: !this.state.player1Turn,
      })
    }
    // update board
    this.setState({
      history: newHistory,
      player1Board: this.state.player1Turn ? this.state.player1Board:newBoard,
      player2Board: this.state.player1Turn ? newBoard : this.state.player2Board,
})
    }
    
    return;
  }

  undo(){
    // if game is won, do nothing
    if (this.state.winner) return
    //if there is no history, do nothing
    if(this.state.history.length === 0){
      console.log("no history!")
      return
    }
    //get the last board state
    let lastState = this.state.history[this.state.history.length-1];
    const newHistory = this.state.history.slice(0,this.state.history.length-1);
    //update the state
    this.setState({
      waiting: true,
      history: newHistory,
      player1Board: lastState.player1Board,
      player2Board: lastState.player2Board,
      player1Turn: !this.state.player1Turn,
    }) 
  }

  //create a board with hidden (unhit) ships
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
    super(props);
    //generate an array of the size of the board
    const newBoard = new Array(size).fill(0).map((i) => new Array(size).fill({ship: false, hit: false}));
    //copy the array and place a ship in a random location on each board
    let player1Board = JSON.parse(JSON.stringify(newBoard));
    let player2Board = JSON.parse(JSON.stringify(newBoard));
    //
    let ships = 0;
    while(ships < shipsPerPlayer){
      let randCoord = [Math.floor(Math.random()*size), Math.floor(Math.random()*size)];
      if(!player1Board[randCoord[0]][randCoord[1]].ship){
        ships++;
        player1Board[randCoord[0]][randCoord[1]].ship = true;
    
      }
    }    
    ships = 0
    while(ships < shipsPerPlayer){
      let randCoord = [Math.floor(Math.random()*size),Math.floor(Math.random()*size)];
      if(!player2Board[randCoord[0]][randCoord[1]].ship){
        ships++;
        player2Board[randCoord[0]][randCoord[1]].ship = true;
      }
    }
    //set the initial state
    this.state = {
        history: [],
        player1Board: player1Board, 
        player2Board: player2Board,
        waiting: true,
        player1Turn: true,
        winner: null,
     }

  }
  render(){
    if(this.state.waiting){
      return (
        <div id = "game">
          <h1>Waiting for player {this.state.player1Turn? "1": "2"}</h1>
          <button onClick = {() => this.setState({waiting:false})}>Go!</button>
        </div>
      )
    }
    return (
      <div id = "game">
        {this.state.winner? <h1>Player {this.state.winner} Wins!</h1>: null}
        {this.state.player1Turn? <h1>Player 1</h1>: <h1>Player 2</h1>} 
        <Board clickable = {true} size = {size} board = "enemy" currentBoard = {this.state.player1Turn ? this.genEnemyBoard(this.state.player2Board): this.genEnemyBoard(this.state.player1Board)} onClick = {(x,y) => this.handleClick(x,y)} />
        <Board clickable = {false} size = {size} board = "me" currentBoard = {this.state.player1Turn ? this.state.player1Board: this.state.player2Board} onClick = {(x,y) => this.handleClick(x,y)} />
        <Undo onClick = {() => this.undo()}/>
      </div>
    )
  }
}

class Undo extends React.Component {
  render(){
    return (
      <button onClick = {() => this.props.onClick()}>Undo</button>
    )
  }
}

class Board extends React.Component {
  //Figure out the value to place in a square
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

  //create a square element
  renderSquare(i,j) {
    return (
      <Square
        key = {i*this.props.size+j}
        value={this.getValue(this.props.currentBoard[i][j])}
        onClick={this.props.clickable?() => this.props.onClick(i,j):()=>console.log("not clickable")}
      />
    );
  }
  
  render() {
    return (
      <div>
        {this.props.board === "enemy"? <h2>Enemy Board</h2>: <h2>Allied Board</h2>}    
        <div>
        {
          //create a row for each row in the board
          this.props.currentBoard.map((row, i) => {
            return(
              //create a square for each square in the row
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
