const studentService = require('../services/studentService');

const getStudents = async (req, res) => {

    try {

        const students = await studentService.getAllStudents();

        res.json(students);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'No hay estudiantes'
        });

    }

};

const searchStudent = async (req, res) => {

    try {
        const { id } = req.params;
        const student = await studentService.searchStudentID(parseInt(id));

        res.json(student);

    } catch (error) { 

        console.log(error);

        res.status(500).json({
            error: 'No se encontro el estudiante'
        });

    }
};

const createStudent = async (req, res) => {
    try {

        const studentData = req.body;
        
        const {
            documento,
            apellido,
            nombres,
            email,
            fecha_nacimiento,
            activo
        } = studentData;

        if (
            !documento ||
            !apellido ||
            !nombres ||
            !email ||
            !fecha_nacimiento ||
            activo === undefined
        ) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios'
            });
        }

        const newStudent = await studentService.createStudent(studentData);

        res.status(201).json(newStudent);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'Error creando estudiante'
        });

    }

};

module.exports = {
    getStudents,
    searchStudent,
    createStudent,
};