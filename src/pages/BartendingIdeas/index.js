import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';

import '../../css/ideas.css';


class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collected: false
    };
  }

  render() {
    console.log('render');
    const { recipe } = this.props;
    return (
      <div className="item row">
        <div className="item-pic">
          <Link to={{
            pathname: '/cocktailDetail',
            search: `search=${recipe.cocktail_id}&ifCreation=true`,
            state: {
              cocktailId: recipe.cocktail_id,
              ifCreation: true
            }
          }}
          >
    Detail
          </Link>

          <img src={recipe.cocktail_pic} alt="cocktail name" />
        </div>
        <div className="item-description">
          <h4 className="cocktail-IBA">{recipe.cocktail_IBA}</h4>
          <h3>{recipe.cocktail_name}</h3>
          <p>{recipe.cocktail_category}</p>
          <div className="item-creator">
            <p>{recipe.cocktail_creator_name}</p>
            <img src="./imgs/bartender.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

class IdeasPage extends Component {
  constructor(props) {
    super(props);
    this.isCancel = true;
    this.state = {
      recipes: [],
      isLoading: false,
      next: 0
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { firebase } = this.props;
    const { isLoading } = this.state;
    const newAry = [];
    if (isLoading === false) {
      this.setState({
        isLoading: true
      });
      firebase.getAllMemberCreations()
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
  }

  renderItem() {
    const { recipes } = this.state;
    const itemAry = [];
    const ItemWithData = compose(withFirebase, ifAuth)(Item);
    for (let i = 0; i < recipes.length; i += 1) {
      itemAry.push(<ItemWithData recipe={recipes[i]} key={recipes[i].cocktail_id} />);
    }
    return itemAry;
  }

  render() {
    const { isLoading } = this.state;
    return (
      <>
        {isLoading ? <Loading /> : ''}
        <div className="wrap-ideas">
          <div className="intro-area">
            <h2>Bartending Ideas</h2>
          </div>
          <main className="main-ideas">
            <div className="ideas-item">
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
)(IdeasPage);
