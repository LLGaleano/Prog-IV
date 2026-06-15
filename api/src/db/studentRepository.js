const pool = require('./connection');

const getAllWithPagination = async (filter, limit, offset, order, asc) => {
    let whereClause = ` WHERE activo = 1 `;
    const values = [];

    // El repositorio se encarga de traducir los datos de JS a sintaxis SQL
    if (filter.apellido) {
        values.push(`%${filter.apellido}%`);
        whereClause += ` AND apellido ILIKE $${values.length}`; 
    }
    if (filter.documento) {
        values.push(`%${filter.documento}%`);
        whereClause += ` AND documento ILIKE $${values.length}`;
    }
    if (filter.nombres) {
        values.push(`%${filter.nombres}%`);
        whereClause += ` AND nombres ILIKE $${values.length}`;
    }
    if (filter.email) {
        values.push(`%${filter.email}%`);
        whereClause += ` AND email ILIKE $${values.length}`;
    }

    // 1. Ejecutar conteo total
    const countQuery = `SELECT COUNT(*) AS total FROM estudiantes ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total) || 0;

    // 2. Construir query de datos armada
    let query = `
        SELECT id_estudiante, documento, apellido, nombres, email, 
               TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') as fecha_nacimiento, 
               activo
        FROM estudiantes
        ${whereClause}
        ORDER BY ${order} ${asc}
    `;

    const queryValues = [...values];
    queryValues.push(limit);
    query += ` LIMIT $${queryValues.length}`;
    
    queryValues.push(offset);
    query += ` OFFSET $${queryValues.length}`;

    const result = await pool.query(query, queryValues);

    return {
        rows: result.rows,
        total
    };
};

const countAll = async (whereClause, values) => {
    const countQuery = `SELECT COUNT(*) AS total FROM estudiantes ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    return parseInt(countResult.rows[0].total) || 0;
};

const getById = async (id) => {
    const result = await pool.query(`
        SELECT id_estudiante, documento, apellido, nombres, email, 
               TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') as fecha_nacimiento, 
               activo
        FROM estudiantes
        WHERE id_estudiante = $1
    `, [id]);
    return result.rows[0];
};

const getByDocumento = async (documento) => {
    const result = await pool.query(
        `SELECT * FROM estudiantes WHERE documento = $1`,
        [documento]
    );
    return result.rows[0];
};

const getByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM estudiantes WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

const create = async (studentData) => {
    const { documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion } = studentData;
    const result = await pool.query(
        `INSERT INTO estudiantes
        (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`,
        [documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion]
    );
    return result.rows[0];
};

const modify = async (id, studentData) => {
    const { documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion } = studentData;
    const result = await pool.query(
        `UPDATE estudiantes
        SET documento = $1, apellido = $2, nombres = $3, email = $4, 
            fecha_nacimiento = $5, activo = $6, id_usuario_modificacion = $7, 
            fecha_hora_modificacion = NOW()
        WHERE id_estudiante = $8
        RETURNING *`,
        [documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, id]
    );
    return result.rows[0];
};

const softDelete = async (id, id_usuario_modificacion) => {
    const result = await pool.query(`
        UPDATE estudiantes
        SET activo = 0, 
            id_usuario_modificacion = $1, 
            fecha_hora_modificacion = NOW()
        WHERE id_estudiante = $2
        RETURNING *
    `, [id_usuario_modificacion, id]);
    return result.rows[0];
};

module.exports = {
    getAllWithPagination,
    countAll,
    getById,
    getByDocumento,
    getByEmail,
    create,
    modify,
    softDelete
};