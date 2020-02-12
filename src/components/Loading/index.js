import React, { Component } from 'react';
import { LoadingIcon } from '../SVG';


class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };

    this.indexCount = this.indexCount.bind(this);
  }

  componentDidMount() {
    // this.interval = setInterval(this.indexCount, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  indexCount() {
    const { index } = this.state;
    if (index >= 6) {
      this.setState({
        index: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        index: prevState.index + 1
      }
    ));
  }

  render() {
    const { index } = this.state;
    return (
      <div className="loading-wrap">
        <LoadingIcon index={index} />
      </div>
    );
  }
}

export default Loading;
