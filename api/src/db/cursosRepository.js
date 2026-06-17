const pool = require('./connection');

const getAllWithPagination = async (filter, limit, offset, order, asc) => {
    let whereClause = ` WHERE c.id_curso_estado = 1 `;
    const values = [];

    if (filter.nombre) {
        values.push(`%${filter.nombre}%`);
        whereClause += ` AND c.nombre ILIKE $${values.length}`; 
    }
    if (filter.cantidad_horas) {
        values.push(filter.cantidad_horas);
        whereClause += ` AND c.cantidad_horas = $${values.length}`;
    }
    if (filter.id_curso_estado) {
        whereClause = whereClause.replace('c.id_curso_estado = 1', `c.id_curso_estado = $${values.length + 1}`);
        values.push(filter.id_curso_estado);
    }

    const countQuery = `SELECT COUNT(*) AS total FROM public.cursos c ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total) || 0;


    let query = `
        SELECT 
            c.id_curso, c.nombre, c.descripcion, 
            TO_CHAR(c.fecha_inicio, 'YYYY-MM-DD') as fecha_inicio, 
            c.cantidad_horas, c.inscriptos_max, 
            c.id_curso_estado, ce.descripcion as estado_curso,
            c.id_usuario_modificacion, c.fecha_hora_modificacion
        FROM public.cursos c
        JOIN public.cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
        ${whereClause}
        ORDER BY c.${order} ${asc}
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

const getById = async (id) => {
    const result = await pool.query(`
        SELECT 
            c.id_curso, c.nombre, c.descripcion, 
            TO_CHAR(c.fecha_inicio, 'YYYY-MM-DD') as fecha_inicio, 
            c.cantidad_horas, c.inscriptos_max, 
            c.id_curso_estado, ce.descripcion as estado_curso,
            c.id_usuario_modificacion, c.fecha_hora_modificacion
        FROM public.cursos c
        JOIN public.cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
        WHERE c.id_curso = $1
    `, [id]);
    return result.rows[0];
};

const getByNombre = async (nombre) => {
    const result = await pool.query(
        `SELECT * FROM public.cursos WHERE nombre = $1`,
        [nombre]
    );
    return result.rows[0];
};

const create = async (cursoData) => {
    console.log("DEBUG - Datos recibidos en Repository:", Object.keys(cursoData));
    console.log("DEBUG - Valores recibidos:", Object.values(cursoData));
    const result = await pool.query(
        `INSERT INTO cursos
        (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`,
        [
            cursoData.nombre, 
            cursoData.descripcion, 
            cursoData.fecha_inicio, 
            cursoData.cantidad_horas, 
            cursoData.inscriptos_max, 
            cursoData.id_curso_estado, 
            cursoData.id_usuario_modificacion 
        ]
    );
    return result.rows[0];
};

const modify = async (id, cursoData) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion } = cursoData;
    const result = await pool.query(
        `UPDATE public.cursos
        SET nombre = $1, descripcion = $2, fecha_inicio = $3, 
            cantidad_horas = $4, inscriptos_max = $5, id_curso_estado = $6, 
            id_usuario_modificacion = $7, fecha_hora_modificacion = NOW()
        WHERE id_curso = $8
        RETURNING *`,
        [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, id]
    );
    return result.rows[0];
};

const softDelete = async (id, id_usuario_modificacion) => {
    const estadoBorradoLogico = 2; 

    const result = await pool.query(`
        UPDATE public.cursos
        SET id_curso_estado = $1, 
            id_usuario_modificacion = $2, 
            fecha_hora_modificacion = NOW()
        WHERE id_curso = $3
        RETURNING *
    `, [estadoBorradoLogico, id_usuario_modificacion, id]);
    return result.rows[0];
};

module.exports = {
    getAllWithPagination,
    getById,
    getByNombre,
    create,
    modify,
    softDelete
};