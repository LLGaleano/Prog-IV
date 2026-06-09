document.addEventListener('DOMContentLoaded', function() {
    
    const formNuevoAlumno = document.getElementById('formNuevoAlumno');

    if (formNuevoAlumno) {
        formNuevoAlumno.addEventListener('submit', async function(evento) {
            evento.preventDefault(); 

            // Construimos el JSON respetando el formato del Backend
            const nuevoEstudiante = {
                documento: document.getElementById('inputDocumento').value.trim(),
                nombres: document.getElementById('inputNombres').value.trim(),
                apellido: document.getElementById('inputApellido').value.trim(),
                email: document.getElementById('inputEmail').value.trim(),
                fecha_nacimiento: document.getElementById('inputFechaNac').value,
                activo: 1 
            };

            try {
                const respuesta = await fetch('http://localhost:3000/students', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoEstudiante)
                });

                if (respuesta.ok) {
                    alert('¡Estudiante registrado con éxito!');
                    window.location.href = 'estudiantes.html'; 
                } else {
                    const errorBackend = await respuesta.json();
                    
                    // Si express-validator rebotó el campo, extraemos la lista de anomalías
                    if (errorBackend.errors && Array.isArray(errorBackend.errors)) {
                        const mensajes = errorBackend.errors.map(err => `- ${err.msg}`).join('\n');
                        alert('Errores de validación de entrada:\n' + mensajes);
                    } else {
                        // Si falló por controles de unicidad de email/documento (409 Conflict)
                        alert('No se pudo guardar: ' + (errorBackend.error || 'Verifique la información provista.'));
                    }
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo establecer conexión con el servidor de la API.');
            }
        });
    }
});