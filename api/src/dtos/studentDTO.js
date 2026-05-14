const studentDTO = (student) => {

    return {
        id: student.id_estudiante,
        documento: student.documento,
        apellido: student.apellido,
        nombres: student.nombres,
        email: student.email,
        fecha_nacimiento: student.fecha_nacimiento,
        activo: student.activo
    };

};

module.exports = {
    studentDTO
};