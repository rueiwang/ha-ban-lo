/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import APP from '../../lib';

import InputText from './InputText';
import InputTextarea from './InputTextarea';
import InputFile from './InputFile';
import InputIngredientsFieids from './InputIngredientsFieids';
import Select from './Select';
import SlideBox from '../SlideBox';
import Dialog from '../Dialog';
import { FORM_INITAIL_STATE } from './constant';
import Loading from '../Loading';

import '../../css/account-create.css';

const formKey = APP.generateKey('form');
export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...FORM_INITAIL_STATE,
      isLoading: false,
      creations: [],
      filter: 'creating-mode',
      isShown: false,
      isDialodShow: false,
      dialogType: '',
      dialogHead: '',
      dialogText: ''
    };
    this.img = React.createRef();
  }

  componentDidMount() {
    this.clearAllInput();
    this.getCreations();
  }

  componentWillUnmount() {
    this.clearAllInput();
    this.setState = (state, callback) => '';
  }

  editCreations = (e, id) => {
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
        key: APP.generateKey(`ingredient${i}`)
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

  getCreations = () => {
    const { firebase, userData } = this.props;
    const { creations } = this.state;
    firebase.db.collection('members_creations').where('cocktail_creator_id', '==', userData.authUser.uid)
      .get()
      .then((dosSnapshot) => {
        dosSnapshot.forEach((doc) => creations.push(doc.data()));
        this.setState({
          creations: [...creations]
        });
      });
  }

  validateForm = (errors) => {
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

  writeInDatabase = (e) => {
    const { firebase, userData } = this.props;
    const {
      errors,
      cocktailName,
      cocktailPic,
      cocktailGlass,
      cocktailGlassType,
      cocktailCategory,
      cocktailIntro,
      cocktailTags,
      ingredientsInputFields,
      isShown
    } = this.state;

    if (!this.validateForm(errors) || isShown) {
      alert('Please complete the form.');
      this.setState({
        isShown: !isShown
      });
      return;
    }

    this.setState({
      isLoading: true
    });
    // 照片上傳到 storage
    const docRef = firebase.db.collection('members_creations').doc();
    firebase.storageRef.child(`user-recipe-images/${docRef.id}`)
      .put(cocktailPic)
      .then((snapshot) => {
      // Upload completed successfully, now we can get the download URL
        snapshot.ref.getDownloadURL().then((downloadURL) => {
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
                    isLoading: false,
                    isShown: false
                  });
                })
                .catch((error) => console.log(error));
            });
        });
      });
  }

  updateDatabase = (e) => {
    const { firebase, userData } = this.props;
    const {
      errors,
      cocktailId,
      cocktailName,
      cocktailPic,
      cocktailGlass,
      cocktailGlassType,
      cocktailCategory,
      cocktailIntro,
      cocktailTags,
      ingredientsInputFields,
      creations,
      isShown
    } = this.state;

    if (!this.validateForm(errors) || isShown) {
      alert('Please complete the form.');
      this.setState({
        isShown: !isShown
      });
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
                          isLoading: false,
                          isShown: false
                        });
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

  deleteDatabase = (e) => {
    const { firebase, userData } = this.props;
    const { cocktailId } = this.state;
    this.setState({
      isDialodShow: true,
      dialogType: 'alert',
      dialogHead: 'DELETED',
      dialogText: 'Try create another recipe!'
    });
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

  clearAllInput = (e) => {
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
      key: APP.generateKey('ingredient')
    });
    this.setState({
      ...FORM_INITAIL_STATE,
      errors,
      ingredientsInputFields,
      filter: 'creating-mode'
    });
  }

  previewPic = (e) => {
    const { files } = e.target;
    const { errors } = this.state;
    if (!files) {
      errors.cocktailPic = 'Requiered Field';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      const imgUrl = event.target.result;
      const { size } = files[0];
      this.ifPicValid(imgUrl, size, files[0]);
    };
  }

  ifPicValid = (imgUrl, size, file) => {
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
      const ifSquarePic = picWidth / picHeight !== 1;
      if (size > maxSize) {
        errors.cocktailPic = 'Invalid size. Must small than 1 MB.';
      } else if (ifSquarePic) {
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
      }
    };
  }

  // 輸入的值在 state 中存為字串
  onInputChangeStr = (e) => {
    const { name, value } = e.target;
    const { errors } = this.state;
    const { DataInSessionStorage } = this.props;
    const ifRepeated = DataInSessionStorage.allRecipeData.findIndex((item) => this.noSpace(item.cocktail_name) === this.noSpace(value)) !== -1;
    switch (name) {
      case 'cocktailName':
        // 去除空白+變小寫
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
      this.setState({ errors, [name]: value });
    }
  }

  // 輸入的值在 state 中存為陣列
  onInputChangeAry = (name, value, index, type) => {
    const { ingredientsInputFields, errors } = this.state;
    const { DataInSessionStorage } = this.props;
    const ifRepeated = DataInSessionStorage.ingredientData.findIndex((item) => this.noSpace(item.ingredient_name) === this.noSpace(value)) === -1;
    const ifTwoIngredient = ingredientsInputFields.length < 2;
    switch (name) {
      case 'cocktailIngredients':
        if (ifRepeated) {
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
    this.setState({
      errors,
      ingredientsInputFields: [...ingredientsInputFields],
      isShown: ifTwoIngredient
    });
  }

  // 點擊按鈕新增原料輸入框，最多六項
  addNewIngredientInput = () => {
    const { ingredientsInputFields, errors } = this.state;
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
      key: APP.generateKey('ingredient')
    });
    this.setState({
      errors,
      ingredientsInputFields: [...ingredientsInputFields]
    });
  }

  // 點擊刪除原料輸入框，不能小於一
  removeIngredientInput = (index) => {
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

  ifNum = (value) => new RegExp(/[0-9]|[%&';=$、+@*()x22]/).test(value);

  onlyNum = (value) => new RegExp(/^[0-9]?.*\w$/).test(value);

  noSpace = (str) => str.replace(/[\s]*$/g, '').toLowerCase();

  strTransformToArray = (value) => value.split(' ');

  upperCaseFirstLetter = (str) => this.strTransformToArray(str)[0].toUpperCase();


  validStatus = (errorMessage) => {
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

  closeDialog = (e, boolean) => {
    this.setState({
      isDialodShow: false,
      dialogResult: boolean
    });
    return boolean;
  }

  render() {
    const {
      isLoading,
      cocktailName,
      cocktailGlass,
      cocktailCategory,
      cocktailIntro,
      cocktailTags,
      errors,
      ingredientsInputFields,
      previewPic,
      creations,
      filter,
      isShown,
      isDialodShow,
      dialogType,
      dialogHead,
      dialogText
    } = this.state;
    const { DataInSessionStorage } = this.props;
    return (
      <>
        { isLoading ? <Loading /> : ''}
        { isDialodShow ? (
          <Dialog
            type={dialogType}
            head={dialogHead}
            text={dialogText}
            confirm={this.closeDialog}
            reject={this.closeDialog}
          />
        ) : ''}
        <div className="create-wrap">
          <h2>Let&lsquo;s create your own cocktail recipe!</h2>
          <form className="create-form" key={formKey}>
            <div className="top">
              <div className="text-area">
                <InputText
                  id="name"
                  name="cocktailName"
                  value={cocktailName}
                  event={this.onInputChangeStr}
                  errors={errors.cocktailName}
                  validation={this.validStatus}
                  label="Cocktail Name"
                />
                <InputText
                  id="category"
                  name="cocktailCategory"
                  value={cocktailCategory}
                  event={this.onInputChangeStr}
                  errors={errors.cocktailCategory}
                  validation={this.validStatus}
                  label="Cocktail Category"
                />
                <InputText
                  id="tag"
                  name="cocktailTags"
                  value={cocktailTags}
                  event={this.onInputChangeStr}
                  errors={errors.cocktailTags}
                  validation={this.validStatus}
                  label="Flavor of Cocktail"
                />
                <Select
                  id="glass"
                  name="cocktailGlassType"
                  value={cocktailGlass}
                  event={this.onInputChangeStr}
                  errors={errors.cocktailGlass}
                  label="Glass for Cocktail"
                />
              </div>
              <InputFile
                id="pic"
                file={this.img}
                previewSrc={previewPic}
                event={this.previewPic}
                errors={errors.cocktailPic}
                validation={this.validStatus}
              />
            </div>
            <div className="bottom">
              <div className="intro-area">
                <InputTextarea
                  id="intro"
                  name="cocktailIntro"
                  value={cocktailIntro}
                  event={this.onInputChangeStr}
                  errors={errors.cocktailIntro}
                  validation={this.validStatus}
                  label="Introduction for Cocktail"
                />
              </div>
              <div className="ingredients-area">
                <label htmlFor="create-cocktail-ingredient">
              Ingredients for Cocktail
                  <div className={`two-ingredient-prompt ${isShown ? 'show' : ''}`}>
                    <p>at least 2 items!</p>
                  </div>
                  {
                    ingredientsInputFields.length > 5
                      ? ''
                      : (<button className="plus" type="button" onClick={(e) => this.addNewIngredientInput()}>+</button>)
                  }
                </label>
                {
                ingredientsInputFields.map((item, i) => (
                  <InputIngredientsFieids
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
          <SlideBox
            type="creations"
            arr={creations}
            event={this.editCreations}
          />
        </div>
      </>
    );
  }
}
