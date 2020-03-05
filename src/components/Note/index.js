import React, { Component } from 'react';
import '../../css/account-note.css';

import ShoppingList from '../ShoppingList';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseWine: [],
      liqueur: [],
      other: [],
      tobuy: [],
      translateDistance: 0,
      slideTarget: 'baseWine',
      randomSuggestions: [],
      isShoppingListShown: true
    };

    this.ulWidth = React.createRef();
    this.liWidth = React.createRef();
  }

  componentDidMount() {
    this.classifyIngredientsByType();
  }

  classifyIngredientsByType = () => {
    const { userData, DataInSessionStorage } = this.props;
    const baseWineAry = [];
    const liqueurAry = [];
    const otherAry = [];
    const tobuyAry = [];

    // status 1: member already has it; status 2: member wants to buy it
    userData.member_ingredients.map((userItem) => {
      DataInSessionStorage.ingredientData.map((item) => {
        if (item.ingredient_id === userItem.id) {
          if (userItem.status === 1) {
            if (item.ingredient_type === 'base wine') {
              baseWineAry.push({ ...item, status: 1 });
            } else if (item.ingredient_type === 'liqueur') {
              liqueurAry.push({ ...item, status: 1 });
            } else if (item.ingredient_type === 'other') {
              otherAry.push({ ...item, status: 1 });
            }
          } else if (userItem.status === 2) {
            tobuyAry.push({ ...item, status: 2 });
          }
        }
      });
    });

    this.setState({
      baseWine: [...baseWineAry],
      liqueur: [...liqueurAry],
      other: [...otherAry],
      tobuy: [...tobuyAry]
    });
  }

  slideBackward = (e, itemNum) => {
    const { target } = e.target.dataset;
    const { translateDistance } = this.state;
    const differenceBetweenUlAndLi = (this.ulWidth.current.offsetWidth - (this.liWidth.current.offsetWidth * itemNum));
    if (differenceBetweenUlAndLi > 0) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    if (differenceBetweenUlAndLi > translateDistance) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translateDistance: prevState.translateDistance - 100
      }
    ));
  }

  slideForward = (e) => {
    const { target } = e.target.dataset;
    const { translateDistance } = this.state;
    if (translateDistance <= 0) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translateDistance: prevState.translateDistance + 100
      }
    ));
  }

  changeIngredientsStatus = (e, id, statusNum) => {
    e.preventDefault();
    const { firebase, userData } = this.props;
    // status -1: user doesn't need it
    if (statusNum === -1) {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(id)
        .delete();
    } else {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(id)
        .update({ status: statusNum });
    }
  }

  showShoppingList = () => {
    const { isShoppingListShown } = this.state;
    this.setState({
      isShoppingListShown: !isShoppingListShown
    });
  }

  renderSlideBoxByIngredientsType = (arr, type) => {
    const { slideTarget, translateDistance } = this.state;
    return (
      <div className={type}>
        <h3>{type}</h3>
        <div className="slide-box">
          <button className="goBackward" type="button" data-target={type} onClick={(e) => this.slideBackward(e, arr.length)}>
            <img src="/imgs/arrow-left.png" alt="backward" data-target={type} />
          </button>
          <ul className={`${type}-list`} ref={this.ulWidth}>
            { arr.length === 0
              ? <li>LOADING</li>
              : arr.map((item, i) => (
                <li
                  key={i}
                  ref={this.liWidth}
                  className={type}
                  style={slideTarget === type
                    ? {
                      transform: `translateX(${translateDistance}px)`
                    }
                    : {
                      transform: 'translateX(0px)'
                    }}
                >
                  <input
                    type="image"
                    src="../../imgs/delete.png"
                    alt=""
                    className="deleteBtn"
                    onClick={(e) => this.changeIngredientsStatus(e, item.ingredient_id, 2)}
                  />
                  <img src={item.ingredient_pic} alt="icon" />
                  <h5>{item.ingredient_name}</h5>
                </li>
              ))}
          </ul>
          <button className="goForward" type="button" data-target={type} onClick={(e) => this.slideForward(e)}>
            <img src="/imgs/arrow-right.png" alt="forward" data-target={type} />
          </button>
        </div>
      </div>
    );
  }

  render() {
    const {
      baseWine, liqueur, other, tobuy, isShoppingListShown
    } = this.state;
    return (
      <>
        <div className="ingredients-wrap">
          <ShoppingList
            tobuy={tobuy}
            isShoppingListShown={isShoppingListShown}
            showShoppingList={this.showShoppingList}
            changeIngredientsStatus={this.changeIngredientsStatus}
          />

          {this.renderSlideBoxByIngredientsType(baseWine, 'baseWine')}
          {this.renderSlideBoxByIngredientsType(liqueur, 'liqueur')}
          {this.renderSlideBoxByIngredientsType(other, 'other')}
        </div>
      </>

    );
  }
}
