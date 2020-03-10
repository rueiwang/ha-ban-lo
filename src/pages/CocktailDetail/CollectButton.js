import React, { Component } from 'react';
import { compose } from 'recompose';

import Dialog from '../../components/Dialog';
import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';

class CollectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollected: false,
      isDialodShow: false,
      dialogType: '',
      dialogHead: '',
      dialogText: '',
      param: ''
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
      const {
        isCollected,
        isDialodShow,
        dialogType,
        dialogHead,
        dialogText,
        param
      } = this.state;
      const { cocktailId } = this.props;
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
          <button className="collect" type="button" onClick={(e) => this.collectItem(e, cocktailId)}>
            <img src={isCollected ? '../imgs/hearts.png' : '../imgs/heart.png'} alt="plus" />
          </button>
        </>
      );
    }
}

export default compose(withFirebase, allRecipeData, ifAuth)(CollectButton);
