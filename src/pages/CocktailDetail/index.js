import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { allRecipeData } from '../../components/Context/DataInSessionStorage';

import '../../css/cocktailDetail.css';
import Content from './Content';
import Loading from '../../components/Loading';
import Footer from '../../components/Footer';

class CocktailDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCocktailId: '',
      cocktailId: '',
      nextCocktailId: '',
      index: 0,
      ifCreation: true,
      creations: [''],
      isLoading: true
    };
  }

  componentDidMount() {
    const { location, firebase } = this.props;
    const query = new URLSearchParams(location.search);
    const targetId = query.get('search');
    const ifCreation = query.get('ifCreation') !== '';
    firebase.getAllMemberCreations()
      .then((docSnapshot) => {
        const newAry = [];
        docSnapshot.forEach((doc) => {
          newAry.push(doc.data());
        });
        this.prepareState(targetId, ifCreation, newAry);
      });
  }

  componentDidUpdate() {
    const { location, firebase } = this.props;
    const {
      cocktailId, creations
    } = this.state;
    if (location.state.cocktailId !== cocktailId) {
      const query = new URLSearchParams(location.search);
      const targetId = query.get('search');
      const ifCreation = query.get('ifCreation') !== '';
      ifCreation
        ? this.prepareState(targetId, ifCreation, creations)
        : firebase.getAllMemberCreations()
          .then((docSnapshot) => {
            const newAry = [];
            docSnapshot.forEach((doc) => {
              newAry.push(doc.data());
            });
            this.prepareState(targetId, ifCreation, newAry);
          });
    }
  }

  prepareState = (id, boolean, array) => {
    const targetIndex = this.getCurrentCocktailIndex(id, boolean, array);
    this.getLastCocktail(targetIndex, boolean);
    this.getNextCocktail(targetIndex, boolean);
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      cocktailId: id,
      ifCreation: boolean,
      index: targetIndex,
      isLoading: false,
      creations: [...array]
    });
  }

  getCurrentCocktailIndex = (id, ifCreation, creations) => {
    const { DataInSessionStorage } = this.props;
    let targetIndex;
    if (ifCreation) {
      targetIndex = creations.findIndex((item) => item.cocktail_id === id);
    } else {
      targetIndex = DataInSessionStorage.allRecipeData.findIndex((item) => item.cocktail_id === id);
    }
    return targetIndex;
  }

  determineDataSource = (ifCreation) => {
    const { DataInSessionStorage } = this.props;
    const { creations } = this.state;
    let source;
    if (ifCreation) {
      source = creations;
    } else {
      source = DataInSessionStorage.allRecipeData;
    }
    return source;
  }

  getNextCocktail = (index, ifCreation) => {
    const source = this.determineDataSource(ifCreation);
    const ifNext = source[index + 1] !== undefined;
    const id = ifNext ? source[index + 1].cocktail_id : null;
    this.setState({
      nextCocktailId: id,
      index: index + 1
    });
  }

  getLastCocktail = (index, ifCreation) => {
    const source = this.determineDataSource(ifCreation);
    const ifLast = source[index - 1] !== undefined;
    const id = ifLast ? source[index - 1].cocktail_id : null;
    this.setState({
      lastCocktailId: id,
      index: index - 1
    });
  }

  render() {
    const {
      cocktailId, creations, ifCreation, isLoading, nextCocktailId, lastCocktailId
    } = this.state;
    const { location, DataInSessionStorage } = this.props;
    const ifUndefined = location.state === undefined;
    return isLoading
      ? <Loading />
      : (
        <>
          <div className="wrap-detail">
            <div className="switchContent">
              <Link
                className={ifCreation ? '' : 'current'}
                type="button"
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${DataInSessionStorage.allRecipeData[0].cocktail_id}&ifCreation`,
                  state: {
                    cocktailId: DataInSessionStorage.allRecipeData[0].cocktail_id,
                    ifCreation: false
                  }
                }}
              >
CLASSIC
              </Link>
              <Link
                className={ifCreation ? 'current' : ''}
                type="button"
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${creations[0].cocktail_id}&ifCreation=true`,
                  state: {
                    cocktailId: creations[0].cocktail_id,
                    ifCreation: true
                  }
                }}
              >
IDEAS
              </Link>
            </div>
            <main className="main-detail">
              <Link
                className={`last ${lastCocktailId ? '' : 'no-more'}`}
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${lastCocktailId}&ifCreation${ifCreation ? '=true' : ''}`,
                  state: {
                    cocktailId: lastCocktailId,
                    ifCreation
                  }
                }}
                type="button"
              >
                <img src="../../imgs/arrow-left.png" alt="" />
              </Link>
              <div className="detail-box">
                <div className="pic" />
                <div className="blank" />
                <Content
                  cocktailId={ifUndefined ? cocktailId : location.state.cocktailId}
                  creations={creations}
                  ifCreation={ifCreation}
                  key={ifUndefined ? cocktailId : location.state.cocktailId}
                />
              </div>
              <Link
                className={`next ${nextCocktailId ? '' : 'no-more'}`}
                type="button"
                to={{
                  pathname: '/cocktailDetail',
                  search: `search=${nextCocktailId}&ifCreation${ifCreation ? '=true' : ''}`,
                  state: {
                    cocktailId: nextCocktailId,
                    ifCreation
                  }
                }}
              >
                <img src="../../imgs/arrow-right.png" alt="" />
              </Link>
            </main>
          </div>
          <Footer />
        </>
      );
  }
}

export default compose(
  ifAuth,
  withFirebase,
  allRecipeData
)(CocktailDetailPage);
