import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyALyMyk2jpdbSkq4gml4siidXzlzybs1AA',
  authDomain: 'chatroomdemo-428e2.firebaseapp.com',
  databaseURL: 'https://chatroomdemo-428e2.firebaseio.com',
  projectId: 'chatroomdemo-428e2',
  storageBucket: 'chatroomdemo-428e2.appspot.com',
  // messagingSenderId: '',
  // appId: '',
};
const db = firebase.initializeApp(firebaseConfig).firestore();

export default db;
