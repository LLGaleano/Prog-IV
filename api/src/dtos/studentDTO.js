const studentDTO = (student) => {
    if (!student) return null;

    return {
        idEstudiante: student.id_estudiante,
        documento: student.documento,
        apellido: student.apellido,
        nombres: student.nombres,
        email: student.email,
        fechaNacimiento: student.fecha_nacimiento,
        activo: student.activo,
        idUsuarioModificacion: student.id_usuario_modificacion,
        fechaHoraModificacion: student.fecha_hora_modificacion
    };
};

module.exports = {
    studentDTO
};