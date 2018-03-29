import React, { Component } from 'react';
import Forces from './force'
class App extends Component {

  componentDidMount(){
    new Forces
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Force Lab</h1>
        </header>
        <div className="Forces-container" id="forces-container"></div>
      </div>
    );
  }
}

export default App;
