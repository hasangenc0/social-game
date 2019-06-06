import React, { Component, Fragment } from 'react';
import { socket } from './config';

class App extends Component {

  constructor(props) {
    super(props);
    this.wasm = import("./sizer.wasm");
    this.ws = new WebSocket('ws://' + socket.url);
    this.ws.onmessage = function(e) {
      var msg = JSON.parse(e.data);
      console.log(msg);
    };

  }

  componentDidMount() {
    let canvas = this.refs.canvas.getContext('2d');
    canvas.fillRect(0, 0, this.props.width, this.props.height);
  }

  send() {
    this.ws.send(
      JSON.stringify({
        x: 61,
        y: 34
      })
    );
  }

  changeWidth() {
    this.wasm.then(wasm => {
      const size = wasm._Z10changeSizev;
      console.log(size);
    });
  }

  render() {
    return (
      <Fragment>
        <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
        <br/>
        <button onClick={() => this.changeWidth()}>Değiştir</button>
      </Fragment>
    );
  }
}

App.defaultProps = {
  width: 720,
  height: 560
}

export default App;
