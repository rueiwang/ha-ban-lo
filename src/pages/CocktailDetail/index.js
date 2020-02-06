import React, { Component } from 'react';
import { compose } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { cacheData } from '../../components/Context/DataInSessionStorage';
import { GlassOfMartini } from '../../components/SVG';

import '../../css/cocktailDetail.css';

class CocktailDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktailId: ''
    };
  }

  componentDidMount() {
    const { location } = this.props;
    console.log(this.props);
    this.setState({
      cocktailId: location.state.cocktailID
    });
  }

  render() {
    const { cocktailId } = this.state;
    return (
      <>
        <div className="wrap-detail">
          <main className="main-detail">
            <div className="detail-box">
              <div className="pic" />
              <div className="blank" />
              <Content cocaktailId={cocktailId} />
            </div>
          </main>
          {/* <Footer /> */}
        </div>
      </>
    );
  }
}

function ContentBase(props) {
  console.log(props);
  const { DataInSessionStorage, cocaktailId } = props;
  const targetDetail = DataInSessionStorage.filter((cocktail) => cocktail.cocktail_id === cocaktailId);
  console.log(targetDetail);
  return (
    targetDetail.map((item) => (
      <div className="content">
        <h2>{item.cocktail_name}</h2>
        <p>{item.cocktail_category}</p>
        <div className="ingredient-content">
          <div className="ingredient-description">
            <h3>Ingredients</h3>
            <ul className="ingredient-list">
              {
              item.cocktail_ingredients.map((ingredient, i) => (
                <li className="item">
                  <span className="measure">{item.cocktail_measures[i]}</span>
                  <span className="name">{ingredient}</span>
                </li>
              ))
            }
            </ul>
            <p className="intro">{item.cocktail_introduction}</p>
          </div>

          <div className="ingedient-info">
            <div className="svg">
              <GlassOfMartini ingredients={item.cocktail_ingredients} />
            </div>
            <div className="glass">
              <p>{item.cocktail_glass}</p>
            </div>
          </div>
        </div>
      </div>
    ))
  );
}

const Content = cacheData(ContentBase);

export default compose(
  ifAuth,
  withFirebase,
  cacheData
)(CocktailDetailPage);
