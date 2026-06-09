const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { estudiantesFindAllTransform } = require('../transformations/studentTransformations');

const {
    createStudentValidation,
    updateStudentValidation
} = require('../validations/studentValidations');


// GET ALL
router.get('/', estudiantesFindAllTransform, studentController.getStudents);

// Get by id
router.get('/:id', studentController.searchStudent);

// Post
router.post('/', createStudentValidation, studentController.createStudent);

// Put
router.put('/:id', updateStudentValidation, studentController.modifyStudent);

// Soft Delete 
router.delete('/:id', studentController.deleteStudent);

module.exports = router;