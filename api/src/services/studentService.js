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

module.exports = {
    getAllStudents,
    searchStudentID
};