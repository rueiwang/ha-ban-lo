import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import * as ROUTES from '../../constants/routes';

import '../../css/common.css';
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [
        {
          cocktail_name: 'Jeam Bean'
        },
        {
          cocktail_name: 'Side Car'
        },
        {
          cocktail_name: 'Gin'
        }
      ],
      value: '',
      isSearching: false,
      clickToggle: false
    }

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

  }

  componentDidMount() {
    const { firebase } = this.props;
    const { allData } = this.state;
    let newAry = [];
    const isDataInLocalStorage = sessionStorage.getItem('allData') !== null;
    console.log(isDataInLocalStorage)
    if(isDataInLocalStorage) {
      // console.log(sessionStorage.getItem('allData').split("},"));
      const processAry = sessionStorage.getItem('allData').split("},").map((str, i) => {
        if(i === (sessionStorage.getItem('allData').split("},").length) - 1) {
          return str
        }
        return (str+'}');
      });
      newAry = processAry.map((item) => JSON.parse(item));
        this.setState({
          allData: [...newAry]
        })
    } else {
      firebase.getAllCocktail()
        .then((docSnapshot) => {
          docSnapshot.forEach((doc) => {
            newAry.push(JSON.stringify(doc.data(), (key, value) => {
              if (key !== 'ref') {
                return value
              }
            }));
          })
          console.log(newAry.toString())
          sessionStorage.setItem('allData', newAry.toString());
          const dataAry = newAry.map((str) => JSON.parse(str));
          this.setState({
            allData: dataAry
          })
        })
    }
  }

  openMenu(e) {
    e.preventDefault();
    this.setState({
      clickToggle: true
    })
  }

  closeMenu(e) {
    e.preventDefault();
    this.setState({
      clickToggle: false
    })
  }

  inputChange(e) {
    const { alldata } = this.state;
    this.setState({
      isSearching: true,
      value: e.target.value
    })
  }

  changeValue(e) {
    this.setState({
      isSearching: false,
      value: e.target.textContent
    })
  }

  transportSearchTarget(e, cocktailName) {
    e.preventDefault();
    const { search } = this.props;
    search(cocktailName);
  }

  renderlist() {
    const { allData, value } = this.state;
    let updataData = allData.filter((item) => {
      return item.cocktail_name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    })

    let data = updataData.map((item, i, arr) => {
      return <li className="item" key={i} onClick={(e) => this.changeValue(e)}>{item.cocktail_name}</li>
    })

    return data
  }

  render() {
    const { authUser } = this.props;
    const { value, isSearching, clickToggle } = this.state;
    return  (
      <nav className="scroll">
        <div className="nav-containter">
        <div className="menu-toggle" onClick={(e) => this.openMenu(e)}>
          <img src="./imgs/icon_menu_black.png" />
          <a href="#">MENU</a>
        </div>
        <h1>hā-pan</h1>
        <button>YOUR DRINK</button>
        <div className={`menu ${clickToggle ? 'open' : ''}`}>
          <div className="close" onClick={(e) => this.closeMenu(e)}>
            <img src="./imgs/close.png" />
          </div>
          <ul className="menu-link">
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
              <input type="text" name="search" id="search" autoComplete="off" value={this.state.value} onChange={(e) => this.inputChange(e)} />
              {isSearching 
              ? (<ul className="search-suggestion">
                {this.renderlist()}
              </ul>)
              : ''}
            </div>
            <button onClick={(e) => this.transportSearchTarget(e,value)} onKeyDown={(e) => {
              if(e.keyCode === 13) {
                this.transportSearchTarget(e,value)
              }
            }}>search</button>
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
  withFirebase
)(Navigation);
