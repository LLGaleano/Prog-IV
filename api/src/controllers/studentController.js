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

        if (!student) {
            return res.status(404).json({
                mensaje: 'Estudiante no encontrado'
            });
        }

        res.json(student);

    } catch (error) { 

        console.log(error);

        res.status(500).json({
            error: 'No se encontro el estudiante'
        });

    }
}

module.exports = {
    getStudents,
    searchStudent
};