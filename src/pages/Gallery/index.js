import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';

import '../../css/gallery.css';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collected: false
    };
  }

  componentDidMount() {
    const { userData, recipe } = this.props;
    if (userData.authUser) {
      const isCollected = userData.member_collections.findIndex((id) => id === recipe.cocktail_id) !== -1;
      this.setState({
        collected: isCollected
      });
    }
  }

  collectItem = (e, itemId) => {
    e.preventDefault();
    const { DataInSessionStorage, firebase, userData } = this.props;
    const { collected } = this.state;
    const targetDataObj = DataInSessionStorage.allRecipeData.filter((item) => item.cocktail_id === itemId)[0];
    if (userData.authUser === null) {
      alert('Please Sign in!');
      return;
    }
    if (collected) {
      const question = window.confirm('Are you sure to remove this from your collection?');
      if (!question) {
        return;
      }
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_collections').doc(itemId)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
          this.setState({
            collected: false
          });
        });
    } else {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_collections').doc(itemId)
        .set(targetDataObj)
        .then(() => {
          this.setState({
            collected: true
          });
        });
    }
  }

  render() {
    const { recipe } = this.props;
    const { collected } = this.state;
    return (
      <div className="item row">
        <div className="item-pic">
          <img src={recipe.cocktail_pic} alt="cocktail name" />
        </div>
        <div className="item-description">
          {
            collected ? (
              <div className="collect-sign">
                <img src="./imgs/hearts.png" alt="collected" />
              </div>
            )
              : ''
          }
          <h4 className="cocktail-IBA">{recipe.cocktail_IBA}</h4>
          <h3>{recipe.cocktail_name}</h3>
          <p>{recipe.cocktail_category}</p>
          <div className="cover">
            <button className="checkRecipe" type="button">
              <Link to={{
                pathname: '/cocktailDetail',
                search: `search=${recipe.cocktail_id}&ifCreation`,
                state: {
                  cocktailId: recipe.cocktail_id,
                  ifCreation: false
                }
              }}
              >
  Detail
              </Link>
            </button>
            <button
              className="collect"
              type="button"
              onClick={(e) => this.collectItem(e, recipe.cocktail_id)}
            >
              {collected ? 'remove' : 'Collect'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.isCancel = true;
    this.state = {
      filter: 'All',
      openMobileFilter: false,
      recipes: [],
      isLoading: false,
      next: 0
    };
    this.categoryAry = ['All', 'Vodka', 'Brandy', 'Rum', 'Gin', 'Whisky', 'Tequila'];
  }

  componentDidMount() {
    this.isCancel = false;
    if (this.isCancel === false) {
      window.addEventListener('scroll', this.handleScroll);
      this.getData();
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getData() {
    const { firebase } = this.props;
    const {
      recipes,
      isLoading,
      next
    } = this.state;
    const newAry = [];
    if (isLoading === false) {
      this.setState({
        isLoading: true
      });
      if (next === 0) {
        firebase.getCocktail()
          .then((docSnapshot) => {
            const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState({
              filter: 'All',
              recipes: [...newAry],
              isLoading: false,
              next: lastVisible
            });
          });
      } else {
        firebase.getNextCocktail(next)
          .then((docSnapshot) => {
            const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState({
              filter: 'All',
              recipes: [...recipes, ...newAry],
              isLoading: false,
              next: lastVisible
            });
          });
      }
    }
  }

  handleScroll = () => {
    const { firebase } = this.props;
    const {
      filter, next, recipes
    } = this.state;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1 && filter !== 'searching') {
      if (next === undefined) {
        alert('已顯示全部酒譜!');
        return;
      }
      const newAry = [];
      if (filter === 'All') {
        this.getData();
      } else {
        firebase.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', filter.toLowerCase())
          .startAfter(next)
          .limit(20)
          .get()
          .then((docSnapshot) => {
            const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState({
              recipes: [...recipes, ...newAry],
              isLoading: false,
              next: lastVisible
            });
          });
      }
    }
  }

  changeFilter = (e) => {
    const { firebase } = this.props;
    const { next, recipes } = this.state;
    const category = e.target.textContent;
    this.setState({
      isLoading: true,
      next: 0,
      filter: category,
      openMobileFilter: false
    });
    const newAry = [];
    if (category === 'All') {
      firebase.getCocktail()
        .then((docSnapshot) => {
          const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
          docSnapshot.forEach((doc) => {
            newAry.push(doc.data());
          });
          this.setState({
            recipes: [...newAry],
            isLoading: false,
            next: lastVisible
          });
        });
      return;
    }

    firebase.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', category.toLowerCase())
      .limit(20)
      .get()
      .then((docSnapshot) => {
        const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        this.setState({
          recipes: [...newAry],
          isLoading: false,
          next: lastVisible
        });
      });
  }

  openMobileFilter = () => {
    const { openMobileFilter } = this.state;
    this.setState({ openMobileFilter: !openMobileFilter });
  }

  renderItem = () => {
    const { recipes } = this.state;
    const itemAry = [];
    const ItemWithData = compose(allRecipeData, withFirebase, ifAuth)(Item);
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<ItemWithData recipe={recipes[i]} key={recipes[i].cocktail_id} />);
    }
    return itemAry;
  }

  render() {
    const { filter, isLoading, openMobileFilter } = this.state;
    return (
      <>
        {isLoading ? <Loading /> : ''}
        <div className="wrap-gallery">
          <div className="intro-area">
            <h2>Classic Cocktail</h2>
          </div>
          <main className="main-gallery">
            <ul className={`filter ${openMobileFilter ? 'open' : ''}`}>
              <button type="button" className="open-filter-list" onClick={this.openMobileFilter}>
                <img src="./imgs/arrow-point-to-down.png" alt="open" />
              </button>
              {
              this.categoryAry.map((category) => (
                <li
                  key={category}
                  className={`item ${filter === category ? 'current' : ''}`}
                  onClick={(e) => this.changeFilter(e)}
                >
                  {category}
                </li>
              ))
            }
            </ul>
            <div className="gallery-item">
              {this.renderItem()}
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }
}

export default compose(
  withFirebase,
  ifAuth
)(GalleryPage);
