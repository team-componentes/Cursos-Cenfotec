'use strict';

const express = require('express');
const functions = require('firebase-functions');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

router.get('/student_course/:student_id', (req, res) => {

    const response = {};
    (async () => {
        try {

            const studentReference = db.collection('users').doc(req.params.student_id);
            const studentSnapshot = await studentReference.get();

            const studentCourseReference = db.collection('student_course').doc(req.params.student_id);
            const studentCourseSnapshot = await studentCourseReference.get();

            if (studentSnapshot.exists) {
                response['student'] = studentSnapshot.data();

                if (!studentCourseSnapshot.exists) {
                    response['courses'] = [];
                    return res.status(200).send(response);
                }
            }
            else
                throw new Error("The student does exist");

            const promises = [];
            const coursesSnapshot = await studentCourseReference.collection('courses').get();

            coursesSnapshot.docs.forEach(course => {
                const courseReference = course.data().reference;
                const p = courseReference.get();
                promises.push(p);
            })

            const courses = [];
            const snapshots = await Promise.all(promises);
            snapshots.forEach((course, index) => {
                courses[index] = Object.assign({ id: course.id }, course.data());
            });
            response['courses'] = courses;
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
})

router.post('/student_course', (req, res) => {
    const userId = req.body.studentId;
    const courseId = req.body.courseId;


    (async () => {
        try {
            const courseStudentReference = db.collection('student_course').doc(userId);
            const courseStudentSnapshot = await courseStudentReference.get();

            const studentReference = db.collection('users').doc(userId);
            const studentSnapshot = await studentReference.get();

            const courseReference = db.doc(`courses/${courseId}`);
            const courseSnapshot = await courseReference.get();

            const studentData = { reference: studentReference };
            const courseData = { reference: db.doc(`courses/${courseId}`) };

            const promises = [];

            if (!courseStudentSnapshot.exists) {
                promises.push(await courseStudentReference.set(studentData));
            }

            if (!courseSnapshot.exists)
                throw new Error("The course does not exist");

            promises.push(await courseStudentReference.collection("courses").doc(courseId).set(courseData));
            await Promise.all(promises);
            return res.status(200).send({ message: "Register created" });

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
})

router.delete('/student_course', (req, res) => {
    const userId = req.body.studentId;
    const courseId = req.body.courseId;
    const courseStudentReference = db.collection('student_course').doc(userId);

    (async () => {
        try {

            const document = courseStudentReference.collection("courses").doc(courseId);
            await document.delete();
            return res.status(200).send({ message: 'Register deleted' })

        } catch (error) {
            return res.status(500).send({ message: error });
        }
    })();
});

module.exports = router;