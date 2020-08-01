'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/careers', (req, res) => {
    (async () => {

        await db.collection('careers').doc(req.body.id)
            .create({ name: req.body.name })
            .then(() => res.status(200).send({ message: 'Career created' }))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/careers/:id', (req, res) => {
    (async () => {
        const document = db.collection('careers').doc(req.body.id);
        await document.get()
            .then((querySnapshot) => res.status(200).send(querySnapshot.data()))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/careers', (req, res) => {
    (async () => {
        const collection = db.collection('careers');
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

router.put('/careers', (req, res) => {
    (async () => {
        const document = db.collection('careers').doc(req.body.id);
        await document.update({
            name: req.body.name
        })
            .then(() => res.status(200).send({ message: 'Career updated' }))
            .catch((error) => res.status(500).send(error))
    })();
});


router.delete('/careers', (req, res) => {
    (async () => {
        const document = db.collection('careers').doc(req.body.id);
        await document.delete()
            .then(() => res.status(200).send({ message: 'Career deleted' }))
            .catch((error) => res.status(500).send(error))
    })();
});

module.exports = router;

