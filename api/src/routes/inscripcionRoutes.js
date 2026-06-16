const express = require('express');
const router = express.Router();
const passport = require('passport');

const inscripcionController = require('../controllers/inscripcionController');
const { inscripcionesFindAllTransform } = require('../transformations/inscripcionTransformations');

const {
createInscripcionValidation
} = require('../validations/inscripcionValidations');

// GET ALL
router.get(
'/',
passport.authenticate('jwt', { session: false }),
inscripcionesFindAllTransform,
inscripcionController.getInscripciones
);

// GET cursos
router.get(
    '/cursos',
    passport.authenticate('jwt', { session: false }),
    inscripcionController.getCursos
);

// GET BY ID
router.get(
'/:id',
passport.authenticate('jwt', { session: false }),
inscripcionController.searchInscripcion
);

// POST
router.post(
'/',
passport.authenticate('jwt', { session: false }),
createInscripcionValidation,
inscripcionController.createInscripcion
);

// DELETE
router.delete(
'/:id',
passport.authenticate('jwt', { session: false }),
inscripcionController.deleteInscripcion
);

module.exports = router;