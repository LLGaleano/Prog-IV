const validateRequiredFields = (studentData) => {

    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
    } = studentData;

    if (
        !documento ||
        !apellido ||
        !nombres ||
        !email ||
        !fecha_nacimiento ||
        activo === undefined
    ) {
        return 'Faltan campos obligatorios';
    }

    return null;
};

const validateEmail = (email) => {

    if (!email.includes('@') || !email.includes('.')) {
        return 'Email inválido';
    }

    return null;
};

const validateDocumento = (documento) => {

    if (isNaN(documento)){
        return 'El documento debe ser un numero y sin puntos';
    }

    if (documento.length < 7 || documento.length > 8){
        return 'El documento debe tener 7 u 8 digitos'
    }

    return null;
}

const validateActivo = (activo) => {

    if (activo != 0 && activo != 1){
        return 'Valor de activo invalido';
    }

    return null;
}

const validateFechaNac = (fecha_nacimiento) => {

    const today = new Date();
    if (new Date(fecha_nacimiento) > today){
        return 'Ingrese una fecha de nacimiento valida'
    }

    return null;

}

module.exports = {
    validateRequiredFields,
    validateEmail,
    validateDocumento,
    validateActivo, 
    validateFechaNac
}


