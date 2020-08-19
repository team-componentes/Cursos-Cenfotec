'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/student_career/:student_id', (req, res) => {
    const reference = db.collection('student_career').doc(req.params.student_id);
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
            snapshots.forEach((career, index) => {
                careers[index] = Object.assign({ id: career.id }, career.data());
            })
            response['careers'] = careers;
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
});

router.post('/student_career', (req, res) => {
    const userId = req.body.studentId;
    const careerId = req.body.careerId;
    const careerStudentReference = db.collection('student_career').doc(userId);

    (async () => {
        try {
            const studentSnapshot = await careerStudentReference.get();

            const studentData = { reference: db.doc(`students/${userId}`) };
            const careerData = { reference: db.doc(`careers/${careerId}`) };

            const promises = [];

            if (!studentSnapshot.exists) {
                promises.push(await careerStudentReference.set(studentData));
            }

            promises.push(await careerStudentReference.collection("careers").doc(careerId).set(careerData));
            await Promise.all(promises);
            return res.status(200).send({ message: "Register created" });

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
})

router.delete('/student_career', (req, res) => {
    const userId = req.body.studentId;
    const careerId = req.body.careerId;
    const careerStudentReference = db.collection('student_career').doc(userId);

    (async () => {
        try {

            const document = careerStudentReference.collection("careers").doc(careerId);
            await document.delete();
            return res.status(200).send({ message: 'Register deleted' })

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
});

router.get('/student_career/complete/:student_id', (req, res) => {
    const reference = db.collection('student_career').doc(req.params.student_id);
    const response = {};
    (async () => {
        try {
            const snapshot = await reference.get();
            const studentReference = snapshot.data().reference;

            const studentSnapshot = await studentReference.get();
            response['student'] = studentSnapshot.data();
            const careersSnapshot = await reference.collection('careers').get();
            const careerCoursePromises = [];

            const careersCompleted = await Promise.all(
                careersSnapshot.docs.map(async career => {
                    const careerReference = career.data().reference;
                    const careerSnapshot = await careerReference.get();

                    const careerCourseReference = db.collection('career_course').doc(career.id);
                    const careerCourseSnapshot = careerCourseReference.collection('courses').get();
                    careerCoursePromises.push(careerCourseSnapshot);

                    return { id: careerSnapshot.id, ...careerSnapshot.data() };
                }))

            const careerCourseSnapshots = await Promise.all(careerCoursePromises);

            const careerCourseCompleted = await Promise.all(careerCourseSnapshots.map(async (career, index) => {
                const coursesCompleted = career.docs.map(async (course, index) => {
                    const courseReference = course.data().reference;
                    const snapshot = await courseReference.get();
                    return snapshot;
                });
                return Promise.all(coursesCompleted);
            }));

            careersCompleted.forEach((career, index) => {
                career.courses = careerCourseCompleted[index].map(courseSnapshot => {
                    return { id: courseSnapshot.id, ...courseSnapshot.data() }
                })
            });

            response['careers'] = careersCompleted;
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
});

module.exports = router;