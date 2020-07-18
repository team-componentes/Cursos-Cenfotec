const body_parser = require("body-parser");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const serviceAccount = require("./permissions.json");

const itemRoute = require('./routes/item');

//pleaaasee
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cursos-cenfotec.firebaseio.com"
});
const db = admin.firestore();

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api', itemRoute);