'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/students/create', (req, res) => {
    (async () => {
        try {
            await db.collection('students').doc('/' + req.body.id + '/')
                .create(
                    {
                        college_id: req.body.college_id,
                        name: req.body.name,
                        first_last_name: req.body.first_last_name,
                        second_last_name: req.body.second_last_name,
                        start_date: req.body.start_date
                    }
                );
            return res.status(200).send({ message: 'Student created' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

router.get('/students/read/:student_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('students').doc(req.params.student_id);
            const student = await document.get();
            const response = student.data();
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

router.get('/students/read', (req, res) => {
    (async () => {
        try {
            const collection = db.collection('students');
            const response = [];
            await collection.get().then(querySnapshot => {
                const docs = querySnapshot.docs;
                for (let doc of docs) {
                    const newStudent = {
                        id: doc.id,
                        college_id: doc.data().college_id,
                        name: doc.data().name,
                        first_last_name: doc.data().first_last_name,
                        second_last_name: doc.data().second_last_name,
                        start_date: doc.data().start_date
                    };
                    response.push(newStudent);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

router.put('/students/update/:student_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('students').doc(req.params.student_id);
            await document.update({
                college_id: req.body.college_id,
                name: req.body.name,
                first_last_name: req.body.first_last_name,
                second_last_name: req.body.second_last_name,
                start_date: req.body.start_date
            });
            return res.status(200).send({ message: 'Student updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

router.delete('/students/delete/:student_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('students').doc(req.params.student_id);
            await document.delete();
            return res.status(200).send({ message: 'Student deleted' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

module.exports = router;

