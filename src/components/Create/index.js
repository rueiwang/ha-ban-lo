/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Link, Prompt } from 'react-router-dom';
import { Dialog } from 'evergreen-ui';
import photo from './assets/photo-camera.png';
import correct from './assets/correct.png';
import required from './assets/required.png';

import Loading from '../Loading';

import '../../css/account-create.css';


function generateKey(pre) {
  return `${pre}_${Date.now()}`;
}

const FORM_INITAIL_STATE = {
  inputing: false,
  cocktailId: '',
  cocktailName: '',
  cocktailPic: '',
  previewPic: '',
  cocktailGlass: 'Brandy Glass',
  cocktailGlassType: 'GlassOfBrandy',
  cocktailCategory: '',
  cocktailIntro: '',
  cocktailTags: [],
  errors: {
    cocktailName: '',
    cocktailPic: 'Only accept jpg file.',
    cocktailCategory: 'Shot, Party Drink, Ordinary Drink etc.',
    cocktailIngredients: [{
      ingredient: 'Choose a ingredient name.'
    }],
    cocktailMeasures: [{
      measure: '1 oz or 1mL etc.'
    }],
    cocktailIntro: 'Steps for making your cocktail.',
    cocktailTags: 'Use blank space to divide your input:Sour Sweet etc.'
  },
  ingredientsInputFields: [{
    ingredientValue: '',
    measureValue: '',
    cocktailIngredientsType: '',
    key: generateKey('ingredient')
  }]
};

