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

const createInscripcionValidation = [
    body('id_curso')
        .notEmpty().withMessage('El ID del curso es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID del curso debe ser un número entero positivo'),

    body('id_estudiante')
        .notEmpty().withMessage('El ID del estudiante es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID del estudiante debe ser un número entero positivo'),

    validate
];

module.exports = {
    createInscripcionValidation
};
