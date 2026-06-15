verificarSesion();

const authJsonHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

document.addEventListener('DOMContentLoaded', function() {
    const formNuevaInscripcion = document.getElementById('formNuevaInscripcion');

    if (formNuevaInscripcion) {
        formNuevaInscripcion.addEventListener('submit', async function(evento) {
            evento.preventDefault(); 

            const nuevoInscripto = {
                id_curso: document.getElementById('inputCursoId').value,
                id_estudiante: document.getElementById('inputEstudianteId').value
            };

            try {
                const respuesta = await fetchConAuth('http://localhost:3000/inscripciones', {
                    method: 'POST',
                    headers: authJsonHeaders(),
                    body: JSON.stringify(nuevoInscripto)
                });

                if (respuesta.ok) {
                    alert('¡Inscripción registrada con éxito!');
                    window.location.href = 'inscriptos.html';
                } else {
                    const errorBackend = await respuesta.json();
                    alert('Error al registrar: ' + (errorBackend.error || 'Verifique los datos.'));
                }
            } catch (error) {
                console.error(error);
                alert('Error de conexión con el servidor.');
            }
        });
    }
});
