const pool = require('./connection');

const getAll = async (filter = {}, limit = 20, offset = 0, order = 'id_inscripcion', asc = 'ASC') => {
    let whereClause = '';
    const values = [];

    if (filter.idInscripcionEstado) {
        values.push(filter.idInscripcionEstado);
        whereClause = ` WHERE i.id_inscripcion_estado = $${values.length} `;
    } else {
        whereClause = ` WHERE i.id_inscripcion_estado = 1 `;
    }

    if (filter.idCurso) {
        values.push(filter.idCurso);
        whereClause += ` AND i.id_curso = $${values.length}`;
    }

    if (filter.idEstudiante) {
        values.push(filter.idEstudiante);
        whereClause += ` AND i.id_estudiante = $${values.length}`;
    }

    if (filter.documentoEstudiante) {
        values.push(`%${filter.documentoEstudiante}%`);
        whereClause += ` AND e.documento ILIKE $${values.length}`;
    }

    // Conteo Total
    const countQuery = `
        SELECT COUNT(*) AS total 
        FROM inscripciones i
        INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        INNER JOIN cursos c ON i.id_curso = c.id_curso
        ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total) || 0;

    // Mapeo de campos de ordenamiento
    const orderMapping = {
        'id_inscripcion': 'i.id_inscripcion',
        'id_curso': 'i.id_curso',
        'id_estudiante': 'i.id_estudiante',
        'fecha_hora_inscripcion': 'i.fecha_hora_inscripcion',
        'id_inscripcion_estado': 'i.id_inscripcion_estado'
    };
    const dbOrderField = orderMapping[order] || 'i.id_inscripcion';

    // Query de Datos
    let query = `
        SELECT i.*, c.nombre as curso_nombre, ie.descripcion as estado_descripcion,
               e.documento as estudiante_documento, e.apellido as estudiante_apellido, e.nombres as estudiante_nombres
        FROM inscripciones i
        JOIN cursos c ON i.id_curso = c.id_curso
        JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        JOIN inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
        ${whereClause}
        ORDER BY ${dbOrderField} ${asc}
    `;

    const queryValues = [...values];
    queryValues.push(limit);
    query += ` LIMIT $${queryValues.length}`;

    queryValues.push(offset);
    query += ` OFFSET $${queryValues.length}`;

    const result = await pool.query(query, queryValues);

    return {
        inscripciones: result.rows,
        total
    };
};

const getById = async (id) => {
    const result = await pool.query(`
        SELECT i.*, c.nombre as curso_nombre, ie.descripcion as estado_descripcion,
               e.documento as estudiante_documento, e.apellido as estudiante_apellido, e.nombres as estudiante_nombres
        FROM inscripciones i
        JOIN cursos c ON i.id_curso = c.id_curso
        JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
        JOIN inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
        WHERE i.id_inscripcion = $1
    `, [id]);
    return result.rows[0];
};

const checkDuplicada = async (idCurso, idEstudiante) => {
    const result = await pool.query(`
        SELECT * FROM inscripciones
        WHERE id_curso = $1 AND id_estudiante = $2 AND id_inscripcion_estado = 1
    `, [idCurso, idEstudiante]);
    return result.rows[0];
};

const getCursoInfo = async (idCurso) => {
    const result = await pool.query(`
        SELECT id_curso, nombre, inscriptos_max, id_curso_estado
        FROM cursos
        WHERE id_curso = $1
    `, [idCurso]);
    return result.rows[0];
};

const getEstudianteInfo = async (idEstudiante) => {
    const result = await pool.query(`
        SELECT id_estudiante, activo
        FROM estudiantes
        WHERE id_estudiante = $1
    `, [idEstudiante]);
    return result.rows[0];
};

const countInscriptosCurso = async (idCurso) => {
    const result = await pool.query(`
        SELECT COUNT(*) as count 
        FROM inscripciones
        WHERE id_curso = $1 AND id_inscripcion_estado = 1
    `, [idCurso]);
    return parseInt(result.rows[0].count) || 0;
};

const create = async (inscripcionData) => {
    const { id_curso, id_estudiante, id_usuario_modificacion } = inscripcionData;
    const result = await pool.query(`
        INSERT INTO inscripciones 
        (id_curso, id_estudiante, fecha_hora_inscripcion, id_inscripcion_estado, id_usuario_modificacion, fecha_hora_modificacion)
        VALUES ($1, $2, NOW(), 1, $3, NOW())
        RETURNING id_inscripcion
    `, [id_curso, id_estudiante, id_usuario_modificacion]);
    return result.rows[0].id_inscripcion;
};

const updateEstado = async (id, id_usuario_modificacion) => {
    await pool.query(`
        UPDATE inscripciones
        SET id_inscripcion_estado = 2,
            id_usuario_modificacion = $1,
            fecha_hora_modificacion = NOW()
        WHERE id_inscripcion = $2
    `, [id_usuario_modificacion, id]);
};

module.exports = {
    getAll,
    getById,
    checkDuplicada,
    getCursoInfo,
    getEstudianteInfo,
    countInscriptosCurso,
    create,
    updateEstado
};