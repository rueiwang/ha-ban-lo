/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import ColorThief from 'colorthief';
import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';
import {
  GlassOfBrandy,
  GlassOfChampagne,
  GlassOfHighball,
  GlassOfMartini,
  GlassOfShot,
  GlassOfUFO,
  GlassOfWhisky
} from '../../components/SVG';

import '../../css/cocktailDetail.css';
import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

class CocktailDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCocktailId : '',
      cocktailId: '',
      nextCocktailId : '',
      index: 0,
      ifCreation: true,
      creations: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const { location, firebase } = this.props;
    const query = new URLSearchParams(location.search);
    const targetId = query.get('search');
    const ifCreation = query.get('ifCreation') !== '';

    firebase.db.collection('members_creations').orderBy('cocktail_create_date', 'desc').get()
      .then((docSnapshot) => {
        const newAry = [];
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        const targetIndex = this.getCurrentCocktailIndex(targetId, ifCreation, newAry);
        this.setState({
          cocktailId: targetId,
          ifCreation,
          creations: [...newAry],
          index: targetIndex,
          isLoading: false
        });
      });
  }

  componentDidUpdate() {
  }

  getCurrentCocktailIndex = (id, ifCreation, creations) => {
    const { DataInSessionStorage } = this.props;
    let targetIndex;
    if (ifCreation) {
      targetIndex = creations.findIndex((item) => item.cocktail_id === id);
    } else {
      targetIndex = DataInSessionStorage.allRecipeData.findIndex((item) => item.cocktail_id === id);
    }
    return targetIndex;
  }

  determineDataSource = () => {
    const { DataInSessionStorage } = this.props;
    const { creations, ifCreation } = this.state;
    let source;
    if (ifCreation) {
      source = creations;
    } else {
      source = DataInSessionStorage.allRecipeData;
    }
    return source;
  }

  getLastCocktail = () => {
    const { index } = this.state;
    const source = this.determineDataSource();
    console.log(source);
    if (source[index - 1] === undefined) {
      alert('There is no more cocktail');
      return;
    }
    this.setState({
      lastCocktailId: source[index - 1].cocktail_id,
      index: index - 1
    });
  }

  getNextCocktail = (e) => {
    const { index } = this.state;
    const source = this.determineDataSource();
    if (source[index + 1] === undefined) {
      alert('There is no more cocktail');
      return;
    }
    this.setState({
      nextCocktailId: source[index + 1].cocktail_id,
      index: index + 1
    });
  }

  switchContent = (e, boolean) => {
    const { DataInSessionStorage, location } = this.props;
    const { creations } = this.state;
    let id;
    if (boolean) {
      id = DataInSessionStorage.allRecipeData[0].cocktail_id;
    } else {
      id = creations[0].cocktail_id;
    }
    location.state.cocktailID = id;
    location.search = `?${id}`;
    this.setState({
      ifCreation: boolean,
      cocktailId: id,
      index: 0
    });
  }

  render() {
    const {
      cocktailId, creations, ifCreation, isLoading
    } = this.state;
    const { location } = this.props;
    const ifUndefined = location.state === undefined;
    return isLoading
      ? <Loading />
      : (
        <>
          <div className="wrap-detail">
            <div className="switchContent">
              <button className={ifCreation ? '' : 'current'} type="button" onClick={(e) => this.switchContent(e, false)}>CLASSIC</button>
              <button className={ifCreation ? 'current' : ''} type="button" onClick={(e) => this.switchContent(e, true)}>IDEAS</button>
            </div>
            <main className="main-detail">
              <Link
                className="last"
                onClick={(e) => this.getLastCocktail(e)}
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${cocktailId}&ifCreation`,
                  state: {
                    cocktailId,
                    ifCreation: true
                  }
                }}
                type="button"
              >
                <img src="../../imgs/arrow-left.png" alt="" />
              </Link>
              <div className="detail-box">
                <div className="pic" />
                <div className="blank" />
                <Content
                  cocktailId={ifUndefined ? cocktailId : location.state.cocktailId}
                  creations={creations}
                  ifCreation={ifCreation}
                  key={ifUndefined ? cocktailId : location.state.cocktailId}
                />
              </div>
              <Link
                className="next"
                onClick={(e) => this.getNextCocktail(e)}
                type="button"
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${cocktailId}&ifCreation`,
                  state: {
                    cocktailId,
                    ifCreation: true
                  }
                }}
              >
                <img src="../../imgs/arrow-right.png" alt="" />
              </Link>
            </main>
          </div>
          <Footer />
        </>
      );
  }
}

class CollectButtonBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collected: false
    };
  }

  componentDidMount() {
    const { userData, cocktailId } = this.props;
    if (userData.authUser) {
      const isCollected = userData.member_collections.findIndex((id) => id === cocktailId) !== -1;
      this.setState({
        isCollected
      });
    }
  }

  collect = (e, itemId) => {
    e.preventDefault();
    const { DataInSessionStorage, firebase, userData } = this.props;
    const { isCollected } = this.state;
    const targetDataObj = DataInSessionStorage.allRecipeData.filter((item) => item.cocktail_id === itemId)[0];
    if (userData.authUser === null) {
      alert('Please Sign in!');
      return;
    }
    if (isCollected) {
      const question = window.confirm('Are you sure to remove this from your collection?');
      if (!question) {
        return;
      }
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_collections').doc(itemId)
        .delete()
        .then(() => {
          this.setState({
            isCollected: false
          });
        });
    } else {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_collections').doc(itemId)
        .set(targetDataObj)
        .then(() => {
          this.setState({
            isCollected: true
          });
        });
    }
  }

  render() {
    const { isCollected } = this.state;
    const { cocktailId } = this.props;
    return (
      <button className="collect" type="button" onClick={(e) => this.collect(e, cocktailId)}>
        <img src={isCollected ? '../imgs/hearts.png' : '../imgs/heart.png'} alt="plus" />
      </button>
    );
  }
}
const CollectButton = compose(withFirebase, allRecipeData, ifAuth)(CollectButtonBase);
class IngredientItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifOwned: false,
      status: -1,
      ingredientDetail: null,
      isLoading: false
    };
  }

  componentDidMount() {
    const { DataInSessionStorage, userData } = this.props;
    const { ingredient } = this.props;
    const tagertIngredient = DataInSessionStorage.ingredientData.filter((item) => item.ingredient_name === ingredient)[0];
    const IndexInUserData = userData.member_ingredients.findIndex((item) => item.id === tagertIngredient.ingredient_id);
    const ifOwned = IndexInUserData !== -1;
    let status;
    ifOwned ? status = userData.member_ingredients[IndexInUserData].status : status = -1;
    this.setState({
      ifOwned,
      ingredientDetail: { ...tagertIngredient },
      status
    });
  }

  addIngredients = (e, statusNum) => {
    const { firebase, userData } = this.props;
    const { ifOwned, ingredientDetail, status } = this.state;
    if (userData.authUser === null) {
      alert('Please Sign in!');
      return;
    }
    if (ifOwned) {
      if (status === statusNum) {
        firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
          .delete()
          .then(() => {
            this.setState({
              ifOwned: false,
              status: -1
            });
          });
      } else {
        firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
          .update({ status: statusNum })
          .then(() => {
            this.setState({
              status: statusNum
            });
          });
      }
    } else {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
        .set({
          ...ingredientDetail,
          status: statusNum
        })
        .then(() => {
          this.setState({
            ifOwned: true,
            status: statusNum
          });
        });
    }
  }

  render() {
    const { ingredient, measure } = this.props;
    const { ifOwned, status } = this.state;
    return (
      <li className={`item ${ifOwned ? '' : 'showIcon'}`}>
        <div className="btn btn-already-had" onClick={(e) => this.addIngredients(e, 1)}>
          <img src={status === 1 ? '../imgs/ok.png' : '../imgs/plus.png'} alt="plus" />
        </div>
        <span className="measure">{measure}</span>
        <span className="name">{ingredient}</span>
        <div className={`btn btn-need-to-buy ${status === 2 ? 'pinned' : ''}`} onClick={(e) => this.addIngredients(e, 2)}>
          <img src={status === 2 ? '../imgs/shop-list-already.png' : '../imgs/shopping-list.png'} alt="plus" />
        </div>
      </li>
    );
  }
}

const IngredientItem = compose(withFirebase, allRecipeData, ifAuth)(IngredientItemBase);

class ContentBase extends Component {
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
        colorPlette: [...colorPletteRGB],
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
              <h3>Ingredients</h3>
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
                <img src="./imgs/shaker.png" alt="" className="cover-shaker" />
                <GlassComponent glassType={item.cocktail_glass_type} colors={colorPlette} />
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

function GlassComponent(props) {
  const { glassType, colors } = props;
  let glassSVG = null;
  if (glassType === 'GlassOfBrandy') {
    glassSVG = <GlassOfBrandy mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfChampagne') {
    glassSVG = <GlassOfChampagne mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfHighball') {
    glassSVG = <GlassOfHighball mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfMartini') {
    glassSVG = <GlassOfMartini mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfShot') {
    glassSVG = <GlassOfShot mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfUFO') {
    glassSVG = <GlassOfUFO mainColor={colors} />;
    return glassSVG;
  }
  if (glassType === 'GlassOfWhisky') {
    glassSVG = <GlassOfWhisky mainColor={colors} />;
    return glassSVG;
  }
}

const Content = compose(withFirebase, allRecipeData, ifAuth)(ContentBase);

export default compose(
  ifAuth,
  withFirebase,
  allRecipeData
)(CocktailDetailPage);
