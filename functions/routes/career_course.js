'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/career_course/:career_id', async (req, res) => {
    var ids = req.params.career_id.split(',');
    var carrers = await Promise.all(ids.map(async (id) => {
        let reference = db.collection('career_course').doc(id);
        let response = {};
        try {
            let snapshot = await reference.get();
            let careerReference = snapshot.data().reference;

            let careerSnapshot = await careerReference.get();
            response['career'] = Object.assign({ id: careerSnapshot.id }, careerSnapshot.data());

            let promises = [];
            let coursesSnapshot = await reference.collection('courses').get();

            coursesSnapshot.docs.forEach(course => {
                let courseReference = course.data().reference;
                let p = courseReference.get();
                promises.push(p);
            })

            let courses = [];
            let snapshots = await Promise.all(promises);
            snapshots.forEach((course, index) => {
                courses[index] = Object.assign({ id: course.id }, course.data());
            })
            response['courses'] = courses;
            return response;
        }
        catch (error) {
            return res.status(500).send({ message: error });
        }
    }));
    return res.status(200).send(carrers);
})

router.post('/career_course', (req, res) => {
    const careerId = req.body.careerId;
    const courseId = req.body.courseId;
    const careerCourseReference = db.collection('career_course').doc(careerId);

    (async () => {
        try {
            const careerSnapshot = await careerCourseReference.get();

            const careerData = { reference: db.doc(`careers/${careerId}`) };
            const courseData = { reference: db.doc(`courses/${courseId}`) };

            const promises = [];

            if (!careerSnapshot.exists) {
                promises.push(await careerCourseReference.set(careerData));
            }

            promises.push(await careerCourseReference.collection("courses").doc(courseId).set(courseData));
            await Promise.all(promises);
            return res.status(200).send({ message: "Register created" });

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
})

router.delete('/career_course', (req, res) => {
    const careerId = req.body.careerId;
    const courseId = req.body.courseId;
    const careerCourseReference = db.collection('career_course').doc(careerId);

    (async () => {
        try {

            const document = careerCourseReference.collection("courses").doc(courseId);
            await document.delete();
            return res.status(200).send({ message: 'Register deleted' })

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
});

module.exports = router;