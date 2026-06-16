const cursosDTO = (curso) => {
    if (!curso) return null;

    return {
        idCurso: curso.id_curso,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        fechaInicio: curso.fecha_inicio,
        cantidadHoras: curso.cantidad_horas,
        inscriptosMax: curso.inscriptos_max,
        idCursoEstado: curso.id_curso_estado, 
        estadoCurso: curso.estado_curso,      
        idUsuarioModificacion: curso.id_usuario_modificacion,
        fechaHoraModificacion: curso.fecha_hora_modificacion
    };
};

module.exports = {
    cursosDTO
};