import React, { Component } from 'react';

export default class Explanation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalShow: false
    };
  }

    toggleModal = () => {
      const { isModalShow } = this.state;
      this.setState({ isModalShow: !isModalShow });
    }

    render() {
      const { isModalShow } = this.state;
      return (
        <div className="explanation-modal-wrap">
          <img
            src="../../imgs/question.png"
            alt="question"
            onMouseOver={this.toggleModal}
            onMouseOut={this.toggleModal}
            onClick={this.toggleModal}
          />
          {
              isModalShow
                ? (
                  <div className="explanation-modal">
                    <p>
If you already have the ingredient, click
                      <span><img src="../../imgs/plus.png" alt="add" /></span>
                    , icon will change to
                      <span><img src="../../imgs/ok.png" alt="OK" /></span>
                    .
                      {' '}
If you want to add the ingredient to your shopping list, click
                      <span><img src="../imgs/shopping-list.png" alt="I want this" /></span>
                    , icon will change to
                      <span><img src="../imgs/shop-list-already.png" alt="on my shopping list" /></span>
.
                    </p>
                  </div>
                )
                : ''
          }
        </div>
      );
    }
}
