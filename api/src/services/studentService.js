const pool = require('../db/connection');

const getAllStudents = async (busqueda = null) => {
    let query = `SELECT * FROM estudiantes ORDER BY id_estudiante`;
    let valores = [];
    if(busqueda){
        query = `
            SELECT * FROM estudiantes 
            WHERE apellido ILIKE $1 
            OR nombres ILIKE $1
            OR documento::text ILIKE $1
            ORDER BY id_estudiante
        `;
        valores.push(`%${busqueda}%`);
    }
    const result = await pool.query(query, valores);
    return result.rows;
};

const searchStudentID = async (id) => {

    const result = await pool.query(`
        SELECT *
        FROM estudiantes
        WHERE id_estudiante = $1
    `, [id]);

    return result.rows[0];

}

const searchStudentByDocumento = async (documento) => {

    const result = await pool.query(
        `
        SELECT * FROM estudiantes
        WHERE documento = $1
        `,
        [documento]
    );

    return result.rows[0];

};

const searchStudentByEmail = async (email) => {

    const result = await pool.query(
        `
        SELECT * FROM estudiantes
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];

};

const createStudent = async (studentData) => {

    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
    } = studentData;

    const result = await pool.query(
        `
        INSERT INTO estudiantes
        (
            documento,
            apellido,
            nombres,
            email,
            fecha_nacimiento,
            activo,
            id_usuario_modificacion,
            fecha_hora_modificacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
            documento,
            apellido,
            nombres,
            email,
            fecha_nacimiento,
            activo,
            1,
            new Date()
        ]
    );

    return result.rows[0];
}

const modifyStudent = async (id, studentData) => {
    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
    } = studentData;

    const result = await pool.query(
        `
        UPDATE estudiantes
        SET
            documento = $1,
            apellido = $2,
            nombres = $3,
            email = $4,
            fecha_nacimiento = $5,
            activo = $6,
            id_usuario_modificacion = $7,
            fecha_hora_modificacion = NOW()
        WHERE id_estudiante = $8
        RETURNING *
        `,
        [
            documento,
            apellido,
            nombres,
            email,
            fecha_nacimiento,
            activo,
            1, // ID del usuario hardcodeado, deberia ser autenticado
            id
        ]
    );

    return result.rows[0];

};

const deleteStudent = async (id) => {
    
    const result = await pool.query(`
        UPDATE estudiantes
        SET activo = 0, 
            id_usuario_modificacion = $1, 
            fecha_hora_modificacion = NOW()
        WHERE id_estudiante = $2
        RETURNING *
    `, 
    [1, id]);

    return result.rows[0];

}

module.exports = {
    getAllStudents,
    searchStudentID,
    searchStudentByDocumento,
    searchStudentByEmail,
    createStudent,
    modifyStudent,
    deleteStudent
};