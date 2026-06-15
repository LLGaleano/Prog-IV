const studentRepository = require('../db/studentRepository');

const getAllStudents = async (filter = {}, limit = 20, offset = 0, order = 'id_estudiante', asc = 'ASC') => {
    
    // Mandamos los filtros nativos de JS y las opciones de paginación puras al repositorio
    const { rows, total } = await studentRepository.getAllWithPagination(filter, limit, offset, order, asc);

    return {
        students: rows,
        total
    };
};

const searchStudentID = async (id) => {
    return await studentRepository.getById(id);
};

const searchStudentByDocumento = async (documento) => {
    return await studentRepository.getByDocumento(documento);
};

const searchStudentByEmail = async (email) => {
    return await studentRepository.getByEmail(email);
};

const createStudent = async (studentData) => {
    return await studentRepository.create(studentData);
};

const modifyStudent = async (id, studentData) => {
    return await studentRepository.modify(id, studentData);
};

const deleteStudent = async (id, id_usuario_modificacion) => {
    return await studentRepository.softDelete(id, id_usuario_modificacion);
};

module.exports = {
    getAllStudents,
    searchStudentID,
    searchStudentByDocumento,
    searchStudentByEmail,
    createStudent,
    modifyStudent,
    deleteStudent
};