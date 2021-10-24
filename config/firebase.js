import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    SENDER_ID,
    APP_ID
} from '@env';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID,
    appId: APP_ID,
    measurementId: "G-QN398E4D2M"
};

let firebaseApp;

if(firebase.apps.length === 0) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
    firebaseApp = firebase.app();
}

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };