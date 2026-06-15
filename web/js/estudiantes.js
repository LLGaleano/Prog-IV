
const tabla = document.getElementById('tbody'); 
const buscadorEstudiante = document.querySelector('.buscador'); 
const modal = document.getElementById('modal-estudiante'); 
const formEstudiante = document.getElementById('form-estudiante');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');


const authHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const authJsonHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const btnAnt = document.getElementById('btn-ant');
const btnSig = document.getElementById('btn-sig');
const infoPaginacion = document.getElementById('info-paginacion');



let paginaActual = 1;
const limitePorPagina = 20;
let totalDePaginas = 1;

const cargarEstudiantes = async () => {
    try {
        let textoBusqueda = buscadorEstudiante.value.trim();
        let url = `http://localhost:3000/students?page=${paginaActual}&limit=${limitePorPagina}`;
        
        // Si hay algo escrito en el buscador, le sumamos el filtro correspondiente
        if (textoBusqueda !== '') {
            if (/^\d+$/.test(textoBusqueda)) {
                url += `&documento=${textoBusqueda}`;
            } else {
                url += `&apellido=${textoBusqueda}`;
            }
        }

        const respuesta = await fetchConAuth(url, {
            headers: authHeaders()
        });
        const objetoRespuesta = await respuesta.json();
        
        // 1. Renderizamos la tabla
        llenarTabla(objetoRespuesta);
        
        // 2. Calculamos el total de páginas basándonos en el total que manda el Back
        const totalRegistros = objetoRespuesta.total || 0;
        totalDePaginas = Math.ceil(totalRegistros / limitePorPagina) || 1;

        // 3. Actualizamos el texto del medio (Página X de Y)
        infoPaginacion.innerText = `Página ${paginaActual} de ${totalDePaginas}`;

        // 4. Bloqueamos botones si estamos en los extremos
        btnAnt.disabled = (paginaActual === 1);
        btnSig.disabled = (paginaActual === totalDePaginas);

    } catch (error) {
        console.error("Error al cargar la página de estudiantes:", error);
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error de conexión al cargar los datos.</td></tr>';
    }
};
// Función para llenar la tabla 
const llenarTabla = (objetoRespuesta) => {
    tabla.innerHTML = ''; 
    const listaEstudiantes = objetoRespuesta.data;

    if (!Array.isArray(listaEstudiantes)) {
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error de consistencia en el formato de datos.</td></tr>';
        return;
    }
    
    if (listaEstudiantes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No se encontraron estudiantes en esta página.</td></tr>';
        return;
    }

    listaEstudiantes.forEach(estudiante => {
        const fila = document.createElement('tr');
        const classEstado = estudiante.activo === 1 ? 'estado-activo' : 'estado-inactivo';
        const textoEstado = estudiante.activo === 1 ? 'Activo' : 'Inactivo';

        let fechaFormateada = '-';
        if (estudiante.fechaNacimiento) {
            const [anio, mes, dia] = estudiante.fechaNacimiento.split('-');
            fechaFormateada = `${dia}/${mes}/${anio}`;
        }

        fila.innerHTML = `
        <td>${estudiante.idEstudiante || '-'}</td>
        <td>${estudiante.documento || "-"}</td>
        <td>${estudiante.apellido || '-'}</td>
        <td>${estudiante.nombres || '-'}</td>
        <td>${estudiante.email || '-'}</td>
        <td>${fechaFormateada}</td>
        <td><span class="${classEstado}">${textoEstado}</span></td>
        
        <td>
            <div class="action-btn-group">
                <button class="action-btn view-btn" data-id="${estudiante.idEstudiante}" title="Ver Detalles">
                    <i class="bx bx-show-alt"></i>
                </button>
                <button class="action-btn edit-btn" data-id="${estudiante.idEstudiante}" title="Editar">
                    <i class="bx bx-edit-alt"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${estudiante.idEstudiante}" title="Eliminar">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
        </td>
    `;
    tabla.appendChild(fila);
});
};

document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes();
});

buscadorEstudiante.addEventListener('keyup', () => {
    paginaActual = 1; 
    cargarEstudiantes();
});

btnAnt.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        cargarEstudiantes();
    }
});

btnSig.addEventListener('click', () => {
    if (paginaActual < totalDePaginas) {
        paginaActual++;
        cargarEstudiantes();
    }
});

