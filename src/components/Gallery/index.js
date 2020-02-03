import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import queryString from 'query-string';
import './gallery.css';

import Loading from '../Loading';
import Navigation from '../Navigation';
import Footer from '../Footer';

import { ifAuth } from '../AuthUser';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All',
      recipes: [],
      isLoading: false,
      next: null,
      searchTarget: null
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.setSearchTarget = this.setSearchTarget.bind(this);
  }

  componentDidMount() {
    // 抓 query 做搜尋，怎麼觸發?
    // const searchTarget = queryString.parse(this.props.location.search);
    // console.log(searchTarget)
    // this.setState({
    //   searchTarget: searchTarget.cocktailName
    // })

    window.addEventListener('scroll', this.handleScroll);
    this.getData();
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
      if (next === null) {
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

  setSearchTarget(cocktailName) {
    const { firebase } = this.props;
    const newAry = []
    firebase.searchCocktailByName(cocktailName)
      .then((docSnapshot) => {
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        this.setState({
          recipes: [...newAry]
        });
      })
  }

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
        count: 24,
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
      })
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
        {isLoading ? <Loading /> : ''}
        <header className="gallery-header">
            <Navigation search={this.setSearchTarget}/>
          <div className="keyVisual">
            <h2>Let’s go out and juice up tonight!</h2>
          </div>
        </header>
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
        <Footer />
      </>
    );
  }
}

const Item = (props) => {
  console.log('render');
  const { recipe } = props;
  let tagAry = [];
  if (recipe.cocktail_tag !== null) {
    tagAry = recipe.cocktail_tag.split(',');
  }
  return (
    <div className="item row">
      <div className="gallery-item-inner">
        <div className="header">
          <h2>{recipe.cocktail_name}</h2>
          <div className="tag">
            {
            tagAry.map((tag) => <div className="item" key={tag}>{tag}</div>)
          }
          </div>
        </div>
        <div className="cocktail-pic">
          <img src={recipe.cocktail_pic} alt="cocktail name" />
        </div>
      </div>
      <div className="cover">
        <button className="checkRecipe" type="button">See Recipe</button>
        <button className="collect" type="button">Collect this</button>
      </div>
    </div>
  );
};

export default compose(
  withFirebase,
  ifAuth
)(GalleryPage);
