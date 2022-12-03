import './App.css';
import React from "react";


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
  handleClick(x,y){
    return;
  }

  constructor(props){
    let size = 7
    const newBoard = [...new Array(size).keys()].map((i) => [...new Array(size).keys()].map((j) => (i*7)+j));
    super(props);
    this.state = {
        player1Board: JSON.parse(JSON.stringify(newBoard)),
        player2Board: JSON.parse(JSON.stringify(newBoard)),
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
  render() {
    return (
      <div>    
      {
        this.props.currentBoard.map((row, i) => {
          let index = i;
          return(
            <div className = "board-row">
              {this.props.currentBoard[0].map((square, j) => {
                return this.renderSquare(index, j);
              })}
            </div>
          )
          })
      }
      </div>
    );
  }
}

function App() {
  return <Game />
}

export default App;
