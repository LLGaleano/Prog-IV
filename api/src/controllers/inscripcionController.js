const inscripcionService = require('../services/inscripcionService');
const { inscripcionDTO } = require('../dtos/inscripcionDTO');

const getInscripciones = async (req, res) => {
    try {
        const searchFilter = req.inscripcionFilter || {};

        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const orderField = req.orderField || 'id_inscripcion';
        const orderDirection = req.orderDirection || 'ASC';

        const result = await inscripcionService.getAllInscripciones(
            searchFilter,
            limit,
            offset,
            orderField,
            orderDirection
        );

        const inscripcionesDTO = result.inscripciones.map(inscripcionDTO);

        const totalRows = Number(result.total) || 0;
        const totalPages = Math.ceil(totalRows / limit) || 1;

        res.status(200).json({
            data: inscripcionesDTO,
            page: page,
            limit: limit,
            total: totalRows,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al recuperar la colección de inscripciones.' });
    }
};

const searchInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const inscripcion = await inscripcionService.searchInscripcionID(parseInt(id));

        if (!inscripcion) {
            return res.status(404).json({ error: 'Inscripción no encontrada.' });
        }

        res.status(200).json(inscripcionDTO(inscripcion));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al buscar la inscripción.' });
    }
};

const createInscripcion = async (req, res) => {
    try {
        const { id_curso, id_estudiante } = req.body;

        // Validar estudiante
        const estudiante = await inscripcionService.getEstudianteInfo(id_estudiante);
        if (!estudiante) {
            return res.status(404).json({ error: 'El estudiante ingresado no existe.' });
        }
        if (estudiante.activo !== 1) {
            return res.status(400).json({ error: 'El estudiante ingresado no se encuentra activo.' });
        }

        // Validar curso
        const curso = await inscripcionService.getCursoInfo(id_curso);
        if (!curso) {
            return res.status(404).json({ error: 'El curso ingresado no existe.' });
        }
        if (curso.id_curso_estado !== 2 && curso.id_curso_estado !== 1) {
            return res.status(400).json({ error: 'La inscripción para este curso no está habilitada.' });
        }

        // Validar duplicado
        const duplicado = await inscripcionService.checkInscripcionDuplicada(id_curso, id_estudiante);
        if (duplicado) {
            return res.status(409).json({ error: 'El estudiante ya se encuentra inscripto de forma activa en este curso.' });
        }

        // Validar cupo
        const inscriptosActuales = await inscripcionService.countInscriptosCurso(id_curso);
        if (inscriptosActuales >= curso.inscriptos_max) {
            return res.status(409).json({ error: `No se puede inscribir al estudiante. Se ha alcanzado el cupo máximo establecido (${curso.inscriptos_max}) para este curso.` });
        }

        const inscripcionData = {
            id_curso,
            id_estudiante,
            id_usuario_modificacion: req.user ? req.user.id_usuario : 1
        };

        const newInscripcion = await inscripcionService.createInscripcion(inscripcionData);
        res.status(201).json(inscripcionDTO(newInscripcion));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al crear la inscripción.' });
    }
};

const deleteInscripcion = async (req, res) => {
    try {
        const { id } = req.params;
        const inscripcion = await inscripcionService.searchInscripcionID(id);

        if (!inscripcion) {
            return res.status(404).json({ error: 'Inscripción no encontrada.' });
        }

        // Si ya está cancelada, no volvemos a cancelarla
        if (inscripcion.id_inscripcion_estado === 2) {
            return res.status(400).json({ error: 'La inscripción ya se encuentra cancelada.' });
        }

        const userIdModif = req.user ? req.user.id_usuario : 1;

        const deletedInscripcion = await inscripcionService.deleteInscripcion(id, userIdModif);
        res.status(200).json(inscripcionDTO(deletedInscripcion));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al dar de baja la inscripción.' });
    }
};

module.exports = {
    getInscripciones,
    searchInscripcion,
    createInscripcion,
    deleteInscripcion
};
