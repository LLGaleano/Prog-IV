const express = require('express');
const passport = require('passport');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { estudiantesFindAllTransform } = require('../transformations/studentTransformations');

const {
    createStudentValidation,
    updateStudentValidation
} = require('../validations/studentValidations');


// GET ALL
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    estudiantesFindAllTransform,
    studentController.getStudents
);

// Get by id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    studentController.searchStudent
);

// Post
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    createStudentValidation,
    studentController.createStudent
);

// Put
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    updateStudentValidation,
    studentController.modifyStudent
);

// Soft Delete 
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    studentController.deleteStudent
);

module.exports = router;