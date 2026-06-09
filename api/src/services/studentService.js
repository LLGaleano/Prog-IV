const pool = require('../db/connection');


const getAllStudents = async (filter = {}, limit = 20, offset = 0, order = 'id_estudiante', asc = 'ASC') => {
    // Traemos solo los alumnos que no tengan la baja lógica 
    let whereClause = ` WHERE activo = 1 `;
    const values = [];

    // Evaluamos de manera estricta si las propiedades del filtro existen y tienen texto
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

    // 1. QUERY DE CONTEO: Ejecutamos el COUNT usando el mismo WHERE dinámico
    const countQuery = `SELECT COUNT(*) AS total FROM estudiantes ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total) || 0;

    // 2. QUERY DE DATOS: Listamos las columnas explícitas y aplicamos formateo de fecha (Evita descalce de huso horario)
    let query = `
        SELECT id_estudiante, documento, apellido, nombres, email, 
               TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') as fecha_nacimiento, 
               activo
        FROM estudiantes
        ${whereClause}
        ORDER BY ${order} ${asc}
    `;

    // Clonamos el array de valores de los filtros para agregar de forma segura los parámetros de paginación
    const queryValues = [...values];
    
    // Agregamos el límite
    queryValues.push(limit);
    query += ` LIMIT $${queryValues.length}`;

    // Agregamos el desplazamiento (offset)
    queryValues.push(offset);
    query += ` OFFSET $${queryValues.length}`;

    // Ejecutamos la consulta final en PostgreSQL
    const result = await pool.query(query, queryValues);

    return {
        students: result.rows,
        total
    };
};

// Recupera de forma absoluta los datos de un estudiante por su clave primaria.
const searchStudentID = async (id) => {
    const result = await pool.query(`
        SELECT id_estudiante, documento, apellido, nombres, email, 
               TO_CHAR(fecha_nacimiento, 'YYYY-MM-DD') as fecha_nacimiento, 
               activo
        FROM estudiantes
        WHERE id_estudiante = $1
    `, [id]);
    return result.rows[0]; // Retorna el registro mapeado como objeto puro de JS o undefined si no hay coincidencias
};

// Busca un registro por documento exacto para controles de unicidad de negocio.
 
const searchStudentByDocumento = async (documento) => {
    const result = await pool.query(
        `SELECT * FROM estudiantes WHERE documento = $1`,
        [documento]
    );
    return result.rows[0];
};

// Busca un registro por email exacto para controles de unicidad de negocio.

const searchStudentByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM estudiantes WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

// Inserta un nuevo estudiante registrando la marca temporal y el ID de auditoría 
const createStudent = async (studentData) => {
    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo,
        id_usuario_modificacion
    } = studentData;

    const result = await pool.query(
        `INSERT INTO estudiantes
        (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`, // El RETURNING * le dice a Postgres que retorne el objeto insertado incluyendo el 'id_estudiante' auto-generado
        [documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion]
    );
    return result.rows[0];
};

// Actualiza los campos en la fila del ID 

const modifyStudent = async (id, studentData) => {
    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo,
        id_usuario_modificacion
    } = studentData;

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

//Soft Delete
const deleteStudent = async (id, id_usuario_modificacion) => {
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
    getAllStudents,
    searchStudentID,
    searchStudentByDocumento,
    searchStudentByEmail,
    createStudent,
    modifyStudent,
    deleteStudent
};