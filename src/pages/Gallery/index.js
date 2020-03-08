import React, { Component } from 'react';
import { compose } from 'recompose';

import Loading from '../../components/Loading';
import Footer from '../../components/Footer';
import GalleryItem from './GalleryItem';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';

import '../../css/gallery.css';

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
        firebase.getCocktail(20)
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
        firebase.searchCocktailByIngredientsType(filter.toLowerCase())
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

    firebase.searchCocktailByIngredientsType(category.toLowerCase())
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
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<GalleryItem recipe={recipes[i]} key={recipes[i].cocktail_id} />);
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
