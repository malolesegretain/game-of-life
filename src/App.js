import React, { Component } from 'react';
import './App.css';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

class Header extends Component {
  render() {
    return (
      <div>
        <h1>Malo's Conway Game of Life</h1>
      </div>
    );
  }
}

class Box extends Component {

  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
    console.log(this.props.boxid);
  }

  render() {
    return(
      <div
        className = {this.props.boxClass}
        boxid = {this.props.boxid}
        onClick = {this.selectBox}
      />
    );
  }
}

class Grid extends Component {
  render () {
    const width = ((this.props.col * 14));
    let boxClass = "";
    let gridArr = [];

    for (let i = 0; i < this.props.row; i++) {
      for (let j = 0; j < this.props.col; j++) {
        let boxid = i + "-" + j;
        boxClass = this.props.gridFull[i][j]? "box on" : "box off";
        gridArr.push(
          <Box
            boxid = {boxid}
            boxClass = {boxClass}
            key = {boxid}
            row = {i}
            col = {j}
            selectBox = {this.props.selectBox}
          />
        );
      }
    }
    return(
      <div className = "grid" style = {{width : width}}>
        {gridArr}
      </div>
    );
  }
}

class Main extends Component {
  constructor() {
    super();
    this.rows = 30;
    this.cols = 50; 
    this.speed = 100;
    this.state = {
      gridFull : Array(this.rows).fill(Array(this.cols).fill(false)),
      generations : 0,
    }
  }

  selectBox = (row, col) => {
    let gridCopy = cloneArray(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col]
    this.setState(
      {gridFull : gridCopy,}
    )
  }

  startPlaying = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = cloneArray(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;

        if (i > 0) if (g[i-1][j]) count++;
        if (i > 0 && j > 0) if (g[i-1][j-1]) count++;
        if (i > 0 && j < this.cols-1) if (g[i-1][j+1]) count++;
        if (j > 0) if (g[i][j-1]) count++;
        if (j < this.cols-1) if (g[i][j+1]) count++;
        if (i < this.rows-1 && j > 0) if (g[i+1][j-1]) count++;
        if (i < this.rows-1) if (g[i+1][j]) count++;
        if (i < this.rows-1 && j < this.cols-1) if (g[i+1][j+1]) count++;

        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && (count === 3)) g2[i][j] = true;
      }
    }
    this.setState (
      {gridFull : g2,
      generations : this.state.generations +1,}
    )
  }

  seed = () => {
    this.clear();
    let gridCopy = cloneArray(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (gridCopy[i][j]) gridCopy[i][j] = false;
        if (Math.floor(Math.random()*4) === 1) gridCopy[i][j] = true;
      }
    }
    this.setState(
      {gridFull : gridCopy}
    );
  }

  clear = () => {
    clearInterval(this.intervalId);
    this.setState(
      {gridFull : Array(this.rows).fill(Array(this.cols).fill(false)),
       generations : 0}
    );
  }

  pause = () => {
    clearInterval(this.intervalId);
  }

  componentDidMount() {
    this.seed();
  }

  fast = () => {
    this.speed = 100;
    this.startPlaying();
  }

  slow = () => {
    this.speed = 1000;
    this.startPlaying();
  }

  render() {

    return (
      <div>
        {/* Set up the control buttons */}
          <ButtonToolbar className = "container btn-group btn-group-justified">
            <Button onClick = {this.startPlaying} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Play</Button>
            <Button onClick = {this.pause} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Pause</Button>
            <Button onClick = {this.clear} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Clear</Button>
            <Button onClick = {this.fast} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Fast</Button>
            <Button onClick = {this.slow} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Slow</Button>
            <Button onClick = {this.seed} className = "btn-group" style = {{width : "10%"}} bsStyle = "default">Seed</Button>
          </ButtonToolbar>
        {/* Set up the grid */}
          <Grid 
            col = {this.cols}
            row ={this.rows}
            gridFull = {this.state.gridFull}
            selectBox = {this.selectBox}
          />
          <h2 className = "generation">Generations : {this.state.generations}</h2>
      </div>
    );
  }
}

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

class App extends Component {
  render() {
    return (
      <div className = "App">
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
