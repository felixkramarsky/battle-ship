import './App.css';
import React from "react";

const size = 7;

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {
      props.value
      }
      
    </button>
  );
}

class Game extends React.Component {

  handleClick(i,j){
    const replaceBoard = this.state.player1Turn ? this.state.player1Board: this.state.player2Board;
    if(!replaceBoard[i][j].hit){
    replaceBoard[i][j].hit = true;
    this.setState({
      player1Board: this.state.player1Turn ? replaceBoard: this.state.player1Board,
      player2Board: this.state.player1Turn ? this.state.player2Board: replaceBoard,
      player1Turn: !this.state.player1Turn
    })
    }
    return;
  }

  constructor(props){
    
    //const newBoard = [...new Array(size).keys()].map((i) => [...new Array(size).keys()].map((j) => (i*7)+j));
    const newBoard = new Array(size).fill(0).map((i) => new Array(size).fill({ship: false, hit: false}));
    super(props);
    this.state = {
        player1Board: JSON.parse(JSON.stringify(newBoard)),
        player2Board: JSON.parse(JSON.stringify(newBoard)),
        player1Turn: true,
     }
  }
  render(){
    return (
      //<Board size = {size} player1 = {this.state.player1Turn} currentBoard = {this.state.player1Turn ? this.state.player1Board: this.state.player2Board} onClick = {(x,y) => this.handleClick(x,y)} />
      <div className="game">
      <Board size = {size} player1 = {true} currentBoard = {this.state.player1Board} onClick = {(x,y) => this.handleClick(x,y)} />
      <hr/>
      <Board size = {size} player1 = {false} currentBoard = {this.state.player2Board} onClick = {(x,y) => this.handleClick(x,y)} />
      </div>
    )
  }
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        key = {i*this.props.size+j}
        value={this.props.currentBoard[i][j].hit?"X":null}
        onClick={() => this.props.onClick(i,j)}
      />
    );
  }
  
  render() {
    return (
      <div>
        {this.props.player1? <h1>Player 1</h1>: <h1>Player 2</h1>}    
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
