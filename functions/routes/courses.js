'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/courses/create', (req, res) => {
    (async () => {
        try {
            await db.collection('courses').doc('/' + req.body.code + '/')
                .create(
                    {
                        name: req.body.name,
                        credits: req.body.credits,
                        cost: req.body.cost
                    }
                );
            return res.status(200).send({ message: 'Course created' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

router.get('/courses/read/:course_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('courses').doc(req.params.course_id);
            const course = await document.get();
            const response = course.data();
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

router.get('/courses/read', (req, res) => {
    (async () => {
        try {
            const collection = db.collection('courses');
            const response = [];
            await collection.get().then(querySnapshot => {
                const docs = querySnapshot.docs;
                for (let doc of docs) {
                    const newCourse = {
                        id: doc.id,
                        code: doc.data().code,
                        name: doc.data().name,
                        credits: doc.data().credits,
                        cost: doc.data().cost
                    };
                    response.push(newCourse);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

router.put('/courses/update/:course_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('courses').doc(req.params.course_id);
            await document.update({
                name: req.body.name,
                credits: req.body.credits,
                cost: req.body.cost
            });
            return res.status(200).send({ message: 'Course updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// delete
router.delete('/courses/delete/:course_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('courses').doc(req.params.course_id);
            await document.delete();
            return res.status(200).send({ message: 'Course deleted' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

module.exports = router;

