const { validationResult } = require('express-validator');
const cursoService = require('../services/cursosService'); 
const { cursosDTO } = require('../dtos/cursosDTO');

// GET ALL
const getCursos = async (req, res) => {
    try {
        const searchFilter = req.cursoFilter || {}; 
        
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const orderField = req.query.orderField || 'id_curso';
        const orderDirection = req.query.orderDirection || 'ASC';

        const result = await cursoService.getAllCursos(
            searchFilter, limit, offset, orderField, orderDirection
        );

        const cursosFormateados = result.cursos.map(cursosDTO); 
        
        const totalRows = Number(result.total) || 0;
        const totalPages = Math.ceil(totalRows / limit) || 1;

        res.status(200).json({
            data: cursosFormateados,
            page: page,
            limit: limit,
            total: totalRows,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al recuperar los cursos.' });
    }
};

// GET by id
const searchCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await cursoService.searchCursoID(parseInt(id));

        if (!curso) {
            return res.status(404).json({ error: 'Curso no encontrado.' });
        }
        res.status(200).json(cursosDTO(curso));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al buscar el curso.' });
    }
};

// POST
const createCurso = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado } = req.body;

        const cursoData = {
            nombre,
            descripcion,
            fecha_inicio,
            cantidad_horas,
            inscriptos_max,
            id_curso_estado
        };

        const existingNombre = await cursoService.searchCursoByNombre(nombre);
        if (existingNombre) {
            return res.status(409).json({ error: 'Ya existe un curso registrado con ese nombre.' });
        }

        cursoData.id_usuario_modificacion = req.user ? req.user.id_usuario : 1;

        const newCurso = await cursoService.createCurso(cursoData);
        res.status(201).json(cursosDTO(newCurso)); 
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        
        console.log("Datos recibidos en controller:", req.body);
        
        res.status(500).json({ error: 'Error interno al crear el curso.' });
    }
};

// PUT
const modifyCurso = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const curso = await cursoService.searchCursoID(id);

        if (!curso) {
            return res.status(404).json({ error: 'Curso no encontrado.' });
        }

        const cursoData = req.body;

        const existingNombre = await cursoService.searchCursoByNombre(cursoData.nombre);
        if (existingNombre && existingNombre.id_curso !== parseInt(id)) {
            return res.status(409).json({ error: 'El nombre ingresado ya pertenece a otro curso.' });
        }

        cursoData.id_usuario_modificacion = req.user ? req.user.id_usuario : 1;

        const modifiedCurso = await cursoService.modifyCurso(id, cursoData);
        res.status(200).json(cursosDTO(modifiedCurso));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al modificar el curso.' });
    }
};

// DELETE
const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await cursoService.searchCursoID(id);

        if (!curso) {
            return res.status(404).json({ error: 'Curso no encontrado.' });
        }

        const userIdModif = req.user ? req.user.id_usuario : 1;

        const deletedCurso = await cursoService.deleteCurso(id, userIdModif);
        res.status(200).json(cursosDTO(deletedCurso));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al dar de baja el curso.' });
    }
};

module.exports = {
    getCursos,
    searchCurso,
    createCurso,
    modifyCurso,
    deleteCurso
};