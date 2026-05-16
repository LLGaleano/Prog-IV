const studentService = require('../services/studentService');
const val = require('../validations/studentValidations');
const { studentDTO } = require('../dtos/studentDTO');

const getStudents = async (req, res) => {

    try {

        const students = await studentService.getAllStudents();

        const studentsDTO = students.map(studentDTO);
        res.status(200).json(studentsDTO);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'No hay estudiantes'
        });

    }

};

const searchStudent = async (req, res) => {

    try {
        const  id  = req.params.id;
        const student = await studentService.searchStudentID(parseInt(id));

        res.status(200).json(studentDTO(student));

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
        
        const validationError =
        val.validateRequiredFields(studentData) ||
        val.validateEmail(studentData.email) ||
        val.validateDocumento(studentData.documento) ||
        val.validateFechaNac(studentData.fecha_nacimiento);

        if (validationError) {
            return res.status(400).json({
                error: validationError
            });
        }

        const existingDocumento = await studentService.searchStudentByDocumento(studentData.documento);

        if (existingDocumento) {
            return res.status(409).json({
                error: 'Ya hay un alumno con ese documento'
           });
        }
        
        const existingEmail = await studentService.searchStudentByEmail(studentData.email);

        if (existingEmail) {
            return res.status(409).json({
                error: 'Ya hay un alumno con ese email'
           });
        }

        const newStudent = await studentService.createStudent(studentData);

        res.status(201).json(studentDTO(newStudent));

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: 'Error creando estudiante'
        });

    }

};

const modifyStudent = async (req, res) => {
    
    try {
        
        const id = req.params.id;
        const student = await studentService.searchStudentID(id);

        if (!student) {
            return res.status(404).json({
                error: 'Estudiante no encontrado'
            });
        }

        const studentData = req.body;

        const validationError =
        val.validateRequiredFields(studentData) ||
        val.validateEmail(studentData.email) ||
        val.validateDocumento(studentData.documento) ||
        val.validateFechaNac(studentData.fecha_nacimiento);

        if (validationError) {
            return res.status(400).json({
                error: validationError
            });
        }

        
        const existingDocumento = await studentService.searchStudentByDocumento(studentData.documento);

        //Si el documento ya existe y no pertenece al estudiante que estamos modificando, tiramos error
        if (existingDocumento && existingDocumento.id_estudiante !== parseInt(id)) {
            return res.status(409).json({
                error: 'Ya hay un alumno con ese documento'
        });
        }
        
        const existingEmail = await studentService.searchStudentByEmail(studentData.email);

        //Si el email ya existe y no pertenece al estudiante que estamos modificando, tiramos error
        if (existingEmail && existingEmail.id_estudiante !== parseInt(id)) {
            return res.status(409).json({
                error: 'Ya hay un alumno con ese email'
        });
        }

        
        const modifiedStudent = await studentService.modifyStudent(id, studentData);
        res.status(200).json(studentDTO(modifiedStudent));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Error modificando estudiante'
        });
    }

};

const deleteStudent = async (req, res) => {

    try {

        const id = req.params.id;
        const student = await studentService.searchStudentID(id);

        if (!student) {
            return res.status(404).json({
                error: 'Estudiante no encontrado'
            });
        }

        const deletedStudent = await studentService.deleteStudent(id);
        res.status(200).json(studentDTO(deletedStudent));
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Error dando de baja estudiante'
        });
    }

}

module.exports = {
    getStudents,
    searchStudent,
    createStudent,
    modifyStudent,
    deleteStudent
};