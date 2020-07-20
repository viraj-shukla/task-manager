const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.js');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://task-manager-ed416.firebaseio.com"
});
const db = admin.firestore();

const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig.js')
firebase.initializeApp(firebaseConfig);