import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../css/account-collection.css';

const MoreInfoAboutThisItem = (props) => {
  const { isShown, restIngredientsAmount } = props;
  return (
    <div className={`more-info-cover ${isShown ? 'show' : ''}`}>
      {
      restIngredientsAmount === 0
        ? (
          <>
            <p>Congrat!</p>
            <p>
you can make this by yourself!
            </p>
          </>
        )
        : (
          <>
            <p>To make this cocktail,</p>
            <p>
You still have
              <span>{restIngredientsAmount}</span>
ingredients to buy!
            </p>
          </>

        )
    }
    </div>
  );
};
class CollectionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      restIngredientsAmount: 0
    };
  }

  showModal = (e, ingredients) => {
    const { isShown } = this.state;
    const { member_ingredients } = this.props;
    const userAlreadyHave = member_ingredients.filter((item) => item.status === 1);
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
          search: item.cocktail_id,
          state: {
            cocktailID: item.cocktail_id,
            ifClassic: true
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
export default class MyCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchData: []
    };
  }

  componentDidMount() {
    const { userData, DataInSessionStorage } = this.props;
    const matchData = [];
    userData.member_collections.map((usersItemId) => {
      matchData.push(DataInSessionStorage.allRecipeData.filter((item) => item.cocktail_id === usersItemId)[0]);
    });
    this.setState({
      matchData: [...matchData]
    });
  }

  render() {
    const { matchData } = this.state;
    const { userData } = this.props;
    const ifNoCollection = matchData.length === 0;
    return (
      <>
        <div className="collection-wine-cabinet">
          <ul className="collection">
            {
              matchData.map((item) => {
                let category;
                const condition = item.cocktail_ingredients_type[item.cocktail_ingredients_type.findIndex((ingredient) => ingredient !== 'other')];
                switch (condition) {
                  case 'vodka':
                    category = 'vodka';
                    break;
                  case 'gin':
                    category = 'gin';
                    break;
                  case 'rum':
                    category = 'rum';
                    break;
                  case 'tequila':
                    category = 'tequila';
                    break;
                  case 'whisky':
                    category = 'whisky';
                    break;
                  case 'liqueur':
                    category = 'liqueur';
                    break;
                  case 'brandy':
                    category = 'brandy';
                    break;
                  default:
                    category = 'all';
                    break;
                }
                return (
                  <CollectionItem
                    key={item.cocktail_id}
                    item={item}
                    category={category}
                    member_ingredients={userData.member_ingredients}
                  />
                );
              })
              }
            <li className="see-more">
              <Link to={{
                pathname: '/gallery',
                state: {
                  searchTarget: undefined
                }
              }}
              >
                <img src="../imgs/plus-more-collection.png" alt="plus" />
              </Link>
            </li>
          </ul>
        </div>
      </>

    );
  }
}
