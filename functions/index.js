const functions = require('firebase-functions');
const body_parser = require("body-parser");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cursos-cenfotec.firebaseio.com"
});

const db = admin.firestore();

const careerRoute = require('./routes/careers');
const courseRoute = require('./routes/courses');
const studentRoute = require('./routes/students');
const student_careerRoute = require('./routes/student_career');
const student_courseRoute = require('./routes/student_course');
const users = require('./routes/users');
const career_courseRoute = require('./routes/career_course');

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api', careerRoute);
app.use('/api', courseRoute);
app.use('/api', studentRoute);
app.use('/api', student_careerRoute);
app.use('/api', users);
app.use('/api', career_courseRoute);
app.use('/api', student_courseRoute);

exports.app = functions.https.onRequest(app);
