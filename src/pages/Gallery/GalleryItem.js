import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Dialog from '../../components/Dialog';
import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';


class GalleryItem extends Component {
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
        collected: isCollected,
        isDialodShow: false,
        dialogType: '',
        dialogHead: '',
        dialogText: ''
      });
    }
  }

    collectItem = (e, itemId) => {
      e.preventDefault();
      const { DataInSessionStorage, firebase, userData } = this.props;
      const { collected } = this.state;
      const targetDataObj = DataInSessionStorage.allRecipeData.filter((item) => item.cocktail_id === itemId)[0];
      if (userData.authUser === null) {
        this.setState({
          isDialodShow: true,
          dialogType: 'alert',
          dialogHead: 'ONLY MEMBER',
          dialogText: 'Join us to discover more about cocktail!'
        });
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

    closeDialog = (e, boolean) => {
      this.setState({
        isDialodShow: false,
        dialogResult: boolean
      });
      return boolean;
    }

    render() {
      const { recipe } = this.props;
      const {
        collected,
        isDialodShow,
        dialogType,
        dialogHead,
        dialogText
      } = this.state;
      return (
        <>
          { isDialodShow ? (
            <Dialog
              type={dialogType}
              head={dialogHead}
              text={dialogText}
              confirm={this.closeDialog}
              reject={this.closeDialog}
            />
          ) : ''}
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
        </>
      );
    }
}

export default compose(allRecipeData, withFirebase, ifAuth)(GalleryItem);
