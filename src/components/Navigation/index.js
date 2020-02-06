import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../Context/AuthUser';
import { withFirebase } from '../Context/Firebase';
import { cacheData } from '../Context/DataInSessionStorage';
import * as ROUTES from '../../constants/routes';

import '../../css/common.css';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isSearching: false,
      clickToggle: false
    };

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  openMenu(e) {
    e.preventDefault();
    this.setState({
      clickToggle: true
    });
  }

  closeMenu(e) {
    e.preventDefault();
    this.setState({
      clickToggle: false
    });
  }

  inputChange(e) {
    this.setState({
      isSearching: true,
      value: e.target.value
    });
  }

  changeValue(e) {
    this.setState({
      isSearching: false,
      value: e.target.textContent
    });
  }

  transportSearchTarget(e, cocktailName) {
    e.preventDefault();
    const { search } = this.props;
    search(cocktailName);
  }

  renderlist() {
    const { DataInSessionStorage } = this.props;
    const { value } = this.state;
    const updataData = DataInSessionStorage
      .filter((item) => item.cocktail_name.toLowerCase().indexOf(value.toLowerCase()) !== -1);

    const data = updataData
      .map((item, i) => (
        <li
          className="item"
          key={i}
          onClick={(e) => this.changeValue(e)}
        >
          {item.cocktail_name}
        </li>
      ));

    return data;
  }

  render() {
    const { authUser } = this.props;
    const { value, isSearching, clickToggle } = this.state;
    return (
      <nav className="scroll">
        <div className="nav-containter">
          <div className="menu-toggle" onClick={(e) => this.openMenu(e)}>
            <img src="./imgs/icon_menu_black.png" alt="" />
            <a href="#">MENU</a>
          </div>
          <h1>hā-pan</h1>
          <button type="button">
            <Link to={authUser ? '/account/:id' : '/'}>YOUR DRINK</Link>
          </button>
          <div className={`menu ${clickToggle ? 'open' : ''}`}>
            <div className="close" onClick={(e) => this.closeMenu(e)}>
              <img src="./imgs/close.png" alt="" />
            </div>
            <ul className="menu-link" onClick={(e) => this.closeMenu(e)}>
              <li>
                <Link to="/gallery">COCKTAIL GALLERY</Link>
              </li>
              <li>
                <Link to="/taiwanbar">TAIWAN BAR</Link>
              </li>
              <li>
                <Link to="/bartendingvedio">LEARN BARTENDING</Link>
              </li>
            </ul>
            <form className="search">
              <div className="search-auto-complete">
                <input type="text" name="search" id="search" autoComplete="off" value={value} onChange={(e) => this.inputChange(e)} placeholder="Name or ingredient" />
                {isSearching
                  ? (
                    <ul className="search-suggestion">
                      {this.renderlist()}
                    </ul>
                  )
                  : ''}
              </div>
              <button
                type="button"
                // onClick={(e) => this.transportSearchTarget(e, value)}
                // onKeyDown={(e) => {
                //   if (e.keyCode === 13) {
                //     this.transportSearchTarget(e, value);
                //   }
                // }}
              >
                <Link to={{
                  pathname: '/gallery',
                  state: {
                    searchTarget: value
                  }
                }}
                >
search
                </Link>
              </button>
            </form>
            <form className="language">
              <select name="language" id="">
                <option value="EN">English</option>
                <option value="zh-tw">繁體中文</option>
              </select>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}
export default compose(
  ifAuth,
  withFirebase,
  cacheData
)(Navigation);
