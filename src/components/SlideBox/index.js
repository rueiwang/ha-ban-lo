import React, { Component } from 'react';
import APP from '../../lib';

import { ForwardBtn, BackwardBtn } from './SlideBtn';
import EmptyItem from '../EmptyItem';
import CreationsList from './CreationsList';
import IngredientsList from './IngredientsList';

export default class SlideBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateDistance: 0
    };
    this.ulWidth = React.createRef();
    this.liWidth = React.createRef();
  }

  filterCategory = (condition) => {
    switch (condition) {
      case 'vodka':
        return 'vodka';
      case 'gin':
        return 'gin';
      case 'rum':
        return 'rum';
      case 'tequila':
        return 'tequila';
      case 'whisky':
        return 'whisky';
      case 'liqueur':
        return 'liqueur';
      case 'brandy':
        return 'brandy';
      default:
        return 'all';
    }
  }

  slideBackward = (e, itemNum) => {
    const { translateDistance } = this.state;
    const differenceBetweenUlAndLi = (this.ulWidth.current.offsetWidth - (this.liWidth.current.offsetWidth * itemNum));
    if (differenceBetweenUlAndLi > 0) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    if (differenceBetweenUlAndLi > translateDistance) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        translateDistance: prevState.translateDistance - 100
      }
    ));
  }

  slideForward = (e) => {
    const { translateDistance } = this.state;
    if (translateDistance <= 0) {
      this.setState({
        translateDistance: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        translateDistance: prevState.translateDistance + 100
      }
    ));
  }

  render() {
    const {
      type,
      arr,
      event
    } = this.props;
    const { translateDistance } = this.state;
    return (
      <div className={type}>
        <h3>{type}</h3>
        <div className="slide-box">
          <BackwardBtn
            length={arr.length}
            event={this.slideBackward}
          />
          <ul className={`${type}-list`} ref={this.ulWidth}>
            { arr.length === 0
              ? (
                <EmptyItem
                  message="ingredients"
                  destination="Gallery"
                />
              )
              : arr.map((item, i) => (type === 'creations'
                ? (
                  <CreationsList
                    key={APP.generateKey(type + i)}
                    item={item}
                    filt={this.filterCategory}
                    liRef={this.liWidth}
                    edit={event}
                    translateDistance={translateDistance}
                  />
                )
                : (
                  <IngredientsList
                    key={APP.generateKey(type + i)}
                    item={item}
                    liRef={this.liWidth}
                    event={event}
                    translateDistance={translateDistance}
                  />
                )))}
          </ul>
          <ForwardBtn
            length={arr.length}
            event={this.slideForward}
          />
        </div>
      </div>
    );
  }
}
