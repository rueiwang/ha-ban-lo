import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MoreInfoAboutThisItem from './MoreInfoAboutThisItem';

export default class CollectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      restIngredientsAmount: 0
    };
  }

    showModal = (e, ingredients) => {
      const { isShown } = this.state;
      const { memberIngredients } = this.props;
      const userAlreadyHave = memberIngredients.filter((item) => item.status === 1);
      const matchArray = [];
      ingredients.filter((name) => {
        userAlreadyHave.map((ingredient) => {
          if (ingredient.name === name) {
            matchArray.push(ingredient.name);
          }
        });
      });
      const restIngredientsAmount = ingredients.length - matchArray.length;
      this.setState({
        isShown: !isShown,
        restIngredientsAmount
      });
    }

    closeModal = () => this.setState({ isShown: false });

    render() {
      const { item, category } = this.props;
      const { isShown, restIngredientsAmount } = this.state;
      return (
        <li>
          <input
            type="image"
            src="../imgs/alert.png"
            alt=""
            className="alert-btn"
            onClick={(e) => this.showModal(e, item.cocktail_ingredients)}
            onMouseOver={(e) => this.showModal(e, item.cocktail_ingredients)}
            onFocus={(e) => this.showModal(e, item.cocktail_ingredients)}
            onMouseOut={this.closeModal}
            onBlur={this.closeModal}
          />
          <Link to={{
            pathname: '/cocktailDetail',
            search: `search=${item.cocktail_id}&ifCreation`,
            state: {
              cocktailId: item.cocktail_id,
              ifCreation: false
            }
          }}
          >
            <img src={`../imgs/${category}.png`} alt="icon" />
            <h5>{item.cocktail_name}</h5>
          </Link>
          <MoreInfoAboutThisItem isShown={isShown} restIngredientsAmount={restIngredientsAmount} />
        </li>
      );
    }
}
