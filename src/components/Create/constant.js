import APP from '../../lib';

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
    key: APP.generateKey('ingredient')
  }]
};

const GLASS_TYPE_ARRAY = [
  {
    type: 'GlassOfBrandy',
    name: 'Brandy Glass'
  },
  {
    type: 'GlassOfChampagne',
    name: 'Champagne Glass'
  },
  {
    type: 'GlassOfHighball',
    name: 'Highball Glass'
  },
  {
    type: 'GlassOfMartini',
    name: 'Martini Glass'
  },
  {
    type: 'GlassOfShot',
    name: 'Shot Glass'
  },
  {
    type: 'GlassOfUFO',
    name: 'UFO Glass'
  },
  {
    type: 'GlassOfWhisky',
    name: 'Whisky Glass'
  }
];

export { FORM_INITAIL_STATE, GLASS_TYPE_ARRAY };
