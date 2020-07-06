'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/students/create', (req, res) => {
    (async () => {
        await db.collection('students').doc(req.body.id)
            .create(
                {
                    college_id: req.body.college_id,
                    name: req.body.name,
                    first_last_name: req.body.first_last_name,
                    second_last_name: req.body.second_last_name,
                    start_date: req.body.start_date
                }
            )
            .then(() => res.status(200).send({ message: 'Student created' }))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/students/read/:student_id', (req, res) => {
    (async () => {
        const document = db.collection('students').doc(req.params.student_id);
        await document.get()
            .then((querySnapshot) => res.status(200).send(querySnapshot.data()))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/students/read', (req, res) => {
    (async () => {
        const collection = db.collection('students');
        const response = [];
        await collection.get()
            .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    const data = {
                        id: doc.id,
                        ...doc.data()
                    }
                    response.push(data);
                })
                return Promise.resolve();
            })
            .then(() => res.status(200).send(response))
            .catch((error) => res.status(500).send(error))
    })();
});

router.put('/students/update/:student_id', (req, res) => {
    (async () => {
        const document = db.collection('students').doc(req.params.student_id);
        await document.update({
            college_id: req.body.college_id,
            name: req.body.name,
            first_last_name: req.body.first_last_name,
            second_last_name: req.body.second_last_name,
            start_date: req.body.start_date
        })
            .then(() => res.status(200).send({ message: 'Student updated' }))
            .catch((error) => res.status(500).send(error))
    })();
});

router.delete('/students/delete/:student_id', (req, res) => {
    (async () => {
        const document = db.collection('students').doc(req.params.student_id);
        await document.delete()
            .then(() => res.status(200).send({ message: 'Student deleted' }))
            .catch((error) => res.status(500).send(error))
    })();
});

module.exports = router;