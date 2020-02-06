import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';

import '../../css/gallery.css';


class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All',
      recipes: [],
      isLoading: false,
      next: 0,
      searchTarget: null
    };

    this.handleScroll = this.handleScroll.bind(this);
    // this.setSearchTarget = this.setSearchTarget.bind(this);
  }

  componentDidMount() {
    // 抓 query 做搜尋，怎麼觸發?
    // const searchTarget = queryString.parse(this.props.location.search);
    // console.log(searchTarget)
    // this.setState({
    //   searchTarget: searchTarget.cocktailName
    // })

    // window.addEventListener('scroll', this.handleScroll);
    // this.getData();
    const { firebase, location } = this.props;
    const newAry = [];
    firebase.searchCocktailByName(location.state.searchTarget)
      .then((docSnapshot) => {
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        this.setState({
          recipes: [...newAry],
          searchTarget: location.state.searchTarget,
          filter: 'searching'
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('hi');
    const { firebase, location } = this.props;
    const { searchTarget } = this.state;
    const newAry = [];
    if (searchTarget === null) {
      firebase.searchCocktailByName(location.state.searchTarget)
        .then((docSnapshot) => {
          docSnapshot.forEach((doc) => {
            newAry.push(doc.data());
          });
          this.setState({
            recipes: [...newAry],
            searchTarget: location.state.searchTarget,
            filter: 'searching'
          });
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getData() {
    const { firebase } = this.props;
    const {
      recipes,
      filter,
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
                recipes: [...recipes, ...newAry],
                isLoading: false,
                next: lastVisible
              }
            ));
          });
      }
    }
  }

  // setSearchTarget(cocktailName) {
  // }

  handleScroll() {
    const { filter, next } = this.state;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1) {
      if (next.exists === false) {
        alert('已顯示全部酒譜!');
        return;
      }
      if (filter === 'All') {
        this.getData();
      }
    }
  }

  changeFilter(e) {
    this.setState({
      isLoading: true
    });
    const { firebase } = this.props;
    const category = e.target.textContent;
    if (category === 'All') {
      this.setState({
        filter: category
      });
      this.getData();
      return;
    }
    const newAry = [];
    firebase.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', category.toLowerCase())
      .get()
      .then((docSnapshot) => {
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        this.setState((prevState) => (
          {
            recipes: [...newAry],
            isLoading: false,
            filter: category
          }
        ));
      });
  }

  renderItem() {
    const { recipes } = this.state;
    const itemAry = [];
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<Item recipe={recipes[i]} />);
    }
    return itemAry;
  }

  render() {
    const { authUser } = this.props;
    const { filter, isLoading, searchTarget } = this.state;
    return (
      <>
        <div className="wrap-gallery">
          {isLoading ? <Loading /> : ''}
          <div className="intro-area">
            <h2>Specialist in Cocktail</h2>
          </div>
          <main className="main-gallery">
            <div className="filter">
              <div className={`item ${filter === 'All' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>All</div>
              <div className={`item ${filter === 'Vodka' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Vodka</div>
              <div className={`item ${filter === 'Brandy' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Brandy</div>
              <div className={`item ${filter === 'Rum' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Rum</div>
              <div className={`item ${filter === 'Gin' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Gin</div>
              <div className={`item ${filter === 'Whisky' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Whisky</div>
              <div className={`item ${filter === 'Tequila' ? 'current' : ''}`} onClick={(e) => this.changeFilter(e)}>Tequila</div>
            </div>
            <div className="gallery-item">
              {this.renderItem()}
            </div>
          </main>
          {/* <Footer /> */}
        </div>
      </>
    );
  }
}

const Item = (props) => {
  console.log('render');
  const { recipe } = props;
  return (
    <div className="item row">
      <div className="item-pic">
        <img src={recipe.cocktail_pic} alt="cocktail name" />
      </div>
      <div className="item-description">
        <h4 className="cocktail-IBA">{recipe.cocktail_IBA}</h4>
        <h3>{recipe.cocktail_name}</h3>
        <p>{recipe.cocktail_category}</p>
        <div className="cover">
          <button className="checkRecipe" type="button">
            <Link to={{
              pathname: '/cocktailDetail',
              search: recipe.cocktail_id,
              state: {
                cocktailID: recipe.cocktail_id
              }
            }}
            >
Detail
            </Link>
          </button>
          <button className="collect" type="button">
            <Link to={{
              state: {
                data: recipe
              }
            }}
            >
Collect
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default compose(
  withFirebase,
  ifAuth
)(GalleryPage);
