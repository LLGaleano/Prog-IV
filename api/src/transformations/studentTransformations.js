//Intercepta los query params de la URL, los limpia y los inyecta en el objeto 'req' para el controlador.
 
const estudiantesFindAllTransform = (req, res, next) => {

    const queryLimit = Number(req.query.limit);
    const queryOffset = Number(req.query.offset);

    req.limit = queryLimit > 0 ? queryLimit : 20;
    req.offset = queryOffset >= 0 ? queryOffset : 0;

    const filterObj = {};
    let orderField = 'id_estudiante';
    let orderDirection = 'ASC';

    const { documento, apellido, nombres, email, order, asc } = req.query;

    if (documento && documento.trim() !== "") filterObj.documento = documento.trim();
    if (apellido && apellido.trim() !== "") filterObj.apellido = apellido.trim();
    if (nombres && nombres.trim() !== "") filterObj.nombres = nombres.trim();
    if (email && email.trim() !== "") filterObj.email = email.trim();

    if (order) {
        const fieldMapping = {
            idEstudiante: 'id_estudiante',
            documento: 'documento',
            apellido: 'apellido',
            email: 'email'
        };
        orderField = fieldMapping[order] || 'id_estudiante';
        orderDirection = asc === "true" ? "ASC" : "DESC";
    }

    req.studentFilter = filterObj; 
    req.orderField = orderField;
    req.orderDirection = orderDirection;

    next();
};

module.exports = {
    estudiantesFindAllTransform
};