import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ForwardBtn, BackwardBtn } from '../SlideBtn';
import EmptyItem from '../EmptyItem';

export default class MemberCreationsList extends Component {
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
      this.setState({ translateDistance: 0 });
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
    const { creations, edit } = this.props;
    const { translateDistance } = this.state;
    return (
      <div className="creations">
        <h2>Your Creation</h2>
        <div className="slide-box">
          <BackwardBtn
            length={creations.length}
            event={this.slideBackward}
            target="creationsLi"
          />
          <ul className="creations-list" ref={this.ulWidth}>
            { creations.length === 0
              ? (
                <EmptyItem
                  message="creations"
                  destination="bartending-ideas"
                />
              )
              : creations.map((item) => {
                const condition = item.cocktail_ingredients_type[item.cocktail_ingredients_type.findIndex((ingredient) => ingredient !== 'other')];
                const category = this.filterCategory(condition);
                return (
                  <li
                    key={item.cocktail_id}
                    ref={this.liWidth}
                    style={{
                      transform: `translateX(${translateDistance}px)`
                    }}
                  >
                    <img src="../../imgs/edit.png" alt="edit" className="edit" onClick={(e) => edit(e, item.cocktail_id)} />
                    <Link to={{
                      pathname: '/cocktailDetail',
                      search: `search=${item.cocktail_id}&ifCreation=true`,
                      state: {
                        cocktailId: item.cocktail_id,
                        ifCreation: true
                      }
                    }}
                    >
                      <img src={`../../imgs/${category}.png`} alt="icon" />
                      <h5>{item.cocktail_name}</h5>
                    </Link>
                  </li>
                );
              })}
          </ul>
          <ForwardBtn
            length={creations.length}
            event={this.slideForward}
            target="creationsLi"
          />
        </div>

      </div>
    );
  }
}
