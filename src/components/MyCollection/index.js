import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/account-collection.css';


export default function MyCollection(props) {
  const { userData, DataInSessionStorage } = props;
  const matchData = [];
  if (userData.authUser) {
    userData.userCollections.map((usersItemId) => {
      matchData.push(DataInSessionStorage.cacheData.filter((item) => item.cocktail_id === usersItemId)[0]);
    });
    console.log(matchData);
  }
  if (matchData !== []) {
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
                  <li key={item.cocktail_id}>

                    <Link to={{
                      pathname: '/cocktailDetail',
                      search: item.cocktail_id,
                      state: {
                        cocktailID: item.cocktail_id
                      }
                    }}
                    >
                      <img src={`../imgs/${category}.png`} alt="icon" />
                      <h5>{item.cocktail_name}</h5>
                    </Link>

                  </li>
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
                <img src="../imgs/plus.png" alt="plus" />
              </Link>
            </li>
          </ul>

        </div>
      </>

    );
  }
  return (
    <>
      <h2>There is no collection.</h2>
      <Link to="/gallery">Go to Gallery</Link>
    </>
  );
}
