const { body, validationResult } = require('express-validator');

/**
 * Middleware intermedio encargado de evaluar si los validadores encadenados acumularon errores.
 * Si encuentra fallas frena el pipeline, de lo contrario delega el flujo al controlador.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    // Si la lista de errores no está vacía, cortamos la petición enviando un 400 Bad Request
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    // Si no hay errores, llamamos a next() para pasar al controlador 
    next();
};

// Conjunto de reglas comunes aplicadas de manera idéntica tanto al dar de Alta como al Editar un Estudiante.
 
const commonValidations = [
    // Validación del documento 
    body('documento')
        .notEmpty().withMessage('Documento obligatorio')
        .isLength({ min: 7, max: 20 }).withMessage('El documento debe tener entre 7 y 20 caracteres')
        .isAlphanumeric(undefined, { ignore: ' .-' }).withMessage('El documento contiene caracteres inválidos (solo números, letras, puntos o guiones)'),

    // Validación de cadenas de texto obligatorias aplicando .trim() para limpiar espacios vacíos 
    body('apellido')
        .notEmpty().withMessage('Apellido obligatorio')
        .trim()
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres soportados'),

    body('nombres')
        .notEmpty().withMessage('Nombres obligatorios')
        .trim()
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres soportados'),

    // Validación semántica de correo estructural
    body('email')
        .notEmpty().withMessage('Email obligatorio')
        .isEmail().withMessage('El formato de Email ingresado es inválido')
        .trim()
        .isLength({ max: 255 }).withMessage('Máximo 255 caracteres soportados'),

    // Validación estricta del formato de fecha (AAAA-MM-DD)
    body('fecha_nacimiento')
        .notEmpty().withMessage('Fecha de nacimiento obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (Debe cumplimentar AAAA-MM-DD)')
        .custom(value => {
            // La fecha de nacimiento no puede ser mayor al día de hoy
            if (new Date(value) > new Date()) {
                throw new Error('La fecha de nacimiento no puede ser una fecha futura');
            }
            return true;
        }),

    // Validación de tipos lógicos para el soft delete en base a tipos SMALLINT de Postgres
    body('activo')
        .notEmpty().withMessage('El estado activo/inactivo es obligatorio')
        .isIn([0, 1]).withMessage('El campo activo debe configurarse estrictamente en 0 (Inactivo) o 1 (Activo)')
];

// Exportamos los arrays empaquetando las reglas junto al middleware verificador final
const createStudentValidation = [...commonValidations, validate];
const updateStudentValidation = [...commonValidations, validate];

module.exports = {
    createStudentValidation,
    updateStudentValidation
};
