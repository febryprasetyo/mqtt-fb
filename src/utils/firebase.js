const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./../../fastpec-oms-sdk');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://fastpec-oms-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const db = getFirestore();

module.exports = { db };
