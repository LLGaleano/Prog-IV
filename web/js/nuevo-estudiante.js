document.addEventListener('DOMContentLoaded', function() {
    
    const formNuevoAlumno = document.getElementById('formNuevoAlumno');

    if (formNuevoAlumno) {
        formNuevoAlumno.addEventListener('submit', async function(evento) {
            evento.preventDefault(); 

            // Construimos el objeto
            const nuevoEstudiante = {
                documento: document.getElementById('inputDocumento').value,
                nombres: document.getElementById('inputNombres').value,
                apellido: document.getElementById('inputApellido').value,
                email: document.getElementById('inputEmail').value,
                fecha_nacimiento: document.getElementById('inputFechaNac').value,
                activo: 1 
            };

            try {
                // Fetch tipo POST
                const respuesta = await fetch('http://localhost:3000/students', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoEstudiante)
                });

                if (respuesta.ok) {
                    alert('¡Estudiante registrado con éxito!');
                    // Volvemos a la pantalla principal
                    window.location.href = 'estudiantes.html'; 
                } else {
                    const error = await respuesta.json();
                    alert('Error al guardar: ' + (error.message || 'Verificá los datos ingresados.'));
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});
