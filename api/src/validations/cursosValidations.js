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

const commonValidations = [
    body('nombre')
        .notEmpty().withMessage('El nombre del curso es obligatorio')
        .trim()
        .isLength({ max: 45 }).withMessage('El nombre no puede superar los 45 caracteres'),

    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .trim(),

    body('fecha_inicio')
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (Debe ser AAAA-MM-DD)'),

    body('cantidad_horas')
        .notEmpty().withMessage('La cantidad de horas es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad de horas debe ser un número entero mayor a 0'),

    body('inscriptos_max')
        .notEmpty().withMessage('El límite de inscriptos es obligatorio')
        .isInt({ min: 1 }).withMessage('El cupo máximo debe ser un número entero mayor a 0'),

    body('id_curso_estado')
        .notEmpty().withMessage('El estado del curso es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID del estado debe ser un número entero válido')
];

const createCursoValidation = [...commonValidations, validate];
const updateCursoValidation = [...commonValidations, validate];

module.exports = {
    createCursoValidation,
    updateCursoValidation
};