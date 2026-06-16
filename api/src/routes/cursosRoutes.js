const express = require('express');
const passport = require('passport');
const router = express.Router();

const cursoController = require('../controllers/cursosController');

const { cursosFindAllTransform } = require('../transformations/cursosTransformations');
const {
    createCursoValidation,
    updateCursoValidation
} = require('../validations/cursosValidations');

// GET ALL
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    cursosFindAllTransform,
    cursoController.getCursos
);

// Get by id
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    cursoController.searchCurso
);

// Post
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    createCursoValidation,
    cursoController.createCurso
);

// Put
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    updateCursoValidation,
    cursoController.modifyCurso
);

// Soft Delete 
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    cursoController.deleteCurso
);

module.exports = router;