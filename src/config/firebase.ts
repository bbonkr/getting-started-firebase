import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAam37cC3shcUZJfOjNhExLUB5djolmOuA',
    authDomain: 'getting-started-firebase-67861.firebaseapp.com',
    databaseURL: 'https://getting-started-firebase-67861.firebaseio.com',
    projectId: 'getting-started-firebase-67861',
    storageBucket: 'getting-started-firebase-67861.appspot.com',
    messagingSenderId: '304089013238',
    appId: '1:304089013238:web:eb8bb82e6f453e5975c5d7',
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();

export const dbService = firebase.firestore();
