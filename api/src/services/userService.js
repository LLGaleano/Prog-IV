const pool = require('../db/connection');

const find = async (username, password) => {
    const result = await pool.query(`
        SELECT
            id_usuario,
            nombre,
            apellido,
            nombre_usuario
        FROM usuarios
        WHERE nombre_usuario = $1
          AND contrasenia = encode(digest($2, 'sha256'), 'hex')
          AND activo = 1
    `, [username, password]);

    return result.rows[0];
};

const findById = async (idUsuario) => {
    const result = await pool.query(`
        SELECT
            id_usuario,
            nombre,
            apellido,
            nombre_usuario
        FROM usuarios
        WHERE id_usuario = $1
          AND activo = 1
    `, [idUsuario]);

    return result.rows[0];
};

module.exports = {
    find,
    findById
};