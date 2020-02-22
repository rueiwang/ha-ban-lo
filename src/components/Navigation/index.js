import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
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
      clickToggle: false,
      suggestionLength: 0
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
    this.setState({
      clickToggle: false,
      isSearching: false,
      value: ''
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

  renderlist() {
    const { DataInSessionStorage } = this.props;
    const { value } = this.state;
    const updataData = DataInSessionStorage.cacheData
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
    const { userData } = this.props;
    const { value, isSearching, clickToggle } = this.state;
    return (
      <nav className="scroll">
        <div className={`click-to-close-nav-menu ${clickToggle ? 'open' : ''}`} onClick={(e) => this.closeMenu(e)} />
        <div className="nav-containter">
          <div className="menu-toggle" onClick={(e) => this.openMenu(e)}>
            <img src="https://firebasestorage.googleapis.com/v0/b/ha-ban-lo.appspot.com/o/assets%2Fha-ban-lo%2Ficon_menu_black.png?alt=media&token=7f30038f-dc13-491b-b5a1-aea205eb347f" alt="" />
            <a href="#">MENU</a>
          </div>
          <h1>hā-pan</h1>
          <button type="button" className="member-btn">
            <HashLink to={userData.authUser ? `/account/${userData.authUser.uid}` : '/#member'}>YOUR DRINK</HashLink>
          </button>
          <div className={`menu ${clickToggle ? 'open' : ''}`}>
            <div className="close" onClick={(e) => this.closeMenu(e)}>
              <img src="https://firebasestorage.googleapis.com/v0/b/ha-ban-lo.appspot.com/o/assets%2Fha-ban-lo%2Fclose.png?alt=media&token=c47d304f-dcbb-4166-b8cc-ed2bbf5cb727" alt="" />
            </div>
            <ul className="menu-link" onClick={(e) => this.closeMenu(e)}>
              <li>
                <Link
                  to={{
                    pathname: '/gallery',
                    state: {
                      searchTarget: undefined
                    }
                  }}
                >
CLASSIC COCKTAIL
                </Link>
              </li>
              <li>
                <Link to="/bartending-ideas">BARTENDING IDEAS</Link>
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
                <input type="text" name="search" id="search" autoComplete="off" value={value} onChange={(e) => this.inputChange(e)} placeholder="Cocktail Name" />
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
              >
                <Link
                  onClick={this.closeMenu}
                  to={{
                    pathname: '/gallery/#cocktails',
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
