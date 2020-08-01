'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/users', (req, res) => {
    (async () => {
        await db.collection('users').doc(req.body.id)
            .create(
                {
                    name: req.body.name,
                    first_last_name: req.body.first_last_name,
                    second_last_name: req.body.second_last_name,
                    user_type: req.body.user_type,
                    email: req.body.email
                }
            )
            .then(() => res.status(200).send({ message: 'User created' }))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/users/:user_id', (req, res) => {
    (async () => {
        const document = db.collection('users').doc(req.params.user_id);
        await document.get()
            .then((querySnapshot) => res.status(200).send(querySnapshot.data()))
            .catch((error) => res.status(500).send(error))
    })();
});

router.get('/users', (req, res) => {
    (async () => {
        const collection = db.collection('users');
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

router.put('/users', (req, res) => {
    (async () => {
        const document = db.collection('users').doc(req.body.id);
        await document.update({
            name: req.body.name,
            first_last_name: req.body.first_last_name,
            second_last_name: req.body.second_last_name,
            user_type: req.body.user_type,
            email: req.body.email
        })
            .then(() => res.status(200).send({ message: 'User updated' }))
            .catch((error) => res.status(500).send(error))
    })();
});

router.delete('/users', (req, res) => {
    (async () => {
        const document = db.collection('users').doc(req.body.id);
        await document.delete()
            .then(() => res.status(200).send({ message: 'User deleted' }))
            .catch((error) => res.status(500).send(error))
    })();
});

module.exports = router;