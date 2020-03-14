import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import ColorThief from 'colorthief';

import IngredientItem from './IngredientItem';
import CollectButton from './CollectButton';
import Explanation from './Explanation';
import GlassComponent from './GlassComponent';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';


class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPlette: [],
      isCollected: false,
      currentId: ''
    };
    this.img = React.createRef();
  }

    getImgColor = (e, length, id) => {
      const { colorPlette, currentId } = this.state;
      if (colorPlette.length === 0 || id !== currentId) {
        const colorThief = new ColorThief();
        const img = this.img.current;
        const colorPletteRGB = colorThief.getPalette(img, length);
        this.setState({
          colorPlette: [...colorPletteRGB.reverse()],
          currentId: id
        });
      }
    }

    render() {
      const {
        DataInSessionStorage, cocktailId, creations, ifCreation
      } = this.props;
      const { colorPlette } = this.state;
      let targetDetail;
      if (ifCreation) {
        targetDetail = creations.filter((cocktail) => cocktail.cocktail_id === cocktailId);
      } else {
        targetDetail = DataInSessionStorage.allRecipeData.filter((cocktail) => cocktail.cocktail_id === cocktailId);
      }
      return (
        targetDetail.map((item) => (
          <div className="content" key={item.cocktail_id}>
            <img
              src={ifCreation
                ? `${item.cocktail_pic}&time=${new Date().valueOf()}`
                : `${item.cocktail_pic}?time=${new Date().valueOf()}`}
              ref={this.img}
              alt="none"
              className="invisibleImg"
              onLoad={(e) => this.getImgColor(e, item.cocktail_ingredients.length, item.cocktail_pic)}
              crossOrigin="anonymous"
            />
            <h2>
              {item.cocktail_name}
            </h2>
            {
              ifCreation
                ? (
                  <div className="item-creator">
                    <p>{item.cocktail_creator_name}</p>
                    <img src="./imgs/bartender.png" alt="" />
                  </div>
                )
                : <CollectButton cocktailId={cocktailId} />
            }

            <p>{item.cocktail_category}</p>
            <div className="ingredient-content">
              <div className="ingredient-description">
                <h3>
Ingredients
                  <Explanation />
                </h3>
                <ul className="ingredient-list">
                  {
                  item.cocktail_ingredients.map((ingredient, i) => (
                    <IngredientItem ingredient={ingredient} measure={item.cocktail_measures[i]} key={`${item.cocktail_id + i}`} />
                  ))
                }
                </ul>
                <p className="intro">{item.cocktail_introduction}</p>
              </div>

              <div className="ingedient-info">
                <div className="svg">
                  {
                  colorPlette.length === 0
                    ? <img src="./imgs/shaker.png" alt="" className="cover-shaker" />
                    : <GlassComponent glassType={item.cocktail_glass_type} colors={colorPlette} />
                }
                </div>
                <div className="glass">
                  <p>{item.cocktail_glass}</p>
                </div>
              </div>
            </div>
            <Link
              className="back-to-gallery"
              to={
                ifCreation ? ({
                  pathname: '/gallery',
                  state: {
                    searchTarget: undefined
                  }
                })
                  : ({
                    pathname: '/bartending-ideas'
                  })
              }
            >
  ← Go Back
            </Link>
          </div>
        )));
    }
}

export default compose(withFirebase, allRecipeData, ifAuth)(Content);
