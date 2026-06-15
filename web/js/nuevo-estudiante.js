const authJsonHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#inputFechaNac", {
        locale: "es",                  
        dateFormat: "Y-m-d",          
        altInput: true,               
        altFormat: "d/m/Y",           
        maxDate: "today",             
        disableMobile: "true"          
    });
    
    const formNuevoAlumno = document.getElementById('formNuevoAlumno');

    if (formNuevoAlumno) {
        // Volvemos a escuchar el 'submit' del formulario de forma limpia
        formNuevoAlumno.addEventListener('submit', async function(evento) {
            // Frenamos la validación por defecto del navegador para delegar el control
            evento.preventDefault(); 

            // Limpiamos los textos de error de intentos anteriores
            document.querySelectorAll('.error-mensaje').forEach(span => {
                span.innerText = '';
                span.style.display = 'none'; // Los escondemos temporalmente
            });
            document.querySelectorAll('.campo-grupo input').forEach(input => {
                input.classList.remove('input-error');
            });

            // Recolectamos la información estructurada para el servidor
            const nuevoEstudiante = {
                documento: document.getElementById('inputDocumento').value.trim(),
                nombres: document.getElementById('inputNombres').value.trim(),
                apellido: document.getElementById('inputApellido').value.trim(),
                email: document.getElementById('inputEmail').value.trim(),
                fecha_nacimiento: document.getElementById('inputFechaNac').value,
                activo: 1 
            };

            try {

                const respuesta = await fetchConAuth('http://localhost:3000/students', {
                    method: 'POST',
                    headers: authJsonHeaders(),
                    body: JSON.stringify(nuevoEstudiante)
                });

                // CASO 201: Alta exitosa en PostgreSQL
                if (respuesta.ok) {
                    mostrarToast('¡Estudiante registrado con éxito!');
                    
                    // Frenamos la redirección 1.5 segundos para que se renderice el Toast
                    setTimeout(() => {
                        window.location.href = 'estudiantes.html'; 
                    }, 1500);
                } 
                // CASOS DE ERROR (400 Bad Request o 409 Conflict)
                else {
                    const errorBackend = await respuesta.json();
                    
                    // CASO A: Errores devuelvos por express-validator (Código 400)
                    if (errorBackend.errors && Array.isArray(errorBackend.errors)) {
                        errorBackend.errors.forEach(err => {
                            const contenedorError = document.getElementById(`error-${err.path}`);
                            const inputAsociado = document.getElementById(`input${err.path.charAt(0).toUpperCase() + err.path.slice(1)}`);
                            
                            if (contenedorError) {
                                contenedorError.innerText = err.msg;
                                contenedorError.style.display = 'block';
                            }
                            if (inputAsociado) {
                                inputAsociado.classList.add('input-error');
                            }
                        });
                    } 
                    // CASO B: Violación de restricciones de unicidad de negocio (Código 409)
                    else if (errorBackend.error) {
                        if (errorBackend.error.includes('documento')) {
                            const txtDoc = document.getElementById('error-documento');
                            txtDoc.innerText = errorBackend.error;
                            txtDoc.style.display = 'block';
                            document.getElementById('inputDocumento').classList.add('input-error');
                        } else if (errorBackend.error.includes('email')) {
                            const txtEmail = document.getElementById('error-email');
                            txtEmail.innerText = errorBackend.error;
                            txtEmail.style.display = 'block';
                            document.getElementById('inputEmail').classList.add('input-error');
                        } else {
                            alert(errorBackend.error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error de conexión detectado:', error);
                
                // Removimos el caracter extraño. Si el formulario no muestra errores,
                // asumimos que el fetch se cortó por el cambio de página y redirigimos limpio.
                const tieneErroresVisibles = Array.from(document.querySelectorAll('.error-mensaje'))
                                                  .some(span => span.style.display === 'block');

                if (!tieneErroresVisibles) {
                    //window.location.href = 'estudiantes.html';
                    console.error(error);
                    alert('Ocurrió un error');
                } else {
                    alert('No se pudo establecer comunicación con el servidor de la API.');
                }
            }
        });
    }
});


// FUNCIÓN DEL TOAST (Asegurate de que quede acá abajo si no la tenías mapeada)
const mostrarToast = (mensaje, tipo = 'exito') => {
    const toast = document.createElement('div');
    toast.className = `toast-notificacion ${tipo}`;
    const icono = tipo === 'exito' ? 'bx-check-circle' : 'bx-info-circle';
    toast.innerHTML = `<i class="bx ${icono}" style="font-size: 1.25rem;"></i> <span>${mensaje}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
};