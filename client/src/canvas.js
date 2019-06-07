import React, {Fragment, Component} from "react";
import wasmModule from "./sizer.js";

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      height: this.props.height
    }
    this.ctx;
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
  }

  componentDidUpdate() {
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
  }

  changeSize() {
    this.ctx.clearRect(0, 0, this.state.width, this.state.width.height);
    self = this;
    const instance = wasmModule({
      onRuntimeInitialized() {
        instance.sayHello();
        let sizes = instance.changeSize();
        self.setState({
          width: sizes.get(0),
          height: sizes.get(1)
        });
      }
    });

    console.log(
      this.state.width,
      this.state.height
    );
  }

  render() {
    return (
      <Fragment>
        <button onClick={() => this.changeSize()}>Change</button>
        <br/>
        <canvas ref="canvas" width={this.state.width} height={this.state.height}/>
      </Fragment>
    )
  }
}

Canvas.defaultProps = {
  width: 500,
  height: 500
}

export default Canvas;