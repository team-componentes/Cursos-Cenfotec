'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/student_career/read/:student_id', (req, res) => {
    const reference = db.collection('student_career').doc(req.body.studentId);
    const response = {};
    (async () => {
        try {
            const snapshot = await reference.get();
            const studentReference = snapshot.data().reference;

            const studentSnapshot = await studentReference.get();
            response['student'] = studentSnapshot.data();

            const promises = [];
            const careersSnapshot = await reference.collection('careers').get();

            careersSnapshot.docs.forEach(career => {
                const careerReference = career.data().reference;
                const p = careerReference.get();
                promises.push(p);
            })

            const careers = [];
            const snapshots = await Promise.all(promises);
            snapshots.forEach((career,index) => {
                careers[index] = career.data();
            })
            response['careers'] = careers;
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send(error);
        }
    })();
})

router.post('student_career', (req, res) =>{
    db.collection('career_student').doc(req.body.studentId).collection('careers').doc(req.body.careerId)
    .create(
        {
            reference: db.doc(`/careers/${req.body.careerId}`)
        }
    )
    .then(() => res.status(200).send({}))
    .catch((error) => console.log(error))
})

module.exports = router;