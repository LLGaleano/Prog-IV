const cursosFindAllTransform = (req, res, next) => {

    const queryLimit = Number(req.query.limit);
    const queryOffset = Number(req.query.offset);

    req.limit = queryLimit > 0 ? queryLimit : 20;
    req.offset = queryOffset >= 0 ? queryOffset : 0;

    const filterObj = {};
    let orderField = 'id_curso';
    let orderDirection = 'ASC';

    const { nombre, cantidadHoras, idCursoEstado, order, asc } = req.query;

    if (nombre && nombre.trim() !== "") filterObj.nombre = nombre.trim();
    
    if (cantidadHoras) filterObj.cantidad_horas = Number(cantidadHoras);
    if (idCursoEstado) filterObj.id_curso_estado = Number(idCursoEstado);

    if (order) {
        const fieldMapping = {
            idCurso: 'id_curso',
            nombre: 'nombre',
            fechaInicio: 'fecha_inicio',
            cantidadHoras: 'cantidad_horas',
            inscriptosMax: 'inscriptos_max'
        };
        orderField = fieldMapping[order] || 'id_curso';
        orderDirection = asc === "true" ? "ASC" : "DESC";
    }


    req.cursoFilter = filterObj; 
    req.orderField = orderField;
    req.orderDirection = orderDirection;

    next();
};

module.exports = {
    cursosFindAllTransform
};