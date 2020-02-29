/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';

import '../../css/gallery.css';
import { cacheData } from '../../components/Context/DataInSessionStorage';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collected: false
    };
    this.collect = this.collect.bind(this);
  }

  componentDidMount() {
    const { userData, recipe } = this.props;
    if (userData.authUser) {
      const isCollected = userData.userCollections.findIndex((id) => id === recipe.cocktail_id) !== -1;
      if (isCollected) {
        this.setState({
          collected: true
        });
      }
    }
  }

  collect(e, itemId) {
    e.preventDefault();
    const { DataInSessionStorage, firebase, userData } = this.props;
    const { collected } = this.state;
    const targetDataObj = DataInSessionStorage.cacheData.filter((item) => item.cocktail_id === itemId)[0];
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
    console.log('render');
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
                search: recipe.cocktail_id,
                state: {
                  cocktailID: recipe.cocktail_id,
                  isCollected: collected,
                  ifClassic: true
                }
              }}
              >
  Detail
              </Link>
            </button>
            <button className="collect" type="button" onClick={(e) => this.collect(e, recipe.cocktail_id)}>
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
      recipes: [],
      isLoading: false,
      next: 0,
      searchTarget: null,
      lastSearch: '',
      openFilter: false
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.openMobileFilter = this.openMobileFilter.bind(this);
    this.categoryAry = ['All', 'Vodka', 'Brandy', 'Rum', 'Gin', 'Whisky', 'Tequila'];
  }

  componentDidMount() {
    const { recipes, lastSearch } = this.state;
    const { firebase, location } = this.props;

    this.isCancel = false;
    if (this.isCancel === false) {
      window.addEventListener('scroll', this.handleScroll);

      const newAry = [];
      if (location.state.searchTarget === undefined && location.state.searchTarget !== lastSearch) {
        this.getData();
      } else {
        firebase.searchCocktailByName(location.state.searchTarget)
          .then((docSnapshot) => {
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState({
              recipes: [...newAry],
              searchTarget: null,
              lastSearch: location.state.searchTarget,
              filter: 'searching',
              isLoading: false
            });
          });
      }
    }
  }

  componentDidUpdate() {
    const { firebase, location } = this.props;
    const { searchTarget, lastSearch } = this.state;
    const newAry = [];
    if (searchTarget === null) {
      if (location.state.searchTarget !== lastSearch && location.state.searchTarget !== undefined) {
        firebase.searchCocktailByName(location.state.searchTarget)
          .then((docSnapshot) => {
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState({
              recipes: [...newAry],
              searchTarget: null,
              lastSearch: location.state.searchTarget,
              filter: 'searching',
              isLoading: false,
              next: 0
            });
          });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.isCancel = true;
  }

  getData() {
    const { firebase, location } = this.props;
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
            this.setState((prevState) => (
              {
                filter: 'All',
                searchTarget: null,
                lastSearch: location.state.searchTarget,
                recipes: [...newAry],
                isLoading: false,
                next: lastVisible
              }
            ));
          });
      } else {
        firebase.getNextCocktail(next)
          .then((docSnapshot) => {
            const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.setState((prevState) => (
              {
                filter: 'All',
                searchTarget: null,
                lastSearch: location.state.searchTarget,
                recipes: [...recipes, ...newAry],
                isLoading: false,
                next: lastVisible
              }
            ));
          });
      }
    }
  }

  handleScroll() {
    const { firebase, location } = this.props;
    const {
      filter, next, recipes, searchTarget
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
            this.setState((prevState) => (
              {
                filter: prevState.filter,
                searchTarget: null,
                lastSearch: location.state.searchTarget,
                recipes: [...recipes, ...newAry],
                isLoading: false,
                next: lastVisible
              }
            ));
          });
      }
    }
  }

  changeFilter(e) {
    const { firebase, location } = this.props;
    const { next, recipes } = this.state;
    const category = e.target.textContent;
    this.setState({
      isLoading: true,
      next: 0,
      filter: category,
      openFilter: false
    });
    const newAry = [];
    if (category === 'All') {
      firebase.getCocktail()
        .then((docSnapshot) => {
          const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
          docSnapshot.forEach((doc) => {
            newAry.push(doc.data());
          });
          this.setState((prevState) => (
            {
              searchTarget: null,
              lastSearch: location.state.searchTarget,
              recipes: [...newAry],
              isLoading: false,
              next: lastVisible
            }
          ));
        });
      return;
    }

    if (category !== 'All') {
      firebase.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', category.toLowerCase())
        .limit(20)
        .get()
        .then((docSnapshot) => {
          const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
          docSnapshot.forEach((doc) => {
            newAry.push(doc.data());
          });
          this.setState((prevState) => (
            {
              searchTarget: null,
              lastSearch: location.state.searchTarget,
              recipes: [...newAry],
              isLoading: false,
              next: lastVisible
            }
          ));
        });
    } else {
      firebase.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', category.toLowerCase())
        .startAfter(next)
        .limit(20)
        .get()
        .then((docSnapshot) => {
          const lastVisible = docSnapshot.docs[docSnapshot.docs.length - 1];
          docSnapshot.forEach((doc) => {
            newAry.push(doc.data());
          });
          this.setState((prevState) => (
            {
              filter: category,
              searchTarget: null,
              lastSearch: location.state.searchTarget,
              recipes: [...recipes, ...newAry],
              isLoading: false,
              next: lastVisible
            }
          ));
        });
    }
  }

  openMobileFilter() {
    const { openFilter } = this.state;
    if (openFilter) {
      this.setState({
        openFilter: false
      });
    } else {
      this.setState({
        openFilter: true
      });
    }
  }

  renderItem() {
    const { recipes } = this.state;
    const itemAry = [];
    const ItemWithData = compose(cacheData, withFirebase, ifAuth)(Item);
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<ItemWithData recipe={recipes[i]} key={recipes[i].cocktail_id} />);
    }
    return itemAry;
  }

  render() {
    const { filter, isLoading, openFilter } = this.state;
    return (
      <>
        {isLoading ? <Loading /> : ''}
        <div className="wrap-gallery">
          <div className="intro-area">
            <h2>Classic Cocktail</h2>
          </div>
          <main className="main-gallery">
            <ul className={`filter ${openFilter ? 'open' : ''}`}>
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
