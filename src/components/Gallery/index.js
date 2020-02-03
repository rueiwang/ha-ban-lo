import React, { Component } from 'react';
import './gallery.css';

import Footer from '../Footer';

import { withFirebase } from '../Firebase';


class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'All',
      recipes: [],
      count: 20,
      isLoading: false,
      next: null
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    // const { firebase } = this.props;
    // window.addEventListener('scroll', this.handleScroll);
    // this.getData();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  getData() {
    const { firebase } = this.props;
    const {
      recipes,
      filter,
      count,
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
                count: prevState.count + 20,
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
                count: prevState.count + 20,
                next: lastVisible
              }
            ));
          });
      }
    }
  }

  handleScroll() {
    const { count, filter, next } = this.state;
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
    const { firebase } = this.props;
    const { filter } = this.state;
    const category = e.target.textContent;
    if (category === 'All') {
      this.setState({
        count: 24,
        filter: category
      });
      this.getData();
      return;
    }
    const ingredientsDetails = firebase.db.collection('all_cocktail_recipe').where('');
  }

  renderItem() {
    const { recipes } = this.state;
    const itemAry = [];
    if (recipes.length < 12) {
      return <h1>LOADING</h1>;
    }
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<Item recipe={recipes[i]} />);
    }
    return itemAry;
  }

  render() {
    const { filter } = this.state;
    return (
      <>
        <header className="gallery-header">
          <nav>
            <h1>
              <a href="#">
            HA-BAN
              </a>
            </h1>
            <div className="navigation">
              <div className="item current">
                <a href="#">Classic Cocktail</a>
              </div>
              <div className="item">
                <a href="#">Taiwan Bar</a>
              </div>
              <div className="item">
                <a href="#">Bartending Video</a>
              </div>
            </div>
            <div className="member">
              <a href="#">
                  Sign Up
              </a>
              <a href="#" className="sign-in">
                  Sign In
              </a>
            </div>
            <form className="language">
              <select name="language" id="">
                <option value="EN">English</option>
                <option value="zh-tw">繁體中文</option>
              </select>
            </form>
          </nav>
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
            {/* {this.renderItem()} */}
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

export default withFirebase(GalleryPage);
