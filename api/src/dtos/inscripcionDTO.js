const inscripcionDTO = (inscripcion) => {
    if (!inscripcion) return null;

    return {
        idInscripcion: inscripcion.id_inscripcion,
        idCurso: inscripcion.id_curso,
        cursoNombre: inscripcion.curso_nombre,
        idEstudiante: inscripcion.id_estudiante,
        estudianteDocumento: inscripcion.estudiante_documento,
        estudianteApellido: inscripcion.estudiante_apellido,
        estudianteNombres: inscripcion.estudiante_nombres,
        fechaHoraInscripcion: inscripcion.fecha_hora_inscripcion ? new Date(inscripcion.fecha_hora_inscripcion).toLocaleDateString('es-AR') : null,
        idInscripcionEstado: inscripcion.id_inscripcion_estado,
        estadoDescripcion: inscripcion.estado_descripcion,
        idUsuarioModificacion: inscripcion.id_usuario_modificacion,
        usuarioModificacionNombre: inscripcion.usuario_modificacion_nombre || 'Sistema',
        fechaHoraModificacion: inscripcion.fecha_hora_modificacion
    };
};

module.exports = {
    inscripcionDTO
};
