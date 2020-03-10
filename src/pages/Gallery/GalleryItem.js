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
      isCollected: false,
      isDialodShow: false,
      dialogType: '',
      dialogHead: '',
      dialogText: ''
    };
  }

  componentDidMount() {
    const { userData, recipe } = this.props;
    if (userData.authUser) {
      const isCollected = userData.member_collections.findIndex((id) => id === recipe.cocktail_id) !== -1;
      this.setState({
        isCollected
      });
    }
  }

    collectItem = (e, itemId) => {
      e.preventDefault();
      const { DataInSessionStorage, firebase, userData } = this.props;
      const { isCollected } = this.state;
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
      if (isCollected) {
        this.setState({
          isDialodShow: true,
          dialogType: 'confirm',
          dialogHead: 'REMOVE',
          dialogText: 'Are you sure to remove this collection?',
          param: itemId
        });
      } else {
        firebase.memberCollections(userData.authUser.uid)
          .doc(itemId)
          .set(targetDataObj)
          .then(() => {
            this.setState({
              isCollected: true
            });
          });
      }
    }

    cancelCollect = (e, param) => {
      const { firebase, userData } = this.props;
      firebase.memberCollections(userData.authUser.uid)
        .doc(param)
        .delete()
        .then(() => {
          this.setState({
            isCollected: false
          });
          this.closeDialog();
        });
    }

    closeDialog = (e) => {
      this.setState({
        isDialodShow: false
      });
    }

    render() {
      const { recipe } = this.props;
      const {
        isCollected,
        isDialodShow,
        dialogType,
        dialogHead,
        dialogText,
        param
      } = this.state;
      return (
        <>
          { isDialodShow ? (
            <Dialog
              type={dialogType}
              head={dialogHead}
              text={dialogText}
              param={param}
              close={this.closeDialog}
              confirm={this.cancelCollect}
            />
          ) : ''}
          <div className="item row">
            <div className="item-pic">
              <img src={recipe.cocktail_pic} alt="cocktail name" />
            </div>
            <div className="item-description">
              {
              isCollected ? (
                <div className="collect-sign">
                  <img src="./imgs/hearts.png" alt="isCollected" />
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
                  {isCollected ? 'remove' : 'Collect'}
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
}

export default compose(allRecipeData, withFirebase, ifAuth)(GalleryItem);
