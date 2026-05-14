const pool = require('../db/connection');

const getAllStudents = async () => {

    const result = await pool.query(`
        SELECT *
        FROM estudiantes
        ORDER BY id_estudiante
    `);

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

module.exports = {
    getAllStudents,
    searchStudentID,
    createStudent
};