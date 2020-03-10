import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { ifAuth } from '../Context/AuthUser';

import '../../css/common.css';
import SearchField from './SearchField';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  openMenu = (e) => {
    e.preventDefault();
    this.setState({
      isMenuOpen: true
    });
  }

  closeMenu = (e) => {
    this.setState({
      isMenuOpen: false
    });
  }


  render() {
    const { userData } = this.props;
    const { isMenuOpen } = this.state;
    return (
      <nav className="scroll">
        <div className={`click-to-close-nav-menu ${isMenuOpen ? 'open' : ''}`} onClick={(e) => this.closeMenu(e)} />
        <div className="nav-containter">
          <div className="menu-toggle" onClick={(e) => this.openMenu(e)}>
            <img src="https://firebasestorage.googleapis.com/v0/b/ha-ban-lo.appspot.com/o/assets%2Fha-ban-lo%2Ficon_menu_black.png?alt=media&token=7f30038f-dc13-491b-b5a1-aea205eb347f" alt="" />
            <a href="#">MENU</a>
          </div>
          <h1><Link to="/">hā-pan</Link></h1>
          <button type="button" className="member-btn">
            <HashLink to={userData.authUser ? `/account/${userData.authUser.uid}` : '/#member'}>YOUR DRINK</HashLink>
          </button>
          <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
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
            </ul>
            <SearchField closeMenu={this.closeMenu} />
          </div>
        </div>
      </nav>
    );
  }
}

export default ifAuth(Navigation);
