import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDmb0ixL_qui06ihq5-q9TaoUpouujLhxM',
  authDomain: 'ha-ban-lo.firebaseapp.com',
  databaseURL: 'https://ha-ban-lo.firebaseio.com',
  projectId: 'ha-ban-lo',
  storageBucket: 'ha-ban-lo.appspot.com',
  messagingSenderId: '134471493645',
  appId: '1:134471493645:web:8d5b53dcd1c7546ad40d44',
  measurementId: 'G-057V7R1B18'
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.account = app.auth;
    this.db = app.firestore();
    this.storage = app.storage();
    this.storageRef = this.storage.ref();
    this.actionCodeSettings = {
      url: 'https://ha-ban-lo.firebaseapp.com/#member',
      handleCodeInApp: false
    };
  }

  //  *** Auth ***

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithAccount = (provider) => this.auth.signInWithPopup(provider);

  doSignOut = () => this.auth.signOut();

  sendPasswordResetEmail = (email) => this.auth.sendPasswordResetEmail(email, this.actionCodeSettings);

  // *** Ref ***

  memberDBRef = (uid) => this.db.doc(this.db.collection('members').doc(`${uid}`).path);

  creationDocRef = () => this.db.collection('members_creations').doc();

  // *** Member only ***

  member = (uid) => this.db.collection('members').doc(uid);

  memberIngredients = (uid) => this.db.collection('members').doc(uid).collection('member_ingredients');

  memberCollections = (uid) => this.db.collection('members').doc(uid).collection('member_collections');

  memberDataFromDB = (uid, dataType) => this.db.collection('members').doc(uid).collection(dataType);

  searchMemberCreations = (uid) => this.db.collection('members_creations').where('cocktail_creator_id', '==', uid).get();

  deleteMemberCreation = (creationId, uid) => (
    this.db.collection('members_creations').doc(creationId).delete()
      .then(() => this.db.collection('members').doc(uid).collection('member_creations').doc(creationId)
        .delete())
  )

  setMemberCreation = (ref, content, uid) => (
    ref.set(content)
      .then(() => this.db.collection('members').doc(uid).collection('member_creations').doc(ref.id)
        .set(content))
  )

  updateMemberCreation = (creationId, content, uid) => (
    this.db.collection('members_creations').doc(creationId).update(content)
      .then(() => {
        this.db.collection('members').doc(uid).collection('member_creations').doc(creationId)
          .update(content);
      })
  )
  // *** DB Storage ***

  putFileInStorage = (docName, file) => this.storageRef.child(`user-recipe-images/${docName}`).put(file);

  deleteFileInStorage = (docName) => this.storageRef.child(`user-recipe-images/${docName}`).delete();

  //  *** Public ***

  getPublicDataFromDB = (collectionName) => this.db.collection(collectionName).get();

  getAllMemberCreations = () => this.db.collection('members_creations').orderBy('cocktail_create_date', 'desc').get();

  getAllCocktail = () => this.db.collection('all_cocktail_recipe').get();

  getCocktail = (num) => this.db.collection('all_cocktail_recipe').limit(num).get();

  getNextCocktail = (next) => this.db.collection('all_cocktail_recipe').startAfter(next).limit(20).get();

  searchCocktailByName = (name) => this.db.collection('all_cocktail_recipe').where('cocktail_name', '==', name).get();

  searchCocktailById = (id) => this.db.collection('all_cocktail_recipe').where('cocktail_id', '==', id).get();

  searchCocktailByIngredientsType = (type) => this.db.collection('all_cocktail_recipe').where('cocktail_ingredients_type', 'array-contains', type)
}

export default Firebase;
