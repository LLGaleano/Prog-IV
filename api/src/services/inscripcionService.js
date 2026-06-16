const inscripcionRepository = require('../db/inscripcionesRepository');

const getAllInscripciones = async (filter = {}, limit = 20, offset = 0, order = 'id_inscripcion', asc = 'ASC') => {
    return await inscripcionRepository.getAll(filter, limit, offset, order, asc);
};

const searchInscripcionID = async (id) => {
    return await inscripcionRepository.getById(id);
};

const checkInscripcionDuplicada = async (idCurso, idEstudiante) => {
    return await inscripcionRepository.checkDuplicada(idCurso, idEstudiante);
};

const getCursoInfo = async (idCurso) => {
    return await inscripcionRepository.getCursoInfo(idCurso);
};

const getEstudianteInfo = async (idEstudiante) => {
    return await inscripcionRepository.getEstudianteInfo(idEstudiante);
};

const countInscriptosCurso = async (idCurso) => {
    return await inscripcionRepository.countInscriptosCurso(idCurso);
};

const createInscripcion = async (inscripcionData) => {
    const idInscripcion = await inscripcionRepository.create(inscripcionData);
    return await inscripcionRepository.getById(idInscripcion);
};

const deleteInscripcion = async (id, id_usuario_modificacion) => {
    await inscripcionRepository.updateEstado(id, id_usuario_modificacion);
    return await inscripcionRepository.getById(id);
};

const getCursos = async () => {
    return await inscripcionRepository.getCursos();
};

module.exports = {
    getAllInscripciones,
    searchInscripcionID,
    checkInscripcionDuplicada,
    getCursoInfo,
    getEstudianteInfo,
    countInscriptosCurso,
    createInscripcion,
    deleteInscripcion,
    getCursos
};