// Formatea los filtros de búsqueda de inscripciones
const inscripcionesFindAllTransform = (req, res, next) => {
    const filterObj = {};
    let orderField = 'id_inscripcion';
    let orderDirection = 'ASC';

    const { idCurso, idEstudiante, idInscripcionEstado, documentoEstudiante, order, asc } = req.query;

    if (idCurso && !isNaN(Number(idCurso))) {
        filterObj.idCurso = Number(idCurso);
    }
    if (idEstudiante && !isNaN(Number(idEstudiante))) {
        filterObj.idEstudiante = Number(idEstudiante);
    }
    if (idInscripcionEstado && !isNaN(Number(idInscripcionEstado))) {
        filterObj.idInscripcionEstado = Number(idInscripcionEstado);
    }
    if (documentoEstudiante && documentoEstudiante.trim() !== "") {
        filterObj.documentoEstudiante = documentoEstudiante.trim();
    }

    if (order) {
        const fieldMapping = {
            idInscripcion: 'id_inscripcion',
            idCurso: 'id_curso',
            idEstudiante: 'id_estudiante',
            fechaHoraInscripcion: 'fecha_hora_inscripcion',
            idInscripcionEstado: 'id_inscripcion_estado'
        };
        orderField = fieldMapping[order] || 'id_inscripcion';
        orderDirection = asc === "true" ? "ASC" : "DESC";
    }

    req.inscripcionFilter = filterObj;
    req.orderField = orderField;
    req.orderDirection = orderDirection;

    next();
};

module.exports = {
    inscripcionesFindAllTransform
};
