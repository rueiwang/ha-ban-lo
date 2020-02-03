import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../AuthUser';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


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
      isSearching: false
    }
  }

  componentDidMount() {
    const { firebase } = this.props;
    const newAry = [];
    firebase.getAllCocktail()
      .then((docSnapshot) => {
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        })
        this.setState({
          allData: [...newAry]
        })
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
    const { value, isSearching } = this.state;
    return  (
      <nav>
        <h1>
          <a href="#">
        HA-BAN
          </a>
        </h1>
        <div className="navigation">
          <div className="item current">
            <Link to={ROUTES.GALLERY}>Classic Cocktail</Link>
          </div>
          <div className="item">
            <Link to={ROUTES.TAIWANBAR}>Taiwan Bar</Link>
          </div>
          <div className="item">
            <Link to={ROUTES.VIDEO}>Bartending Video</Link>
          </div>
        </div>
        <form className="search">
          <input type="text" name="search" id="search" autoComplete="off" value={this.state.value} onChange={(e) => this.inputChange(e)} />
          {isSearching 
           ? (<ul className="search-suggestion">
            {this.renderlist()}
          </ul>)
          : ''}
          <button onClick={(e) => this.transportSearchTarget(e,value)} onKeyDown={(e) => {
            if(e.keyCode === 13) {
              this.transportSearchTarget(e,value)
            }
          }}>搜尋</button>
        </form>
        <div className="member">
          <Link to={authUser ? ROUTES.ACCOUNT : ROUTES.LANDING} className="sign-in">Sign In</Link>
        </div>
        <form className="language">
          <select name="language" id="">
            <option value="EN">English</option>
            <option value="zh-tw">繁體中文</option>
          </select>
        </form>
      </nav>
    );
  }
}
export default compose(
  ifAuth,
  withFirebase
)(Navigation);
