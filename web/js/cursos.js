let paginaActual = 1;
let totalPaginas = 1;

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCursos(paginaActual);

    //boton anterior
    const btnAnt = document.getElementById('btn-ant');
    if (btnAnt) {
        btnAnt.addEventListener('click', async () => {
            if (paginaActual > 1) {
                paginaActual--;
                await cargarCursos(paginaActual);
            }
        });
    }
    //boton siguiente
    const btnSig = document.getElementById('btn-sig');
    if (btnSig) {
        btnSig.addEventListener('click', async () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                await cargarCursos(paginaActual);
            }
        });
    }
    const buscadorCurso = document.querySelector('.buscador');
    if (buscadorCurso) {
        buscadorCurso.addEventListener('keyup', () => {
            paginaActual = 1; // Al buscar, siempre volvemos a la página 1
            cargarCursos(paginaActual);
        });
    }
});

async function cargarCursos(page) {
    try {
        const timestamp = new Date().getTime();
        let url = `http://localhost:3000/cursos?page=${page}&limit=20&t=${timestamp}`;

        const buscadorCurso = document.querySelector('.buscador');
        const textoBusqueda = buscadorCurso ? buscadorCurso.value.trim() : '';


        if (textoBusqueda !== '') {
            url += `&nombre=${encodeURIComponent(textoBusqueda)}`;
        }

        const respuesta = await fetchConAuth(url);
        if (respuesta && respuesta.ok) {
            const JSONData = await respuesta.json();
            
            const cursos = JSONData.data; 
            
            totalPaginas = JSONData.totalPages || 1; 
            paginaActual = JSONData.page || 1;

            const tabla = document.getElementById('tbody');
            tabla.innerHTML = ''; 

            cursos.forEach(curso => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${curso.idCurso}</td>
                    <td>${curso.nombre}</td>
                    <td>${curso.descripcion}</td>
                    <td>${curso.fechaInicio}</td>
                    <td>0</td> <td>${curso.inscriptosMax}</td>
                    <td>
                        <div class="action-btn-group">
                            <button class="action-btn view-btn" onclick="abrirModal(${curso.idCurso}, 'ver')" title="Ver Detalles">
                                <i class='bx bx-show'></i>
                            </button>
                            <button class="action-btn edit-btn" onclick="abrirModal(${curso.idCurso}, 'editar')" title="Editar Curso">
                                <i class='bx bx-edit-alt'></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="borrarCurso(${curso.idCurso})" title="Eliminar Curso">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </td>
                `;

                tabla.appendChild(fila);
            });
            
            document.getElementById('info-paginacion').textContent = `Página ${paginaActual} de ${totalPaginas}`;

            document.getElementById('btn-ant').disabled = (paginaActual === 1);
            document.getElementById('btn-sig').disabled = (paginaActual === totalPaginas);
        }
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
    }
}

//Programe la pantalla modal aca

async function abrirModal(idCurso, modo) {
    try {
        const respuesta = await fetchConAuth(`http://localhost:3000/cursos/${idCurso}`);

        if (respuesta && respuesta.ok) {
            const curso = await respuesta.json();
            
            document.getElementById('modalNombre').value = curso.nombre;
            document.getElementById('modalId').value = curso.idCurso;
            document.getElementById('modalDesc').value = curso.descripcion;
            document.getElementById('modalFecha').value = curso.fechaInicio;
            document.getElementById('modalHoras').value = curso.cantidadHoras;
            document.getElementById('modalCupo').value = curso.inscriptosMax;

            const titulo = document.getElementById('modal-titulo');
            const btnGuardar = document.getElementById('btn-guardar-modal');
            const inputs = document.querySelectorAll('#modal-curso input:not(#modalId), #modal-curso textarea');

            if (modo === 'ver') {
                titulo.textContent = 'Detalles del Curso';
                btnGuardar.classList.add('oculto');
                inputs.forEach(input => input.readOnly = true);
            } else if (modo === 'editar') {
                titulo.textContent = 'Editar Curso';
                btnGuardar.classList.remove('oculto');
                inputs.forEach(input => input.readOnly = false);
                document.getElementById('modalId').readOnly = true; 
            }

            const modal = document.getElementById('modal-curso');
            modal.showModal();
        } else {
            alert('No se pudieron cargar los detalles del curso.');
        }
    } catch (error) {
        console.error('Error al abrir el modal:', error);
        alert('Error de conexión con el servidor.');
    }
}

//enviamos el PUT al backend
async function guardarEdicionCurso() {
    const idCurso = document.getElementById('modalId').value;
    
    const cursoActualizado = {
        nombre: document.getElementById('modalNombre').value.trim(),
        descripcion: document.getElementById('modalDesc').value.trim(),
        fecha_inicio: document.getElementById('modalFecha').value,
        cantidad_horas: Number(document.getElementById('modalHoras').value),
        inscriptos_max: Number(document.getElementById('modalCupo').value),
        id_curso_estado: 1 // Mantenemos estado activo
    };

    //validacion rapida
    if (!cursoActualizado.nombre || !cursoActualizado.fecha_inicio || cursoActualizado.cantidad_horas <= 0 || cursoActualizado.inscriptos_max <= 0) {
        alert("Por favor, complete todos los campos correctamente. Horas y Cupo deben ser mayores a cero.");
        return;
    }

    try {
        const respuesta = await fetchConAuth(`http://localhost:3000/cursos/${idCurso}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursoActualizado)
        });

        if (respuesta.ok) {
            mostrarToast('¡Curso modificado con éxito!');
            cerrarModal();
            cargarCursos(paginaActual);
        } else {
            const data = await respuesta.json();
            alert('Error al actualizar: ' + (data.error || 'Revise los datos ingresados.'));
        }
    } catch (error) {
        console.error("Error en el PUT:", error);
        alert("Error de red al intentar guardar las modificaciones.");
    }
}
//soft delete
async function borrarCurso(idCurso) {
    const confirmar = confirm(`¿Estás seguro de que deseas dar de baja el curso #${idCurso}?`);
    if (!confirmar) return;

    try {
        const respuesta = await fetchConAuth(`http://localhost:3000/cursos/${idCurso}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            mostrarToast('¡Curso dado de baja correctamente!');
            
            const tabla = document.getElementById('tbody');
            if (tabla.children.length === 1 && paginaActual > 1) {
                paginaActual--;
            }
            
            await cargarCursos(paginaActual);
        } else {
            const data = await respuesta.json();
            alert('No se pudo procesar la baja: ' + (data.error || 'Verifique el estado del curso.'));
        }
    } catch (error) {
        console.error("Error al procesar el delete:", error);
        alert("Error de red al intentar eliminar el curso.");
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-curso');
    modal.close();
}