const formKey = generateKey('form');
export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...FORM_INITAIL_STATE,
      isLoading: false,
      creations: [],
      filter: 'creating-mode'
    };
    this.onInputChangeStr = this.onInputChangeStr.bind(this);
    this.onInputChangeAry = this.onInputChangeAry.bind(this);
    this.addNewIngredientInput = this.addNewIngredientInput.bind(this);
    this.removeIngredientInput = this.removeIngredientInput.bind(this);
    this.clearAllInput = this.clearAllInput.bind(this);
    this.writeInDatabase = this.writeInDatabase.bind(this);
    this.img = React.createRef();

    this.editCreations = this.editCreations.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.deleteDatabase = this.deleteDatabase.bind(this);
  }

  componentDidMount() {
    this.getCreations();
    this.clearAllInput();
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-restricted-globals
    // 若尚未發布就離開記得提醒
    // eslint-disable-next-line no-restricted-globals
    // const ifExist = confirm('Are yiu sure to quit this page?');
    this.clearAllInput();
    this.setState = (state, callback) => {
      // eslint-disable-next-line no-useless-return
      return;
    };
  }

  editCreations(e, id) {
    const { creations, ingredientsInputFields, errors } = this.state;
    const targetCreation = creations.filter((creation) => creation.cocktail_id === id);
    ingredientsInputFields.splice(0, ingredientsInputFields.length);
    errors.cocktailIngredients.splice(0, errors.cocktailIngredients.length);
    errors.cocktailMeasures.splice(0, errors.cocktailMeasures.length);
    targetCreation[0].cocktail_ingredients.map((item, i) => {
      const obj = {
        ingredientValue: item,
        measureValue: targetCreation[0].cocktail_measures[i],
        cocktailIngredientsType: targetCreation[0].cocktail_ingredients_type[i],
        key: generateKey(`ingredient${i}`)
      };
      ingredientsInputFields.push(obj);
      errors.cocktailIngredients.push({
        ingredient: 'OK'
      });
      errors.cocktailMeasures.push({
        measure: 'OK'
      });
    });

    errors.cocktailName = 'OK';
    errors.cocktailPic = 'OK';
    errors.cocktailCategory = 'OK';
    errors.cocktailIntro = 'OK';
    errors.cocktailTags = 'OK';
    this.setState({
      ...FORM_INITAIL_STATE,
      cocktailId: targetCreation[0].cocktail_id,
      cocktailName: targetCreation[0].cocktail_name,
      cocktailPic: targetCreation[0].cocktail_pic,
      previewPic: targetCreation[0].cocktail_pic,
      cocktailGlass: targetCreation[0].cocktail_glass,
      cocktailGlassType: targetCreation[0].cocktail_glass_type,
      cocktailCategory: targetCreation[0].cocktail_category,
      cocktailIntro: targetCreation[0].cocktail_introduction,
      cocktailTags: targetCreation[0].cocktail_tag.join(' '),
      errors,
      ingredientsInputFields,
      filter: 'editing-mode'
    });
  }

  getCreations() {
    const { firebase, userData } = this.props;
    const { creations } = this.state;
    console.log(userData.authUser.uid);
    firebase.db.collection('members_creations').where('cocktail_creator_id', '==', userData.authUser.uid)
      .get()
      .then((dosSnapshot) => {
        dosSnapshot.forEach((doc) => creations.push(doc.data()));
        this.setState({
          creations: [...creations]
        });
      });
  }

  validateForm(errors) {
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => {
        if (Array.isArray(val)) {
          val.map((item) => Object.values(item).forEach((value) => {
            if (value !== 'OK') {
              valid = false;
            }
          }));
        } else if (!Array.isArray(val)) {
          if (val !== 'OK') {
            valid = false;
          }
        }
      }
    );
    return valid;
  }

  writeInDatabase(e) {
    const { firebase, userData } = this.props;
    const {
      errors,
      cocktailName,
      cocktailPic,
      previewPic,
      cocktailGlass,
      cocktailGlassType,
      cocktailCategory,
      cocktailIngredientsType,
      cocktailIntro,
      cocktailTags,
      ingredientsInputFields
    } = this.state;

    if (!this.validateForm(errors)) {
      alert('Please complete the form.');
      return;
    }

    this.setState({
      isLoading: true
    });
    // 照片上傳到 storage
    const docRef = firebase.db.collection('members_creations').doc();
    const uploadTask = firebase.storageRef.child(`user-recipe-images/${docRef.id}`).put(cocktailPic);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      }, (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log(error);
      }, () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const picUrl = downloadURL;
          const timestamp = Date.now();
          const tagsArray = cocktailTags.split(' ');
          const ingredientsArray = [];
          const measuresArray = [];
          const cocktailIngredientsTypeArray = [];

          ingredientsInputFields.map((item) => {
            ingredientsArray.push(item.ingredientValue);
            measuresArray.push(item.measureValue);
            cocktailIngredientsTypeArray.push(item.cocktailIngredientsType);
          });
          // 全部的創作酒譜

          const fieldObj = {
            cocktail_IBA: null,
            cocktail_category: cocktailCategory,
            cocktail_create_date: timestamp,
            cocktail_glass: cocktailGlass,
            cocktail_glass_type: cocktailGlassType,
            cocktail_id: docRef.id,
            ref: firebase.db.doc(docRef.path),
            cocktail_ingredients: [...ingredientsArray],
            cocktail_ingredients_type: [...cocktailIngredientsTypeArray],
            cocktail_measures: [...measuresArray],
            cocktail_introduction: cocktailIntro,
            cocktail_name: cocktailName,
            cocktail_pic: picUrl,
            cocktail_prefix: this.upperCaseFirstLetter(cocktailName),
            cocktail_tag: [...tagsArray],
            cocktail_creator_id: userData.authUser.uid,
            cocktail_creator_name: userData.authUser.displayName
          };
          this.clearAllInput();
          docRef.set(fieldObj)
            .then((docref) => {
              firebase.db.collection('members').doc(userData.authUser.uid).collection('member_creations').doc(docRef.id)
                .set(fieldObj)
                .then((doc) => {
                  this.setState({
                    isLoading: false
                  });
                })
                .catch((error) => console.log(error));
            });
        });
      });
  }

  updateDatabase(e) {
    const { firebase, userData } = this.props;
    const {
      errors,
      cocktailId,
      cocktailName,
      cocktailPic,
      previewPic,
      cocktailGlass,
      cocktailGlassType,
      cocktailCategory,
      cocktailIngredientsType,
      cocktailIntro,
      cocktailTags,
      ingredientsInputFields,
      creations
    } = this.state;

    if (!this.validateForm(errors)) {
      alert('Please complete the form.');
      return;
    }

    this.setState({
      isLoading: true
    });
    // 如果照片更新要先刪除 storage 舊有的照片再重新上傳
    if (typeof (cocktailPic) !== 'string') {
      const targetCreation = creations.filter((creation) => creation.cocktail_id === cocktailId);
      firebase.storageRef.child(`user-recipe-images/${targetCreation[0].cocktail_id}`)
        .delete()
        .then(() => {
          firebase.storageRef.child(`user-recipe-images/${cocktailId}`)
            .put(cocktailPic)
            .then((snapshot) => {
              snapshot.ref.getDownloadURL().then((downloadURL) => {
                const picUrl = downloadURL;
                const tagsArray = cocktailTags.split(' ');
                const ingredientsArray = [];
                const measuresArray = [];
                const cocktailIngredientsTypeArray = [];

                ingredientsInputFields.map((item) => {
                  ingredientsArray.push(item.ingredientValue);
                  measuresArray.push(item.measureValue);
                  cocktailIngredientsTypeArray.push(item.cocktailIngredientsType);
                });
                // 全部的創作酒譜
                const fieldObj = {
                  cocktail_category: cocktailCategory,
                  cocktail_glass: cocktailGlass,
                  cocktail_glass_type: cocktailGlassType,
                  cocktail_ingredients: [...ingredientsArray],
                  cocktail_ingredients_type: [...cocktailIngredientsTypeArray],
                  cocktail_measures: [...measuresArray],
                  cocktail_introduction: cocktailIntro,
                  cocktail_name: cocktailName,
                  cocktail_pic: picUrl,
                  cocktail_prefix: this.upperCaseFirstLetter(cocktailName),
                  cocktail_tag: [...tagsArray]
                };
                firebase.db.collection('members_creations').doc(cocktailId).update(fieldObj)
                  .then((docref) => {
                    firebase.db.collection('members').doc(userData.authUser.uid).collection('member_creations').doc(cocktailId)
                      .update(fieldObj)
                      .then((doc) => {
                        this.setState({
                          isLoading: false
                        })

                      })
                      .catch((updateError) => console.log('updateError', updateError));
                  });
              });
            })
            .catch((uploadError) => console.log('uploadError', uploadError));
        })
        .catch((deletError) => console.log('deletError', deletError));
    } else {
      const tagsArray = cocktailTags.split(' ');
      const ingredientsArray = [];
      const measuresArray = [];
      const cocktailIngredientsTypeArray = [];

      ingredientsInputFields.map((item) => {
        ingredientsArray.push(item.ingredientValue);
        measuresArray.push(item.measureValue);
        cocktailIngredientsTypeArray.push(item.cocktailIngredientsType);
      });
      // 全部的創作酒譜
      const fieldObj = {
        cocktail_category: cocktailCategory,
        cocktail_glass: cocktailGlass,
        cocktail_glass_type: cocktailGlassType,
        cocktail_ingredients: [...ingredientsArray],
        cocktail_ingredients_type: [...cocktailIngredientsTypeArray],
        cocktail_measures: [...measuresArray],
        cocktail_introduction: cocktailIntro,
        cocktail_name: cocktailName,
        cocktail_pic: cocktailPic,
        cocktail_prefix: this.upperCaseFirstLetter(cocktailName),
        cocktail_tag: [...tagsArray]
      };
      firebase.db.collection('members_creations').doc(cocktailId).update(fieldObj)
        .then(() => {
          firebase.db.collection('members').doc(userData.authUser.uid).collection('member_creations').doc(cocktailId)
            .update(fieldObj)
            .then(() => {
              this.setState({
                isLoading: false
              });

            })
            .catch((updateError) => console.log('updateError', updateError));
        });
    }
  }

  deleteDatabase(e) {
    const { firebase, userData } = this.props;
    const { cocktailId, cocktailName } = this.state;

    // eslint-disable-next-line no-restricted-globals
    // const ifDelete = confirm(`Are you sure to delete ${cocktailName}?`);
    // if (ifDelete) {
    // }
    this.setState({
      isLoading: true
    });
    this.clearAllInput();
    firebase.storageRef.child(`user-recipe-images/${cocktailId}`)
      .delete()
      .then(() => {
        firebase.db.collection('members_creations').doc(cocktailId)
          .delete()
          .then(() => {
            firebase.db.collection('members').doc(userData.authUser.uid).collection('member_creations').doc(cocktailId)
              .delete()
              .then(() => {
                this.setState({
                  isLoading: false
                });
              });
          });
      })
      .catch((delError) => console.log('delError', delError));
  }

  clearAllInput(e) {
    const { errors, ingredientsInputFields } = this.state;
    errors.cocktailName = '';
    errors.cocktailPic = 'Only accept jpg file.';
    errors.cocktailCategory = 'Shot, Party Drink, Ordinary Drink etc.';
    errors.cocktailIntro = 'Steps for making your cocktail.';
    errors.cocktailTags = 'Use blank space to divide your input:Sour Sweet etc.';
    errors.cocktailIngredients.splice(0, errors.cocktailIngredients.length);
    errors.cocktailMeasures.splice(0, errors.cocktailMeasures.length);
    errors.cocktailIngredients.push({ ingredient: 'Choose a ingredient name.' });
    errors.cocktailMeasures.push({ measure: '1 oz or 1mL etc.' });
    ingredientsInputFields.splice(0, ingredientsInputFields.length);
    ingredientsInputFields.push({
      cocktailIngredientsType: '',
      ingredientValue: '',
      measureValue: '',
      key: generateKey('ingredient')
    });
    this.setState({
      ...FORM_INITAIL_STATE,
      errors,
      ingredientsInputFields,
      filter: 'creating-mode'
    });
  }

  previewPic(e) {
    const { files } = e.target;
    const { errors } = this.state;
    if (!files) {
      errors.cocktailPic = 'Requiered Field';
      return;
    }
    // const imgUrl = URL.createObjectURL(files[0]);
    console.log(files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      const imgUrl = e.target.result;
      const { size } = files[0];
      console.log(files[0]);
      this.ifPicValid(imgUrl, size, files[0]);
    };
  }

  ifPicValid(imgUrl, size, file) {
    let isValid = false;
    const { errors } = this.state;
    // 檔案大小限制 1MB
    const maxSize = 1024 * 1024;
    const maxWidth = 700;
    const minWidth = 400;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const picWidth = img.width;
      const picHeight = img.height;
      const picRatio = picWidth / picHeight;
      if (size > maxSize) {
        errors.cocktailPic = 'Invalid size. Must small than 1 MB.';
      } else if (picRatio !== 1) {
        errors.cocktailPic = 'Must be a square photo.';
      } else if (picWidth > maxWidth || picWidth < minWidth) {
        errors.cocktailPic = 'Invalid size. Need to be 400x400 to 700x700';
      } else {
        errors.cocktailPic = 'OK';
        isValid = true;
      }
      if (isValid) {
        this.setState({
          errors,
          previewPic: imgUrl,
          cocktailPic: file
        });
      } else {
        this.setState({
          errors,
          previewPic: null
        });
        return isValid;
      }
    };
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
      case 'cocktailGlassType':
        if (value.trim() === '') {
          errors.cocktailGlassType = 'Required Field';
        } else {
          errors.cocktailGlassType = 'OK';
        }
        break;
      default:
        break;
    }
    if (name === 'cocktailGlassType') {
      const strArray = value.split(' ');
      this.setState({
        [name]: `${strArray[1]}Of${strArray[0]}`,
        cocktailGlass: value
      });
    } else {
      this.setState({ errors, [name]: value, inputing: true });
    }
  }

  // 輸入的值在 state 中存為陣列
  onInputChangeAry(name, value, index, type) {
    const { ingredientsInputFields, errors } = this.state;
    const { DataInSessionStorage } = this.props;
    switch (name) {
      case 'cocktailIngredients':
        // 去除空白+變小寫
        const ifRepeated = DataInSessionStorage.ingredientData.findIndex((item, i) => this.noSpace(item.ingredient_name) === this.noSpace(value)) !== -1;
        if (!ifRepeated) {
          errors.cocktailIngredients[index].ingredient = 'Cannot find in Data Base';
        } else if (value.trim() === '') {
          errors.cocktailIngredients[index].ingredient = 'Required Field';
        } else {
          errors.cocktailIngredients[index].ingredient = 'OK';
        }
        break;
      case 'cocktailMeasures':
        if (value.trim() === '') {
          errors.cocktailMeasures[index].measure = 'Required Field';
        } else if (this.strTransformToArray(value).length < 2) {
          errors.cocktailMeasures[index].measure = 'Invalid form, try 1 oz or 1 ml etc.';
        } else if (!this.onlyNum(value)) {
          errors.cocktailMeasures[index].measure = 'Please add units.';
        } else {
          errors.cocktailMeasures[index].measure = 'OK';
        }
        break;
      default:
        break;
    }
    const targetArray = ingredientsInputFields.filter((item, i) => index === i);
    if (name === 'cocktailIngredients') {
      targetArray[0].ingredientValue = value;
      targetArray[0].cocktailIngredientsType = type;
    } else if (name === 'cocktailMeasures') {
      targetArray[0].measureValue = value;
    }
    ingredientsInputFields[index] = targetArray[0];
    console.log(ingredientsInputFields);
    this.setState({
      errors,
      ingredientsInputFields: [...ingredientsInputFields]
    });
  }

  // 點擊按鈕新增原料輸入框，最多六項
  addNewIngredientInput(index) {
    const { ingredientsInputFields, errors } = this.state;
    if (ingredientsInputFields.length > 5) {
      return;
    }
    errors.cocktailIngredients.push({
      ingredient: 'Choose a ingredient name.'
    });
    errors.cocktailMeasures.push({
      measure: '1 oz or 1mL etc.'
    });
    ingredientsInputFields.push({
      ingredientValue: '',
      measureValue: '',
      cocktailIngredientsType: '',
      key: generateKey('ingredient')
    });
    this.setState({
      errors,
      ingredientsInputFields: [...ingredientsInputFields],
      inputing: true
    });
  }

  // 點擊刪除原料輸入框，不能小於一
  removeIngredientInput(index) {
    console.log(index);
    const { ingredientsInputFields, errors } = this.state;
    if (ingredientsInputFields.length === 1) {
      return;
    }
    errors.cocktailIngredients.splice(index, 1);
    errors.cocktailMeasures.splice(index, 1);
    ingredientsInputFields.splice(index, 1);
    this.setState({
      ingredientsInputFields: [...ingredientsInputFields]
    });
  }

  // 包含數字及符號為 true 表示 invalid
  ifNum(value) {
    const reg = new RegExp(/[0-9]|[%&';=$、+@*()x22]/);
    return reg.test(value);
  }

  // 只有數字
  onlyNum(value) {
    const reg = new RegExp(/^[0-9]?.*\w$/);
    return reg.test(value);
  }

  // 去除空白+變小寫
  noSpace(str) {
    return str.replace(/[\s]*$/g, '').toLowerCase();
  }

  upperCaseFirstLetter(str) {
    const array = str.split('');
    return array[0].toUpperCase();
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
    || errorMessage === '1 oz or 1mL etc.'
    || errorMessage === 'Only accept jpg file.') {
      return '';
    }
    return 'wrong';
  }

  render() {
    const {
      isLoading,
      cocktailName,
      cocktailPic,
      cocktailGlass,
      cocktailCategory,
      cocktailIntro,
      cocktailTags,
      errors,
      ingredientsInputFields,
      previewPic,
      creations,
      filter,
      inputing,
      ifDelete
    } = this.state;
    const { DataInSessionStorage } = this.props;
    return (
      <>
        { isLoading ? <Loading /> : ''}
        <div className="create-wrap">
          <h2>Let&lsquo;s create your own cocktail recipe!</h2>
          <form className="create-form" key={formKey}>
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
                    value={cocktailGlass}
                  >
                    <option id="GlassOfBrandy" value="Brandy Glass">Brandy Glass</option>
                    <option id="GlassOfChampagne" value="Champagne Glass">Champagne Glass</option>
                    <option id="GlassOfHighball" value="Highball Glass">Highball Glass</option>
                    <option id="GlassOfMartini" value="Martini Glass">Martini Glass</option>
                    <option id="GlassOfShot" value="Shot Glass">Shot Glass</option>
                    <option id="GlassOfUFO" value="UFO Glass">UFO Glass</option>
                    <option id="GlassOfWhisky" value="Whisky Glass">Whisky Glass</option>
                  </select>
                </label>
                <p className="create-remind">{errors.cocktailGlassType}</p>
              </div>
              <div className="upload-pic">
                {/* 不能空白、尺寸 */}
                <label htmlFor="create-cocktail-pic" className={`${this.validStatus(errors.cocktailPic)}`}>
                  <div className="preview-pic">
                    <img src={previewPic} alt="" ref={this.img} />
                  </div>
                  <img src={photo} alt="Upload Area" />
                  <input
                    type="file"
                    id="create-cocktail-pic"
                    accept=".jpg, .jpeg"
                    onChange={(e) => this.previewPic(e)}
                  />
                  <p className="create-remind">{errors.cocktailPic}</p>
                </label>
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
                  <button className="plus" type="button" onClick={(e) => this.addNewIngredientInput()}>+</button>
                </label>
                {/* 最少兩樣原料、不能空白、只能跟資料庫符合 */}
                {
                ingredientsInputFields.map((item, i) => (
                  <Ingredients
                    index={i}
                    key={item.key}
                    ingredientValue={item.ingredientValue}
                    measureValue={item.measureValue}
                    ingredientsData={DataInSessionStorage.ingredientData}
                    ingredientErrorMessage={errors.cocktailIngredients}
                    measureErrorMessage={errors.cocktailMeasures}
                    ingredientIsValid={this.validStatus(errors.cocktailIngredients[i].ingredient)}
                    measureIsValid={this.validStatus(errors.cocktailMeasures[i].measure)}
                    addNewIngredientInput={this.addNewIngredientInput}
                    removeIngredientInput={this.removeIngredientInput}
                    onInputChangeAry={this.onInputChangeAry}
                  />
                ))
                }
              </div>

            </div>
            <div className="related-buttons">
              {
                filter === 'creating-mode'
                  ? <button className="add" type="button" onClick={(e) => this.writeInDatabase(e)}>Add</button>
                  : (
                    <>
                      <button className="update" type="button" onClick={(e) => this.updateDatabase(e)}>Update</button>
                      <button className="delete" type="button" onClick={(e) => this.deleteDatabase(e)}>Delete</button>
                    </>
                  )
              }
              <button className="clear" type="button" onClick={(e) => this.clearAllInput(e)}>Clear</button>
            </div>
          </form>

          {/* Creation list */}
          <div className="creations">
            <h2>Your Creation</h2>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="creationsLi" onClick={(e) => this.slideBackward(e, creations.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="creationsLi" />
              </button>
              <ul className="creations-list" ref={this.ulWidth}>
                { creations === []
                  ? <li>LOADING</li>
                  : creations.map((item) => {
                    let category;
                    const condition = item.cocktail_ingredients_type[item.cocktail_ingredients_type.findIndex((ingredient) => ingredient !== 'other')];
                    switch (condition) {
                      case 'vodka':
                        category = 'vodka';
                        break;
                      case 'gin':
                        category = 'gin';
                        break;
                      case 'rum':
                        category = 'rum';
                        break;
                      case 'tequila':
                        category = 'tequila';
                        break;
                      case 'whisky':
                        category = 'whisky';
                        break;
                      case 'liqueur':
                        category = 'liqueur';
                        break;
                      case 'brandy':
                        category = 'brandy';
                        break;
                      default:
                        category = 'all';
                        break;
                    }
                    return (
                      <li key={item.cocktail_id}>
                        <img src="../../imgs/edit.png" alt="edit" className="edit" onClick={(e) => this.editCreations(e, item.cocktail_id)} />
                        <Link to={{
                          pathname: '/cocktailDetail',
                          search: item.cocktail_id,
                          state: {
                            cocktailID: item.cocktail_id,
                            ifClassic: false,
                            isCollected: false
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
              <button className="goForward" type="button" data-target="creationsLi" onClick={(e) => this.slideForward(e, creations.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="creationsLi" />
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }
}


class Ingredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      ingredientInputValue: '',
      updateSuggestion: []
    };

    this.onChange = this.onChange.bind(this);
    this.anotherField = this.anotherField.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  componentDidMount() {
    this.renderOptions();
  }

  // 輸入的值在 state 中存為陣列
  onChange(e, index) {
    e.preventDefault();
    const { onInputChangeAry } = this.props;
    const { name, value } = e.target;
    onInputChangeAry(name, value, index);
    if (name === 'cocktailIngredients') {
      this.setState({
        isFocused: true
      });
      this.setState({
        ingredientInputValue: value
      });
      this.renderOptions();
    }
  }

  // 點擊選擇建議
  chooseSuggestion(e) {
    const { onInputChangeAry } = this.props;
    const { dataset } = e.target;
    onInputChangeAry('cocktailIngredients', dataset.value, Number(dataset.index), dataset.type);

    this.setState({
      isFocused: false
    });
  }

  renderOptions() {
    const { ingredientsData } = this.props;
    const { ingredientInputValue } = this.state;
    const updateData = ingredientsData
      .filter((item) => item.ingredient_name.toLowerCase().indexOf(ingredientInputValue.toLowerCase()) !== -1);
    this.setState({
      updateSuggestion: [...updateData]
    });
    if (updateData.length === 0) {
      this.setState({
        updateSuggestion: [...ingredientsData],
        isFocused: false
      });
    }
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
    const { isFocused, updateSuggestion } = this.state;
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
              <ul className={`auto-complete-list ${isFocused ? 'down' : ''}`}>
                {
                  updateSuggestion.map((updateItem, i) => (
                    <li
                      data-value={updateItem.ingredient_name}
                      data-type={updateItem.ingredient_type}
                      data-index={index}
                      key={updateItem.ingredient_id}
                      onClick={(e) => this.chooseSuggestion(e)}
                    >
                      {updateItem.ingredient_name}
                    </li>
                  ))
                }
              </ul>
              <img src={ingredientIsValid === 'correct' ? correct : required} className="correct" alt="" />
            </label>
            <p className="create-remind">{ingredientErrorMessage[index].ingredient}</p>
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
            <p className="create-remind">{measureErrorMessage[index].measure}</p>
          </div>
          <button className="minus" data-index={index} type="button" onClick={(e) => this.anotherField(e, index)}>-</button>
        </div>
      </>
    );
  }
}
