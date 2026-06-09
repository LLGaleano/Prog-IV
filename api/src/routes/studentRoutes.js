const express = require('express');

const router = express.Router();

const studentController = require('../controllers/studentController');

const {
    createStudentValidation,
    updateStudentValidation
} = require('../validations/studentValidations');

//GET de estudiantes
router.get('/', studentController.getStudents);

//GET de estudiante
router.get('/:id', studentController.searchStudent);

//POST de estudiante
router.post(
    '/',
    createStudentValidation,
    studentController.createStudent
);

//PUT de estudiante
router.put(
    '/:id', updateStudentValidation, studentController.modifyStudent
);

//SOFT DELETE de estudiante
router.delete('/:id', studentController.deleteStudent);



module.exports = router;