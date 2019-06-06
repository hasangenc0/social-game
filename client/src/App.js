import React, { Component } from 'react';
import { socket } from './config';

class App extends Component {

  constructor(props) {
    super(props);
    this.ws = new WebSocket('ws://' + socket.url);
    this.ws.onmessage = function(e) {
      var msg = JSON.parse(e.data);
      console.log(msg);
    };

  }

  componentDidMount() {

  }

  send() {
    this.ws.send(
      JSON.stringify({
        x: 61,
        y: 34
      })
    );
  }
  render() {
    return (
      <button onClick={() => this.send()} >
        slm
      </button>
    );
  }
}

export default App;
