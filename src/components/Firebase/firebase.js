import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
  }

  //  *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithAccount = (provider) => this.auth.signInWithPopup(provider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);


  // *** User API ***

  member = (uid) => this.db.collection('members').doc(uid);

  memberCocktail = (uid) => this.db.collection('member_cocktail_recipe').doc(uid);

  memberIngredient = (uid) => this.db.collection('member_ingredient').doc(uid);
}

export default Firebase;
