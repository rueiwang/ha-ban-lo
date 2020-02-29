/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import '../../css/account-note.css';
import { compose } from 'recompose';
import { ifAuth } from '../Context/AuthUser';
import { withFirebase } from '../Context/Firebase';
import { cacheData } from '../Context/DataInSessionStorage';

class ShoppingListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, id, statusNum) {
    e.preventDefault();
    const { changeStatus } = this.props;
    changeStatus(e, id, statusNum);
    this.setState({
      isChecked: true
    });
  }

  render() {
    const { item, index } = this.props;
    const { isChecked } = this.state;
    return (
      <input
        type="checkbox"
        id={item.ingredient_name}
        name={item.ingredient_name}
        data-type={item.ingredient_type}
        data-index={index}
        onChange={(e) => this.handleChange(e, item.ingredient_id, 1)}
        checked={isChecked}
      />
    );
  }
}
export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseWine: [],
      liqueur: [],
      other: [],
      tobuy: [],
      translate: 0,
      slideTarget: 'basewineLi',
      randomSuggestions: []
    };

    this.ulWidth = React.createRef();
    this.liWidth = React.createRef();
    this.classify = this.classify.bind(this);
    this.slideBackward = this.slideBackward.bind(this);
    this.slideForward = this.slideForward.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  componentDidMount() {
    this.classify();
  }

  classify() {
    const { userData, DataInSessionStorage } = this.props;
    const baseWineAry = [];
    const liqueurAry = [];
    const otherAry = [];
    const tobuyAry = [];

    userData.userIngredients
      .filter((userItem) => userItem.status === 1)
      .map((userItem) => {
        DataInSessionStorage.ingredientData.map((item) => {
          if (item.ingredient_id === userItem.id) {
            if (item.ingredient_type === 'base wine') {
              baseWineAry.push({ ...item, status: 1 });
            } else if (item.ingredient_type === 'liqueur') {
              liqueurAry.push({ ...item, status: 1 });
            } else if (item.ingredient_type === 'other') {
              otherAry.push({ ...item, status: 1 });
            }
          }
        });
      });

    userData.userIngredients
      .filter((userItem) => userItem.status === 2)
      .map((userItem) => {
        DataInSessionStorage.ingredientData.map((item) => {
          if (item.ingredient_id === userItem.id) {
            tobuyAry.push({ ...item, status: 2 });
          }
        });
      });

    this.setState({
      baseWine: [...baseWineAry],
      liqueur: [...liqueurAry],
      other: [...otherAry],
      tobuy: [...tobuyAry]
    });
  }

  slideBackward(e, itemNum) {
    // console.log(e.target.dataset.target);
    const { target } = e.target.dataset;
    const { translate } = this.state;
    const exceedParentWidth = (this.ulWidth.current.offsetWidth - (this.liWidth.current.offsetWidth * itemNum));
    console.log(exceedParentWidth);
    if (exceedParentWidth > 0) {
      this.setState({
        translate: 0
      });
      return;
    }
    if (exceedParentWidth > translate) {
      this.setState({
        translate: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translate: prevState.translate - 100
      }
    ));
  }

  slideForward(e, itemNum) {
    console.log(e.target.dataset.target);
    const { target } = e.target.dataset;
    const { translate } = this.state;
    if (translate <= 0) {
      this.setState({
        translate: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translate: prevState.translate + 100
      }
    ));
  }

  changeStatus(e, id, statusNum) {
    e.preventDefault();
    const { firebase, userData } = this.props;
    if (statusNum === -1) {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(id)
        .delete();
    } else {
      firebase.db.collection('members').doc(userData.authUser.uid).collection('member_ingredients').doc(id)
        .update({ status: statusNum });
    }
  }

  render() {
    const {
      baseWine, liqueur, other, translate, slideTarget, tobuy
    } = this.state;
    return (
      <>
        <div className="ingredients-wrap">
          <div className="shopping-list-area">
            <div className="hide-list-area">
              <div className="count">{tobuy.length}</div>
              <input type="image" src="../../imgs/shop-list-already.png" alt="" className="hide-list-btn" />
            </div>
            <input type="image" src="../../imgs/nail.png" alt="" className="pinned-area" />
            <h3>Shopping List</h3>
            <form className="shopping-list">
              { tobuy === []
                ? <li>LOADING</li>
                : tobuy.map((item, i) => (
                  <label htmlFor={item.ingredient_name} key={item.ingredient_id}>
                    <ShoppingListItem
                      index={i}
                      item={item}
                      changeStatus={this.changeStatus}
                    />
                    <span className="checkmark" />
                    {item.ingredient_name}
                    <input
                      type="image"
                      src="../../imgs/delete.png"
                      alt=""
                      className="deleteBtn"
                      onClick={(e) => this.changeStatus(e, item.ingredient_id, -1)}
                    />
                  </label>
                ))}
            </form>
          </div>

          <div className="basewine">
            <h3>Base Wine</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="basewineLi" onClick={(e) => this.slideBackward(e, baseWine.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="basewineLi" />
              </button>
              <ul className="basewine-list" ref={this.ulWidth}>
                { baseWine === []
                  ? <li>LOADING</li>
                  : baseWine.map((item, i) => (
                    <li
                      ref={this.liWidth}
                      className="basewineLi"
                      style={slideTarget === 'basewineLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <input
                        type="image"
                        src="../../imgs/delete.png"
                        alt=""
                        className="deleteBtn"
                        onClick={(e) => this.changeStatus(e, item.ingredient_id, 2)}
                      />
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="basewineLi" onClick={(e) => this.slideForward(e, baseWine.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="basewineLi" />
              </button>
            </div>
          </div>
          <div className="liqueur">
            <h3>Liqueur</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="liqueurLi" onClick={(e) => this.slideBackward(e, liqueur.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="liqueurLi" />
              </button>
              <ul className="liqueur-list">
                { liqueur === []
                  ? <li>LOADING</li>
                  : liqueur.map((item, i) => (
                    <li
                      className="liqueurLi"
                      style={slideTarget === 'liqueurLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <input
                        type="image"
                        src="../../imgs/delete.png"
                        alt=""
                        className="deleteBtn"
                        onClick={(e) => this.changeStatus(e, item.ingredient_id, 2)}
                      />
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="liqueurLi" onClick={(e) => this.slideForward(e, liqueur.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="liqueurLi" />
              </button>
            </div>


          </div>
          <div className="other">
            <h3>Other</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="otherLi" onClick={(e) => this.slideBackward(e, other.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="otherLi" />
              </button>
              <ul className="other-list">
                { other === []
                  ? <li>LOADING</li>
                  : other.map((item, i) => (
                    <li
                      className="otherLi"
                      style={slideTarget === 'otherLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <input
                        type="image"
                        src="../../imgs/delete.png"
                        alt=""
                        className="deleteBtn"
                        onClick={(e) => this.changeStatus(e, item.ingredient_id, 2)}
                      />
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="otherLi" onClick={(e) => this.slideForward(e, other.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="otherLi" />
              </button>
            </div>
          </div>
        </div>
      </>

    );
  }
}
