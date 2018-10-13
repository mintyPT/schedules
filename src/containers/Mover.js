import React from "react";

class Mover extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  componentDidMount() {
    // document.addEventListener("mousedown", this.mousedown);
    document.addEventListener("mouseup", this.mouseup);
    document.addEventListener("mousemove", this.mousemove);
  }

  componentWillUnmount() {
    //document.removeEventListener("mousedown", this.mousedown);
    document.removeEventListener("mouseup", this.mouseup);
    document.removeEventListener("mousemove", this.mousemove);
  }

  onMouseDown = event => {
    this.setState({ active: true });
  };

  mousedown = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ active: true });
    }
  };

  mouseup = event => {
    this.setState({ active: false });
  };
  mousemove = event => {
    if (this.state.active && this.props.onMouseMove) {
      this.props.onMouseMove(event);
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
    if (this.props.ref) {
      this.props.ref(node);
    }
  };

  render() {
    const { props } = this;
    return (
      <div ref={this.setWrapperRef} onMouseDown={this.onMouseDown}>
        {props.children}
      </div>
    );
  }
}

export default Mover;
