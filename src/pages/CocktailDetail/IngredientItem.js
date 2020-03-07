import React, { Component } from 'react';
import { compose } from 'recompose';

import Dialog from '../../components/Dialog';
import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';

class IngredientItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifOwned: false,
      status: -1,
      ingredientDetail: null,
      isDialodShow: false,
      dialogType: '',
      dialogHead: '',
      dialogText: ''
    };
  }

  componentDidMount() {
    const { DataInSessionStorage, userData } = this.props;
    const { ingredient } = this.props;
    const tagertIngredient = DataInSessionStorage.ingredientData.filter((item) => item.ingredient_name === ingredient)[0];
    const IndexInUserData = userData.member_ingredients.findIndex((item) => item.id === tagertIngredient.ingredient_id);
    const ifOwned = IndexInUserData !== -1;
    let status;
    ifOwned ? status = userData.member_ingredients[IndexInUserData].status : status = -1;
    this.setState({
      ifOwned,
      ingredientDetail: { ...tagertIngredient },
      status
    });
  }

    addIngredients = (e, statusNum) => {
      const { firebase, userData } = this.props;
      const { ifOwned, ingredientDetail, status } = this.state;
      if (userData.authUser === null) {
        this.setState({
          isDialodShow: true,
          dialogType: 'alert',
          dialogHead: 'ONLY MEMBER',
          dialogText: 'Join us to discover more about cocktail!'
        });
        return;
      }
      if (ifOwned) {
        if (status === statusNum) {
          firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
            .delete()
            .then(() => {
              this.setState({
                ifOwned: false,
                status: -1
              });
            });
        } else {
          firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
            .update({ status: statusNum })
            .then(() => {
              this.setState({
                status: statusNum
              });
            });
        }
      } else {
        firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(ingredientDetail.ingredient_id)
          .set({
            ...ingredientDetail,
            status: statusNum
          })
          .then(() => {
            this.setState({
              ifOwned: true,
              status: statusNum
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
      const { ingredient, measure } = this.props;
      const {
        ifOwned, status, isDialodShow,
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
          <li className={`item ${ifOwned ? '' : 'showIcon'}`}>
            <div className="btn btn-already-had" onClick={(e) => this.addIngredients(e, 1)}>
              <img src={status === 1 ? '../imgs/ok.png' : '../imgs/plus.png'} alt="plus" />
            </div>
            <span className="measure">{measure}</span>
            <span className="name">{ingredient}</span>
            <div className={`btn btn-need-to-buy ${status === 2 ? 'pinned' : ''}`} onClick={(e) => this.addIngredients(e, 2)}>
              <img src={status === 2 ? '../imgs/shop-list-already.png' : '../imgs/shopping-list.png'} alt="plus" />
            </div>
          </li>
        </>
      );
    }
}

export default compose(withFirebase, allRecipeData, ifAuth)(IngredientItem);
