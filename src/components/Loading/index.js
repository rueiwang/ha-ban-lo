import React, { Component } from 'react';
import { GlassOfHighball } from '../SVG';


class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    };

    this.valueCount = this.valueCount.bind(this);
  }

  componentDidMount() {
    // this.interval = setInterval(this.valueCount, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  valueCount() {
    const { value } = this.state;
    if (value >= 100) {
      this.setState({
        value: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        value: prevState.value + 10
      }
    ));
  }

  render() {
    const { value } = this.state;
    return (
      <div className="loading-wrap">
        <GlassOfHighball
          className="loading"
          alt="loading"
          percent={value}
        />
      </div>
    );
  }
}

export default Loading;
