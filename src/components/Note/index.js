import React, { Component } from 'react';

import ShoppingList from '../ShoppingList';
import SlideBox from '../SlideBox';

import '../../css/account-note.css';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseWine: [],
      liqueur: [],
      other: [],
      tobuy: [],
      isShoppingListShown: true
    };
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

          <SlideBox
            type="baseWine"
            arr={baseWine}
            event={this.changeIngredientsStatus}
          />
          <SlideBox
            type="liqueur"
            arr={liqueur}
            event={this.changeIngredientsStatus}
          />
          <SlideBox
            type="other"
            arr={other}
            event={this.changeIngredientsStatus}
          />

        </div>
      </>

    );
  }
}
