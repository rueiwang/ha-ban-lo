/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import '../../css/account-note.css';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseWine: [],
      liqueur: [],
      other: [],
      tobuy: [],
      translate: 0,
      slideTarget: 'basewineLi'
    };

    this.ulWidth = React.createRef();
    this.liWidth = React.createRef();
    this.classify = this.classify.bind(this);
    this.slideBackward = this.slideBackward.bind(this);
    this.slideForward = this.slideForward.bind(this);
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

    userData.userIngredients.map((name) => {
      DataInSessionStorage.ingredientData.map((item) => {
        if (item.ingredient_name === name) {
          if (item.ingredient_type === 'base wine') {
            baseWineAry.push(item);
          } else if (item.ingredient_type === 'liqueur') {
            liqueurAry.push(item);
          } else if (item.ingredient_type === 'other') {
            otherAry.push(item);
          }
        }
      });
    });

    this.setState({
      baseWine: [...baseWineAry],
      liqueur: [...liqueurAry],
      other: [...otherAry]
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

  render() {
    const {
      baseWine, liqueur, other, translate, slideTarget
    } = this.state;
    return (
      <>
        <div className="ingredients-wrap">
          <div className="basewine">
            <h3>Base Wine</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="basewineLi" onClick={(e) => this.slideBackward(e, baseWine.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="basewineLi" />
              </button>
              <ul className="basewine-list" ref={this.ulWidth}>
                { baseWine === []
                  ? <li>LOADING</li>
                  : baseWine.map((item) => (
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
                  : liqueur.map((item) => (
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
                  : other.map((item) => (
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
