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
            .catch((error) => res.status(500).send({ message: error }))
    })();
});

router.get('/users/:user_id', (req, res) => {
    (async () => {
        const document = db.collection('users').doc(req.params.user_id);
        await document.get()
            .then((querySnapshot) => res.status(200).send(querySnapshot.data()))
            .catch((error) => res.status(500).send({ message: error }))
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
            .catch((error) => res.status(500).send({ message: error }))
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
            .catch((error) => res.status(500).send({ message: error }))
    })();
});

router.delete('/users', (req, res) => {
    (async () => {
        const document = db.collection('users').doc(req.body.id);
        await document.delete()
            .then(() => res.status(200).send({ message: 'User deleted' }))
            .catch((error) => res.status(500).send({ message: error }))
    })();
});

router.post('/signup', async (req, res) => {
    //any verifications you would like to do
    await admin.auth().createUser({ //Create user in authentication section of firebase
        email: req.body.email, //user email from request body
        emailVerified: true, //user email from request body
        displayName: req.body.name + " " + req.body.first_last_name, //user name from request body
        disabled: false
    })
        .then(function (userRecord) {
            console.log("Successfully created new user:", userRecord.uid);
            //add data to database
            var data = {
                name: req.body.name,
                first_last_name: req.body.first_last_name,
                second_last_name: req.body.second_last_name,
                user_type: req.body.user_type,
                email: req.body.email,
                uid: userRecord.uid
            };
            (async () => {
                await db.collection('users').doc(req.body.id)
                .create(data)
                    .then(() => {
                        if (data.user_type == "Student") {
                            (async () => {
                                console.log(req.body.id);
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
                        }
                        else {
                            return res.status(200).send({ message: 'User created' });
                        }
                    })
                    .catch((error) => res.status(500).send({ message: error }))
            })();
            return res.status(200).send(Success());
        })
        .catch(function (error) {
            console.log("Error creating new user:", error);
        });
});

router.get('/users/email/:email', (req, res) => {
    (async () => {
        const usersRef = db.collection('users');
        await usersRef.where('email', '==', req.params.email).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log('No matching documents.');
                    return res.status(500).send({ message: "Not matching" });
                }
                var data = [];
                querySnapshot.forEach(doc => {
                    data.push(Object.assign({ id: doc.id }, doc.data()));
                });
                res.status(200).send(data);
            })
            .catch((error) => res.status(500).send({ message: error }));
    })();
});

module.exports = router;