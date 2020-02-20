/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import photo from './assets/photo-camera.png';
import correct from './assets/correct.png';
import down from './assets/arrow-point-to-down.png';
import up from './assets/arrow-point-to-up.png';
import required from './assets/required.png';


import '../../css/account-create.css';

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cocktailIBA: null,
      cocktailName: null,
      cocktailPrefix: null,
      cocktailPic: null,
      previewPic: null,
      cocktailGlass: 'Brandy Glass',
      cocktailGlassType: 'GlassOfBrandy',
      cocktailCategory: null,
      cocktailIngredients: [],
      cocktailMeasures: [],
      cocktailIngredientsType: [],
      cocktailIntro: null,
      cocktailTags: [],
      errors: {
        cocktailIBA: '',
        cocktailName: '',
        cocktailPrefix: '',
        cocktailPic: '',
        cocktailGlass: '',
        cocktailGlassType: '',
        cocktailCategory: 'Shot, Party Drink, Ordinary Drink etc.',
        cocktailIngredients: 'Choose a ingredient name.',
        cocktailMeasures: '1 oz or 1mL etc.',
        cocktailIntro: 'Steps for making your cocktail.',
        cocktailTags: 'Use blank space to divide your input:Sour Sweet etc.'
      },
      ingredientsInputFields: [{
        ingredientValue: null,
        measureValue: null
      }]
    };

    this.onInputChangeStr = this.onInputChangeStr.bind(this);
    this.onInputChangeAry = this.onInputChangeAry.bind(this);

    this.addNewIngredientInput = this.addNewIngredientInput.bind(this);
    this.removeIngredientInput = this.removeIngredientInput.bind(this);
    this.previewPic = this.previewPic.bind(this);
  }

  componentDidMount() {
    // this.addNewIngredientInput();
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-restricted-globals
    // 若尚未發布就離開記得提醒
    // eslint-disable-next-line no-restricted-globals
    confirm('Are yiu sure to quit this page?');
  }

  previewPic(e) {
    const { files } = e.target;
    const url = URL.createObjectURL(files[0]);
    console.log(files[0]);
    this.setState({
      cocktailPic: files[0],
      previewPic: url
    });
  }

  // 輸入的值在 state 中存為字串
  onInputChangeStr(e) {
    const { name, value } = e.target;
    const { ingredients, errors } = this.state;
    const { DataInSessionStorage } = this.props;

    switch (name) {
      case 'cocktailName':
        // 去除空白+變小寫
        const ifRepeated = DataInSessionStorage.cacheData.findIndex((item, i) => this.noSpace(item.cocktail_name) === this.noSpace(value)) !== -1;
        if (ifRepeated) {
          errors.cocktailName = 'Already in Data Base';
        } else if (value.trim() === '') {
          errors.cocktailName = 'Required Field';
        } else if (this.ifNum(value)) {
          errors.cocktailCategory = 'Numbers and markers are invalid.';
        } else {
          errors.cocktailName = 'OK';
        }
        break;
      case 'cocktailCategory':
        if (value.trim() === '') {
          errors.cocktailCategory = 'Required Field';
        } else if (this.ifNum(value)) {
          errors.cocktailCategory = 'Numbers and markers are invalid.';
        } else {
          errors.cocktailCategory = 'OK';
        }
        break;
      case 'cocktailTags':
        if (value.trim() === '') {
          errors.cocktailTags = 'Required Field';
        } else if (this.ifNum(value)) {
          errors.cocktailTags = 'Numbers and markers are invalid.';
        } else if (this.strTransformToArray(value).length > 3) {
          errors.cocktailTags = 'Up to 3 tags';
        } else {
          errors.cocktailTags = 'OK';
        }
        break;
      case 'cocktailIntro':
        if (value.trim() === '') {
          errors.cocktailIntro = 'Required Field';
        } else if (this.ifNum(value)) {
          errors.cocktailIntro = 'Numbers and markers are invalid.';
        } else if (this.strTransformToArray(value).length < 10 || this.strTransformToArray(value).length > 100) {
          errors.cocktailIntro = 'At least 10 words, up to 100 words';
        } else {
          errors.cocktailIntro = 'OK';
        }
        break;
      default:
        break;
    }
    if (name === 'cocktailGlassType') {
      const strArray = value.split(' ');
      this.setState({
        [name]: strArray[0],
        cocktailGlass: strArray[1]
      });
    } else {
      this.setState({ errors, [name]: value });
    }
  }

  // 輸入的值在 state 中存為陣列
  onInputChangeAry(name, value, index) {
    const { ingredientsInputFields, errors } = this.state;
    const { DataInSessionStorage } = this.props;
    switch (name) {
      case 'cocktailIngredients':
        // 去除空白+變小寫
        const ifRepeated = DataInSessionStorage.ingredientData.findIndex((item, i) => this.noSpace(item.ingredient_name) === this.noSpace(value)) !== -1;
        if (!ifRepeated) {
          errors.cocktailIngredients = 'Cannot find in Data Base';
        } else if (value.trim() === '') {
          errors.cocktailIngredients = 'Required Field';
        } else if (this.ifNum(value)) {
          errors.cocktailCategory = 'Numbers and markers are invalid.';
        } else {
          errors.cocktailIngredients = 'OK';
        }
        break;
      case 'cocktailMeasures':
        if (value.trim() === '') {
          errors.cocktailMeasures = 'Required Field';
        } else if (this.strTransformToArray(value).length < 2) {
          errors.cocktailMeasures = 'Invalid form, try 1 oz or 1 ml etc.';
        } else if (this.onlyNum(value)) {
          errors.cocktailMeasures = 'Please add units.';
        } else {
          errors.cocktailMeasures = 'OK';
        }
        break;
      default:
        break;
    }
    this.setState((state) => {
      const fieldsArray = ingredientsInputFields.map((item, i) => {
        if (index === i) {
          if (name === 'cocktailIngredients') {
            item.ingredientValue = value;
          } else if (name === 'cocktailMeasures') {
            item.measureValue = value;
          }
        }
      });
      return {
        errors,
        fieldsArray
      };
    });
  }

  // 點擊按鈕新增原料輸入框，最多六項
  addNewIngredientInput() {
    const { ingredientsInputFields } = this.state;
    if (ingredientsInputFields.length > 5) {
      return;
    }
    ingredientsInputFields.push({
      ingredientValue: null,
      measureValue: null
    });
    this.setState({
      ingredientsInputFields: [...ingredientsInputFields]
    });
  }

  // 點擊刪除原料輸入框，不能小於一
  removeIngredientInput(index) {
    console.log(index);
    const { ingredientsInputFields } = this.state;
    if (ingredientsInputFields.length === 1) {
      return;
    }
    ingredientsInputFields.splice(index, 1);
    this.setState({
      ingredientsInputFields: [...ingredientsInputFields]
    });
  }

  // 包含數字及符號為 true 表示 invalid
  ifNum(value) {
    const reg = new RegExp(/[0-9]|[%&',;=?$x22]/);
    return reg.test(value);
  }

  // 只有數字
  onlyNum(value) {
    const reg = new RegExp(/[^a-zA-Z]/);
    return reg.test(value);
  }

  // 去除空白+變小寫
  noSpace(str) {
    return str.replace(/[\s]*$/g, '').toLowerCase();
  }

  // string to array
  strTransformToArray(value) {
    return value.split(' ');
  }

  validStatus(errorMessage) {
    if (errorMessage === 'OK') {
      return 'correct';
    }
    if (errorMessage === ''
    || errorMessage === 'Shot, Party Drink, Ordinary Drink etc.'
    || errorMessage === 'Steps for making your cocktail.'
    || errorMessage === 'Use blank space to divide your input:Sour Sweet etc.'
    || errorMessage === 'Choose a ingredient name.'
    || errorMessage === '1 oz or 1mL etc.') {
      return '';
    }
    return 'wrong';
  }

  render() {
    const {
      cocktailName,
      cocktailPic,
      cocktailCategory,
      cocktailIntro,
      cocktailTags,
      errors,
      ingredientsInputFields,
      previewPic
    } = this.state;
    return (
      <div className="create-wrap">
        <h2>Let&lsquo;s create your own cocktail recipe!</h2>
        <form className="create-form">
          <div className="top">
            <div className="text-area">
              {/* 不能空白、名字不能與資料庫重複、不能有數字 */}
              <label htmlFor="create-cocktail-name">
Cocktail Name
              </label>
              <label className="input-icon">
                <input
                  name="cocktailName"
                  onChange={(e) => this.onInputChangeStr(e)}
                  value={cocktailName}
                  autoComplete="off"
                  type="text"
                  id="create-cocktail-name"
                  className={`${this.validStatus(errors.cocktailName)}`}
                />
                <img src={this.validStatus(errors.cocktailName) === 'correct' ? correct : required} className="correct" alt="" />
              </label>
              <p className="create-remind">{errors.cocktailName}</p>
              {/* 不能空白、必須是英文字母、三個單字以下 */}
              <label htmlFor="create-cocktail-category">
Cocktail Category
              </label>
              <label className="input-icon">
                <input
                  name="cocktailCategory"
                  onChange={(e) => this.onInputChangeStr(e)}
                  value={cocktailCategory}
                  autoComplete="off"
                  type="text"
                  id="create-cocktail-category"
                  className={`${this.validStatus(errors.cocktailCategory)}`}
                />
                <img src={this.validStatus(errors.cocktailCategory) === 'correct' ? correct : required} className="correct" alt="" />
              </label>
              <p className="create-remind">{errors.cocktailCategory}</p>
              {/* 不能空白、必須是英文字母、三個單字以下 */}
              <label htmlFor="create-cocktail-tag">
Flavor of Cocktail
              </label>
              <label className="input-icon">
                <input
                  name="cocktailTags"
                  onChange={(e) => this.onInputChangeStr(e)}
                  value={cocktailTags}
                  autoComplete="off"
                  type="text"
                  id="create-cocktail-tag"
                  className={`${this.validStatus(errors.cocktailTags)}`}
                />
                <img src={this.validStatus(errors.cocktailTags) === 'correct' ? correct : required} className="correct" alt="" />
              </label>
              <p className="create-remind">{errors.cocktailTags}</p>
              <label htmlFor="create-cocktail-glass">
Glass for Cocktail
              </label>
              <label className="input-icon">
                <select
                  name="cocktailGlassType"
                  className="drop-down-menu-input"
                  id="create-cocktail-glass"
                  onChange={(e) => this.onInputChangeStr(e)}
                >
                  <option id="GlassOfBrandy" value="GlassOfBrandy Brandy-Glass">Brandy Glass</option>
                  <option id="GlassOfChampagne" value="GlassOfChampagne Champagne-Glass">Champagne Glass</option>
                  <option id="GlassOfHighball" value="GlassOfHighball Highball-Glass">Highball Glass</option>
                  <option id="GlassOfMartini" value="GlassOfMartini Martini-Glass">Martini Glass</option>
                  <option id="GlassOfShot" value="GlassOfShot Shot-Glass">Shot Glass</option>
                  <option id="GlassOfUFO" value="GlassOfUFO UFO-Glass">UFO Glass</option>
                  <option id="GlassOfWhisky" value="GlassOfWhisky Whisky-Glass">Whisky Glass</option>
                </select>
              </label>
            </div>
            <div className="upload-pic">
              {/* 不能空白、尺寸 */}
              <label htmlFor="create-cocktail-pic">
                <div className="preview-pic">
                  <img src={previewPic} alt="" />
                </div>
                <img src={photo} alt="Upload Area" />
                <input
                  type="file"
                  id="create-cocktail-pic"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => this.previewPic(e)}
                />
                <p className="create-remind">Bigger than 400 X 400, Small than 700 X 700</p>
              </label>
              <p className="create-remind">{errors.cocktailPic}</p>
            </div>
          </div>
          <div className="bottom">
            <div className="intro-area">
              {/* 不能空白，最少 10 個單字、最多有 100 個單字，以空格計算 */}
              <label htmlFor="create-cocktail-intro">
Introduction for Cocktail
              </label>
              <textarea
                name="cocktailIntro"
                onChange={(e) => this.onInputChangeStr(e)}
                value={cocktailIntro}
                id="create-cocktail-intro"
                resize="none"
                className={`${this.validStatus(errors.cocktailIntro)}`}
              />
              <p className="create-remind">{errors.cocktailIntro}</p>
            </div>
            <div className="ingredients-area">
              <label htmlFor="create-cocktail-ingredient">
              Ingredients for Cocktail
                <span>( Max 6 items )</span>
                <button className="plus" type="button" onClick={(e) => this.addNewIngredientInput()}>+</button>
              </label>
              {/* 最少兩樣原料、不能空白、只能跟資料庫符合 */}
              {
                ingredientsInputFields.map((item, i) => (
                  <Ingredients
                    index={i}
                    ingredientValue={item.ingredientValue}
                    measureValue={item.measureValue}
                    ingredientErrorMessage={errors.cocktailIngredients}
                    measureErrorMessage={errors.cocktailMeasures}
                    ingredientIsValid={this.validStatus(errors.cocktailIngredients)}
                    measureIsValid={this.validStatus(errors.cocktailMeasures)}
                    addNewIngredientInput={this.addNewIngredientInput}
                    removeIngredientInput={this.removeIngredientInput}
                    onInputChangeAry={this.onInputChangeAry}
                  />
                ))
                }
            </div>

          </div>
          <div className="related-buttons">
            <button className="add" type="button">Add</button>
            <button className="clear" type="button">Clear</button>
            <button className="Preview" type="button">Preview</button>
          </div>
        </form>
      </div>
    );
  }
}


class Ingredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilled: false,
      isClicked: false
    };

    this.onChange = this.onChange.bind(this);
    this.anotherField = this.anotherField.bind(this);
  }

  // 輸入的值在 state 中存為陣列
  onChange(e, index) {
    e.preventDefault();
    const { onInputChangeAry } = this.props;
    const { name, value } = e.target;
    onInputChangeAry(name, value, index);
  }

  anotherField(e, index) {
    const { removeIngredientInput } = this.props;
    removeIngredientInput(index);
  }

  render() {
    const {
      index,
      measureValue,
      ingredientValue,
      ingredientErrorMessage,
      measureErrorMessage,
      ingredientIsValid,
      measureIsValid
    } = this.props;
    return (
      <>
        <div className="create-cocktail-ingredient-field">
          <div className="field">
            <label className="input-icon">
              {/* 唯讀，只能選資料庫有的原料 */}
              <input
                name="cocktailIngredients"
                onChange={(e) => this.onChange(e, index)}
                className={`auto-complete-input create-cocktail-ingredient ${ingredientIsValid}`}
                autoComplete="off"
                type="text"
                value={ingredientValue}
              />
              {/* eslint-disable-next-line react/self-closing-comp */}
              <ul className="auto-complete-list">
              </ul>
              <img src={ingredientIsValid === 'correct' ? correct : required} className="correct" alt="" />
            </label>
            <p className="create-remind">{ingredientErrorMessage}</p>
          </div>
          <div className="field">
            <label className="input-icon">
              <input
                name="cocktailMeasures"
                onChange={(e) => this.onChange(e, index)}
                autoComplete="off"
                type="text"
                className={`create-cocktail-ingredient-measure ${measureIsValid}`}
                value={measureValue}
              />
              <img src={measureIsValid === 'correct' ? correct : required} className="correct" alt="" />
            </label>
            <p className="create-remind">{measureErrorMessage}</p>
          </div>
          <button className="minus" data-index={index} type="button" onClick={(e) => this.anotherField(e, index)}>-</button>
        </div>
      </>
    );
  }
}
