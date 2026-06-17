const pool = require('../db/connection');

const find = async (username, password) => {
    // probando q ande
    console.log("=== INTENTO DE LOGIN ===");
    console.log("Usuario recibido:", username);
    console.log("Contraseña recibida:", password);
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

const createCurso = async (cursoData) => {
    // Simplemente asegúrate que pase el objeto entero
    return await cursosRepository.create(cursoData);
};

module.exports = {
    find,
    findById
};