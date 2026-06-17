const authJsonHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

document.addEventListener('DOMContentLoaded', async function() {
    const selectCurso = document.getElementById('selectCurso');
    const selectEstudiante = document.getElementById('selectEstudiante');
    const formNuevaInscripcion = document.getElementById('formNuevaInscripcion');

    // Cargar cursos y estudiantes al iniciar la vista
    const cargarCursosYEstudiantes = async () => {
        try {
            const respCursos = await fetchConAuth('http://localhost:3000/inscripciones/cursos');
            const respEstudiantes = await fetchConAuth('http://localhost:3000/students?limit=1000');

            if (respCursos.ok) {
                const cursos = await respCursos.json();
                selectCurso.innerHTML = '<option value="">Seleccione un curso...</option>';
                cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso.idCurso;
                    option.textContent = curso.nombre;
                    selectCurso.appendChild(option);
                });
            } else {
                mostrarToast('Error al cargar la lista de cursos', 'error');
            }

            if (respEstudiantes.ok) {
                const resultado = await respEstudiantes.json();
                const estudiantes = resultado.data || [];
                selectEstudiante.innerHTML = '<option value="">Seleccione un estudiante...</option>';
                estudiantes.forEach(estudiante => {
                    const option = document.createElement('option');
                    option.value = estudiante.idEstudiante;
                    option.textContent = `${estudiante.apellido}, ${estudiante.nombres} (DNI: ${estudiante.documento})`;
                    selectEstudiante.appendChild(option);
                });
            } else {
                mostrarToast('Error al cargar la lista de estudiantes', 'error');
            }

        } catch (error) {
            console.error('Error al inicializar la vista:', error);
            mostrarToast('Error de conexión con el servidor', 'error');
        }
    };

    await cargarCursosYEstudiantes();

    if (formNuevaInscripcion) {
        formNuevaInscripcion.addEventListener('submit', async function(evento) {
            evento.preventDefault(); 

            // Limpiar errores previos
            document.querySelectorAll('.error-mensaje').forEach(span => {
                span.innerText = '';
                span.style.display = 'none';
            });
            document.querySelectorAll('.campo-grupo select').forEach(select => {
                select.classList.remove('input-error');
            });

            const nuevoInscripto = {
                id_curso: selectCurso.value,
                id_estudiante: selectEstudiante.value
            };

            // Validaciones básicas en el cliente
            let esValido = true;
            if (!nuevoInscripto.id_curso) {
                const txtCurso = document.getElementById('error-id_curso');
                txtCurso.innerText = 'El ID del curso es obligatorio';
                txtCurso.style.display = 'block';
                selectCurso.classList.add('input-error');
                esValido = false;
            }
            if (!nuevoInscripto.id_estudiante) {
                const txtEst = document.getElementById('error-id_estudiante');
                txtEst.innerText = 'El ID del estudiante es obligatorio';
                txtEst.style.display = 'block';
                selectEstudiante.classList.add('input-error');
                esValido = false;
            }

            if (!esValido) return;

            try {
                const respuesta = await fetchConAuth('http://localhost:3000/inscripciones', {
                    method: 'POST',
                    headers: authJsonHeaders(),
                    body: JSON.stringify(nuevoInscripto)
                });

                if (respuesta.ok) {
                    mostrarToast('¡Inscripción registrada con éxito!');
                    setTimeout(() => {
                        window.location.href = 'inscriptos.html';
                    }, 1500);
                } else {
                    const errorBackend = await respuesta.json();

                    // Caso A: Errores sintácticos de express-validator
                    if (errorBackend.errors && Array.isArray(errorBackend.errors)) {
                        errorBackend.errors.forEach(err => {
                            const contenedorError = document.getElementById(`error-${err.path}`);
                            const selectAsociado = document.getElementById(err.path === 'id_curso' ? 'selectCurso' : 'selectEstudiante');
                            if (contenedorError) {
                                contenedorError.innerText = err.msg;
                                contenedorError.style.display = 'block';
                            }
                            if (selectAsociado) {
                                selectAsociado.classList.add('input-error');
                            }
                        });
                    } 
                    // Caso B: Lógica de negocio fallida (cupos, estudiante inactivo, duplicados)
                    else if (errorBackend.error) {
                        const errorMsg = errorBackend.error;
                        
                        if (errorMsg.includes('estudiante') || errorMsg.includes('inscripto')) {
                            const txtEst = document.getElementById('error-id_estudiante');
                            txtEst.innerText = errorMsg;
                            txtEst.style.display = 'block';
                            selectEstudiante.classList.add('input-error');
                        } else if (errorMsg.includes('curso') || errorMsg.includes('cupo')) {
                            const txtCurso = document.getElementById('error-id_curso');
                            txtCurso.innerText = errorMsg;
                            txtCurso.style.display = 'block';
                            selectCurso.classList.add('input-error');
                        } else {
                            mostrarToast(errorMsg, 'error');
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                mostrarToast('Error de conexión con el servidor', 'error');
            }
        });
    }
});
