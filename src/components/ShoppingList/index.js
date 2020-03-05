import React, { Component } from 'react';

class ShoppingListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  checkedItem = (e, id, statusNum) => {
    e.preventDefault();
    const { changeIngredientsStatus } = this.props;
    changeIngredientsStatus(e, id, statusNum);
    this.setState({
      isChecked: true
    });
  }

  render() {
    const { item } = this.props;
    const { isChecked } = this.state;
    return (
      <input
        type="checkbox"
        id={item.ingredient_name}
        name={item.ingredient_name}
        onChange={(e) => this.checkedItem(e, item.ingredient_id, 1)}
        checked={isChecked}
      />
    );
  }
}

const ShoppingList = (props) => {
  const {
    tobuy, isShoppingListShown, showShoppingList, changeIngredientsStatus
  } = props;
  return (
    <>
      <div className="hide-list-area" onClick={showShoppingList}>
        <div className="count">{tobuy.length}</div>
        <input type="image" src="../../imgs/shop-list-already.png" alt="" className="hide-list-btn" />
      </div>
      <div className={`shopping-list-area ${isShoppingListShown ? 'show' : ''}`}>
        <input
          type="image"
          src="../../imgs/nail.png"
          alt=""
          className="pinned-area"
          onClick={showShoppingList}
        />
        <h3>Shopping List</h3>
        <form className="shopping-list">
          { tobuy.length === 0
            ? (
              <div className="empty-shopping-list">
                <img src="../../imgs/empty-basket.png" alt="empty!" />
                <h3>You already have everything you want!</h3>
              </div>
            )
            : tobuy.map((item, i) => (
              <label htmlFor={item.ingredient_name} key={item.ingredient_id}>
                <ShoppingListItem
                  index={i}
                  item={item}
                  changeIngredientsStatus={changeIngredientsStatus}
                />
                <span className="checkmark" />
                {item.ingredient_name}
                <input
                  type="image"
                  src="../../imgs/delete.png"
                  alt=""
                  className="deleteBtn"
                  onClick={(e) => changeIngredientsStatus(e, item.ingredient_id, -1)}
                />
              </label>
            ))}
        </form>

      </div>
    </>
  );
};
export default ShoppingList;