tabla.addEventListener('click', async (evento) => {
    
    const boton = evento.target.closest('.action-btn');
    if (!boton) return;
  
    const idEstudiante = boton.dataset.id;
   
    if (boton.classList.contains('view-btn')) {
        try {
            const respuesta = await fetchConAuth(
                `http://localhost:3000/students/${idEstudiante}`,
                {
                    headers: authHeaders()
                }
            );
            const estudiante = await respuesta.json();

           
            document.getElementById('modal-titulo').innerText = 'Detalles del Estudiante';
            document.getElementById('modal-id').value = estudiante.idEstudiante;
            document.getElementById('modal-dni').value = estudiante.documento;
            document.getElementById('modal-apellido').value = estudiante.apellido;
            document.getElementById('modal-nombres').value = estudiante.nombres;
            document.getElementById('modal-email').value = estudiante.email;
            document.getElementById('modal-fecha').value = estudiante.fechaNacimiento;

           
            document.querySelectorAll('#form-estudiante input').forEach(input => input.disabled = true);
           
            document.getElementById('btn-guardar-modal').classList.add('oculto');

            modal.showModal(); 
        } catch (error) {
            console.error("Error al recuperar detalles:", error);
        }
    }

    if (boton.classList.contains('edit-btn')) {
        try {
            const respuesta = await fetchConAuth(
                `http://localhost:3000/students/${idEstudiante}`,
                {
                    headers: authHeaders()
                }
            );
            const estudiante = await respuesta.json();

            document.getElementById('modal-titulo').innerText = 'Editar Estudiante';
            document.getElementById('modal-id').value = estudiante.idEstudiante;
            document.getElementById('modal-dni').value = estudiante.documento;
            document.getElementById('modal-apellido').value = estudiante.apellido;
            document.getElementById('modal-nombres').value = estudiante.nombres;
            document.getElementById('modal-email').value = estudiante.email;
            document.getElementById('modal-fecha').value = estudiante.fechaNacimiento;

            
            document.querySelectorAll('#form-estudiante input').forEach(input => input.disabled = false);
            document.getElementById('btn-guardar-modal').classList.remove('oculto');

            modal.showModal();
        } catch (error) {
            console.error("Error al levantar editor:", error);
        }
    }

    if (boton.classList.contains('delete-btn')) {
        const confirmar = confirm(`¿Estás seguro de que deseas dar de baja al estudiante ID: ${idEstudiante}?`);
        if (!confirmar) return;

        try {
            const respuesta = await fetchConAuth(
                `http://localhost:3000/students/${idEstudiante}`,
                {
                    method: 'DELETE',
                    headers: authHeaders()
                }
            );

            if (respuesta.ok) {
                mostrarToast('Estudiante dado de baja correctamente.');
                cargarEstudiantes(); 
            } else {
                alert('No se pudo procesar la baja en el servidor.');
            }
        } catch (error) {
            console.error("Error al procesar el delete:", error);
        }
    }
});
    

if (formEstudiante) {
    formEstudiante.addEventListener('submit', async (evento) => {
        evento.preventDefault(); 
        const idEstudiante = document.getElementById('modal-id').value;

        const estudianteActualizado = {
            documento: document.getElementById('modal-dni').value,
            nombres: document.getElementById('modal-nombres').value,
            apellido: document.getElementById('modal-apellido').value,
            email: document.getElementById('modal-email').value,
            fecha_nacimiento: document.getElementById('modal-fecha').value,
            activo: 1
        };

        try {
            const respuesta = await fetchConAuth(`http://localhost:3000/students/${idEstudiante}`, {
                method: 'PUT',
                headers: authJsonHeaders(),
                body: JSON.stringify(estudianteActualizado) 
            });

            if (respuesta.ok) {
                mostrarToast('¡Estudiante modificado con éxito!');
                modal.close(); 
                const res = await fetchConAuth(
                    'http://localhost:3000/students',
                    {
                        headers: authHeaders()
                    }
                );
                const objetoRespuesta = await res.json();
                llenarTabla(objetoRespuesta);
            } else {
                const errorBackend = await respuesta.json();
                alert('Error al actualizar: ' + (errorBackend.error || 'Verifique los campos.'));
            }
        } catch (error) {
            console.error("Error en el PUT:", error);
            alert("Error de red al intentar guardar las modificaciones.");
        }
    });
}

if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
        if (modal) modal.close();
    });
}

