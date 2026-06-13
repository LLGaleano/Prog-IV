const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const { inscripcionesFindAllTransform } = require('../transformations/inscripcionTransformations');

const {
    createInscripcionValidation
} = require('../validations/inscripcionValidations');

// GET ALL 
router.get('/', inscripcionesFindAllTransform, inscripcionController.getInscripciones);

// GET BY ID 
router.get('/:id', inscripcionController.searchInscripcion);

// POST 
router.post('/', createInscripcionValidation, inscripcionController.createInscripcion);

// DELETE 
router.delete('/:id', inscripcionController.deleteInscripcion);

module.exports = router;
