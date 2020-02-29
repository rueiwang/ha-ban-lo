import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../css/account-collection.css';

class CollectionItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShown: false,
      restAmount: 0
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal(e, ingredients) {
    const { isShown } = this.state;
    const { userIngredients } = this.props;
    const userAlreadyHave = userIngredients.filter((item) => item.status === 1);
    const matchArray = [];
    ingredients.filter((name) => {
      userAlreadyHave.map((ingredient) => {
        if (ingredient.name === name) {
          matchArray.push(ingredient.name);
        }
      });
    });
    const restAmount = ingredients.length - matchArray.length;
    this.setState({
      isShown: !isShown,
      restAmount
    });
  }

  closeModal(e) {
    this.setState({
      isShown: false
    });
  }

  render() {
    const { item, category } = this.props;
    const { isShown, restAmount } = this.state;
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
          onMouseOut={(e) => this.closeModal(e)}
          onBlur={(e) => this.closeModal(e)}
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

        <div className={`more-info-cover ${isShown ? 'show' : ''}`}>
          {
            restAmount === 0
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
                    <span>{restAmount}</span>
ingredients to buy!
                  </p>
                </>

              )
          }
        </div>
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
    userData.userCollections.map((usersItemId) => {
      matchData.push(DataInSessionStorage.cacheData.filter((item) => item.cocktail_id === usersItemId)[0]);
    });

    this.setState({
      matchData: [...matchData]
    });
  }

  render() {
    const { matchData } = this.state;
    const { userData } = this.props;
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
                  <CollectionItems
                    key={item.cocktail_id}
                    item={item}
                    category={category}
                    userIngredients={userData.userIngredients}
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
