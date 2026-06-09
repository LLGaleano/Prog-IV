const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();

};

const createStudentValidation = [

    body('documento')
        .notEmpty().withMessage('Documento obligatorio')
        .isLength({ min: 7, max: 8 }).withMessage('El documento debe tener 7 u 8 digitos')
        .isNumeric().withMessage('El documento debe contener solo numeros'),

    body('apellido')
        .notEmpty().withMessage('Apellido obligatorio'),

    body('nombres')
        .notEmpty().withMessage('Nombres obligatorios'),

    body('email')
        .notEmpty().withMessage('Email obligatorio')
        .isEmail().withMessage('Email invalido'),

    body('fecha_nacimiento')
        .notEmpty().withMessage('Fecha de nacimiento obligatoria')
        .isDate().withMessage('Fecha invalida')
        .custom(value => {

            if (new Date(value) > new Date()) {
                throw new Error('La fecha de nacimiento no puede ser futura');
            }

            return true;

        }),

    body('activo')
        .notEmpty().withMessage('Activo obligatorio')
        .isIn([0, 1]).withMessage('Activo debe ser 0 o 1'),

    validate

];

const updateStudentValidation = [

    body('documento')
        .notEmpty().withMessage('Documento obligatorio')
        .isLength({ min: 7, max: 8 }).withMessage('El documento debe tener 7 u 8 digitos')
        .isNumeric().withMessage('El documento debe contener solo numeros'),

    body('apellido')
        .notEmpty().withMessage('Apellido obligatorio'),

    body('nombres')
        .notEmpty().withMessage('Nombres obligatorios'),

    body('email')
        .notEmpty().withMessage('Email obligatorio')
        .isEmail().withMessage('Email invalido'),

    body('fecha_nacimiento')
        .notEmpty().withMessage('Fecha de nacimiento obligatoria')
        .isDate().withMessage('Fecha invalida')
        .custom(value => {

            if (new Date(value) > new Date()) {
                throw new Error('La fecha de nacimiento no puede ser futura');
            }

            return true;

        }),

    body('activo')
        .notEmpty().withMessage('Activo obligatorio')
        .isIn([0, 1]).withMessage('Activo debe ser 0 o 1'),

    validate

];

module.exports = {
    createStudentValidation,
    updateStudentValidation
};


