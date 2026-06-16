
const cursosRepository = require('../db/cursosRepository');

const getAllCursos = async (filter = {}, limit = 20, offset = 0, order = 'id_curso', asc = 'ASC') => {
    const { rows, total } = await cursosRepository.getAllWithPagination(filter, limit, offset, order, asc);

    return {
        cursos: rows,
        total
    };
};

const searchCursoID = async (id) => {
    return await cursosRepository.getById(id);
};

const searchCursoByNombre = async (nombre) => {
    return await cursosRepository.getByNombre(nombre);
};

const createCurso = async (cursoData) => {
    return await cursosRepository.create(cursoData);
};

const modifyCurso = async (id, cursoData) => {
    return await cursosRepository.modify(id, cursoData);
};

const deleteCurso = async (id, id_usuario_modificacion) => {
    return await cursosRepository.softDelete(id, id_usuario_modificacion);
};

module.exports = {
    getAllCursos,
    searchCursoID,
    searchCursoByNombre,
    createCurso,
    modifyCurso,
    deleteCurso
};