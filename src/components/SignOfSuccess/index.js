import React, { Component } from 'react';

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.interval = setInterval(this.indexCount, 1000);
  }


  render() {
    return (
      <div className="sign-of-success">
        <h4>New Collection!</h4>
      </div>
    );
  }
}

export default Loading;
