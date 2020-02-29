import React, { Component } from 'react';
import { compose } from 'recompose';

import { ifAuth } from '../Context/AuthUser';
import { withFirebase } from '../Context/Firebase';
import { cacheData } from '../Context/DataInSessionStorage';

import '../../css/common.css';

class ShoppingListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, index) {
    const { isChecked } = this.state;
    const { changeStatusToOne } = this.props;
    if (isChecked) {
      this.setState({
        isChecked: false
      });
    } else {
      changeStatusToOne(index);
      this.setState({
        isChecked: true
      });
    }
  }

  render() {
    const { item, index } = this.props;
    const { isChecked } = this.state;
    return (
      <input
        type="checkbox"
        id={item.ingredient_name}
        name={item.ingredient_name}
        data-type={item.ingredient_type}
        data-index={index}
        onChange={(e) => this.handleChange(e, index)}
        checked={isChecked}
      />
    );
  }
}

class ShoppingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tobuy: []
    };

    this.changeStatusToOne = this.changeStatusToOne.bind(this);
  }

  componentDidMount() {
    const { tobuy } = this.state;
    const tobuyAry = [];
    const { userData, DataInSessionStorage } = this.props;
    console.log(userData.userIngredients)
    userData.userIngredients
      .filter((userItem) => userItem.status === 2)
      .map((userItem) => {
        DataInSessionStorage.ingredientData.map((item) => {
          if (item.ingredient_id === userItem.id) {
            tobuyAry.push({ ...item, status: 2 });
          }
        });
      });
    this.setState({
      tobuy: [...tobuyAry]
    });
  }

  changeStatusToOne(index) {
    const { firebase, userData } = this.props;
    const { tobuy } = this.state;
    console.log(index);
    firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(tobuy[index].ingredient_id)
      .update({ status: 1 });
  }

  render() {
    const { tobuy } = this.state;
    return (
      <form className="shopping-list">
        <div className="pinned-area">
          <img src="../../imgs/nail.png" alt="" />
        </div>
        <h3>Shopping List</h3>
        { tobuy === []
          ? <li>LOADING</li>
          : tobuy.map((item, i) => (
            <label htmlFor={item.ingredient_name} key={item.ingredient_id}>
              <ShoppingListItem
                index={i}
                item={item}
                changeStatusToOne={this.changeStatusToOne}
              />
              <span className="checkmark" />
              {item.ingredient_name}
              <button type="button" className="delete">
                <img src="../../imgs/delete.png" alt="" />
              </button>
            </label>
          ))}
      </form>
    );
  }
}
export default compose(
  ifAuth,
  withFirebase,
  cacheData
)(ShoppingList);
