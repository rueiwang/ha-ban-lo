import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CollectionItem from './CollectionItem';

import '../../css/account-collection.css';

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
                    memberIngredients={userData.member_ingredients}
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
