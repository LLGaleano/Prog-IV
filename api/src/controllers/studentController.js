const { validationResult } = require('express-validator'); // Control de sintaxis
const studentService = require('../services/studentService'); // Capa de acceso/negocio 
const { studentDTO } = require('../dtos/studentDTO'); 

// GET ALL
const getStudents = async (req, res) => {
    try {
        const searchFilter = req.studentFilter || {}; 
        
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        
        const offset = (page - 1) * limit;

        const orderField = req.query.orderField || 'id_estudiante';
        const orderDirection = req.query.orderDirection || 'ASC';

        const result = await studentService.getAllStudents(
            searchFilter,
            limit,
            offset,
            orderField,
            orderDirection
        );

        const studentsDTO = result.students.map(studentDTO);
        
        const totalRows = Number(result.total) || 0;
        const totalPages = Math.ceil(totalRows / limit) || 1;

        res.status(200).json({
            data: studentsDTO,
            page: page, // Devolvemos la página actual real
            limit: limit,
            total: totalRows,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al recuperar la colección de estudiantes.' });
    }
};

// GET by id
const searchStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentService.searchStudentID(parseInt(id));

        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        }

        res.status(200).json(studentDTO(student));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al buscar el estudiante.' });
    }
};

// POST de estudiante
const createStudent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const studentData = req.body;

        const existingDocumento = await studentService.searchStudentByDocumento(studentData.documento);
        if (existingDocumento) {
            return res.status(409).json({ error: 'Ya existe un alumno registrado con ese documento.' });
        }
        
        const existingEmail = await studentService.searchStudentByEmail(studentData.email);
        if (existingEmail) {
            return res.status(409).json({ error: 'Ya existe un alumno registrado con ese email.' });
        }

        // Auditoría dinámica basada en el Token JWT
        studentData.id_usuario_modificacion = req.user ? req.user.id_usuario : 1; 

        const newStudent = await studentService.createStudent(studentData);
        res.status(201).json(studentDTO(newStudent)); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al crear el estudiante.' });
    }
};

// PUT de estudiante
const modifyStudent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const student = await studentService.searchStudentID(id);

        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        }

        const studentData = req.body;

        const existingDocumento = await studentService.searchStudentByDocumento(studentData.documento);
        if (existingDocumento && existingDocumento.id_estudiante !== parseInt(id)) {
            return res.status(409).json({ error: 'El documento ingresado ya pertenece a otro estudiante.' });
        }
        
        const existingEmail = await studentService.searchStudentByEmail(studentData.email);
        if (existingEmail && existingEmail.id_estudiante !== parseInt(id)) {
            return res.status(409).json({ error: 'El email ingresado ya pertenece a otro estudiante.' });
        }

        studentData.id_usuario_modificacion = req.user ? req.user.id_usuario : 1;

        const modifiedStudent = await studentService.modifyStudent(id, studentData);
        res.status(200).json(studentDTO(modifiedStudent));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al modificar el estudiante.' });
    }
};

// Soft Delete de estudiante cambiando 'activo' a 0.
 
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentService.searchStudentID(id);

        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        }

        const userIdModif = req.user ? req.user.id_usuario : 1;

        const deletedStudent = await studentService.deleteStudent(id, userIdModif);
        res.status(200).json(studentDTO(deletedStudent));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al dar de baja al estudiante.' });
    }
};

module.exports = {
    getStudents,
    searchStudent,
    createStudent,
    modifyStudent,
    deleteStudent
};