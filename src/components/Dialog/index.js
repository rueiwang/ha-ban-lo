import React, { Component } from 'react';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      response: {
        ifExist: 'Are you sure to leave the page?',
        updateSuccess: 'Update Successfully!',
        addSuccess: 'Add a new cocktail!'
      }
    };
  }

  componentDidMount() {
    const { type, response } = this.state;
  }

  render() {
    const { tpye, response } = this.state;
    return (
      <h1>Loading</h1>
    );
  }
}
