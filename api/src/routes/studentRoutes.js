const express = require('express');

const router = express.Router();

const studentController = require('../controllers/studentController');

//GET de estudiante
router.get('/', studentController.getStudents);

//READ de estudiante
router.get('/:id', studentController.searchStudent);

//POST de estudiante
router.post('/', studentController.createStudent);

module.exports = router;