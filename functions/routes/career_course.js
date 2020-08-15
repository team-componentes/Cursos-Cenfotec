'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/career_course/:career_id', (req, res) => {
    const reference = db.collection('career_course').doc(req.params.career_id);
    const response = {};
    (async () => {
        try {
            const snapshot = await reference.get();
            const careerReference = snapshot.data().reference;

            const careerSnapshot = await careerReference.get();
            response['career'] = careerSnapshot.data();

            const promises = [];
            const coursesSnapshot = await reference.collection('courses').get();

            coursesSnapshot.docs.forEach(course => {
                const courseReference = course.data().reference;
                const p = courseReference.get();
                promises.push(p);
            })

            const courses = [];
            const snapshots = await Promise.all(promises);
            snapshots.forEach((course,index) => {
                courses[index] = course.data();
            })
            response['courses'] = courses;
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send({ message: error});
        }
    })();
})

router.post('/career_course', (req, res) =>{
    const careerId = req.body.careerId;
    const courseId = req.body.courseId;
    const careerCourseReference = db.collection('career_course').doc(careerId);

    (async ()=>{
        try{
            const careerSnapshot = await careerCourseReference.get();
           
            const careerData = {reference: db.doc(`careers/${careerId}`)};
            const courseData = {reference: db.doc(`courses/${courseId}`)};

            const promises = [];

            if(!careerSnapshot.exists){   
                promises.push(await careerCourseReference.set(careerData));
            }

            promises.push(await careerCourseReference.collection("courses").doc(courseId).set(courseData));
            await Promise.all(promises);
            return res.status(200).send({ message: "Register created"});

        }catch(error){
            return res.status(500).send({ message: error});
        }
    })();
})

router.delete('/career_course', (req, res) =>{
    const careerId = req.body.careerId;
    const courseId = req.body.courseId;
    const careerCourseReference = db.collection('career_course').doc(careerId);

    (async () => {
        try{

            const document = careerCourseReference.collection("courses").doc(courseId);
            await document.delete();
            return res.status(200).send({ message: 'Register deleted' })

        }catch(error){
            return res.status(500).send({ message: error});
        }
    })();
});

module.exports = router;