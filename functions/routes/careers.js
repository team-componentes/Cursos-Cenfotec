'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

/*
Create career
*/

router.post('/careers/create', (req, res) =>{
    (async ()=>{
        try{
            await db.collection('careers').doc('/' + req.body.code + '/')
            .create({ name: req.body.name});
            return res.status(200).send({message: 'Item created'});
        }catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

router.get('careers/read/:career_code', (req,res)=>{
    (async () =>{
        try{
            const document = db.collection('careers').doc(req.params.career_code);
            const career = await document.get();
            const response = career.data();
            return res.status(200).send(response);
        }catch(error){
            return res.status(500).send(error);
        }
    })();
});

router.get('careers/read', (req,res) =>{
    (async () => {
        try{
            const collection = db.collection('careers');
            const response = [];
            await collection.get().then(querySnapshot =>{
                const docs = querySnapshot.docs;
                for(let doc of docs){
                    const newCareer = {
                        id: doc.id,
                        code: doc.data().code,
                        name: doc.data().name
                    };
                    response.push(newCareer);
                }
                return response;
            });
            return res.status(200).send(response);
        }catch(error){
            return res.status(500).send(error);
        }
    })();
});

router.put('careers/update/:career_code', (req, res) => {
    (async () => {
        try {
            const document = db.collection('careers').doc(req.params.career_code);
            await document.update({
                name: req.body.name
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// delete
router.delete('/delete/:career_code', (req, res) => {
    (async () => {
        try {
            const document = db.collection('careers').doc(req.params.career_code);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

module.exports = router;

