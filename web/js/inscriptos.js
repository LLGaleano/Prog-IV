const tabla = document.getElementById('tbody'); 
const buscadorInscripcion = document.querySelector('.buscador'); 
const modal = document.getElementById('modal-inscripcion'); 
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

const btnAnt = document.getElementById('btn-ant');
const btnSig = document.getElementById('btn-sig');
const infoPaginacion = document.getElementById('info-paginacion');

let paginaActual = 1;
const limitePorPagina = 20;
let totalDePaginas = 1;

const cargarInscripciones = async () => {
    try {
        let textoBusqueda = buscadorInscripcion.value.trim();
        let url = `http://localhost:3000/inscripciones?page=${paginaActual}&limit=${limitePorPagina}`;
        
        if (textoBusqueda !== '') {
            url += `&documentoEstudiante=${textoBusqueda}`;
        }

        const respuesta = await fetch(url);
        const objetoRespuesta = await respuesta.json();
        
        llenarTabla(objetoRespuesta.data);
        
        const totalRegistros = objetoRespuesta.total || 0;
        totalDePaginas = Math.ceil(totalRegistros / limitePorPagina) || 1;

        infoPaginacion.innerText = `Página ${paginaActual} de ${totalDePaginas}`;

        btnAnt.disabled = (paginaActual === 1);
        btnSig.disabled = (paginaActual === totalDePaginas);

    } catch (error) {
        console.error(error);
        tabla.innerHTML = '<tr><td colspan="7">Error al cargar los datos.</td></tr>';
    }
};

const llenarTabla = (listaInscripciones) => {
    tabla.innerHTML = ''; 

    if (!listaInscripciones || listaInscripciones.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" style="text-align: center;">No se encontraron inscripciones.</td></tr>';
        return;
    }

    listaInscripciones.forEach(inscripcion => {
        const fila = document.createElement('tr');
        const textoEstado = inscripcion.estadoDescripcion;
        const classEstado = inscripcion.idInscripcionEstado === 1 ? 'estado-activo' : 'estado-inactivo';

        fila.innerHTML = `
            <td>${inscripcion.idInscripcion}</td>
            <td>${inscripcion.cursoNombre}</td>
            <td>${inscripcion.estudianteApellido}, ${inscripcion.estudianteNombres}</td>
            <td>${inscripcion.estudianteDocumento}</td>
            <td>${inscripcion.fechaHoraInscripcion}</td>
            <td><span class="${classEstado}">${textoEstado}</span></td>
            <td>
                <div class="action-btn-group">
                    <button class="action-btn view-btn" data-id="${inscripcion.idInscripcion}" title="Ver Detalles">
                        <i class="bx bx-show-alt"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${inscripcion.idInscripcion}" title="Cancelar" ${inscripcion.idInscripcionEstado === 2 ? 'disabled' : ''}>
                        <i class="bx bx-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tabla.appendChild(fila);
    });
};

buscadorInscripcion.addEventListener('keyup', () => {
    paginaActual = 1; 
    cargarInscripciones();
});

btnAnt.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        cargarInscripciones();
    }
});

btnSig.addEventListener('click', () => {
    if (paginaActual < totalDePaginas) {
        paginaActual++;
        cargarInscripciones();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    cargarInscripciones();
});

tabla.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('.action-btn');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.classList.contains('view-btn')) {
        try {
            const respuesta = await fetch(`http://localhost:3000/inscripciones/${id}`);
            const inscripcion = await respuesta.json();

            document.getElementById('modal-id').value = inscripcion.idInscripcion;
            document.getElementById('modal-curso').value = inscripcion.cursoNombre;
            document.getElementById('modal-estudiante').value = inscripcion.estudianteApellido + ", " + inscripcion.estudianteNombres;
            document.getElementById('modal-dni').value = inscripcion.estudianteDocumento;
            document.getElementById('modal-fecha').value = inscripcion.fechaHoraInscripcion;
            document.getElementById('modal-estado').value = inscripcion.estadoDescripcion;
            document.getElementById('modal-usuario-modif').value = inscripcion.idUsuarioModificacion;
            document.getElementById('modal-fecha-modif').value = inscripcion.fechaHoraModificacion;

            modal.showModal(); 
        } catch (error) {
            console.error(error);
        }
    }

    if (boton.classList.contains('delete-btn')) {
        const confirmar = confirm(`¿Estás seguro de que deseas cancelar la inscripción ID: ${id}?`);
        if (!confirmar) return;

        try {
            const respuesta = await fetch(`http://localhost:3000/inscripciones/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                alert('Inscripción cancelada correctamente.');
                cargarInscripciones(); 
            } else {
                alert('No se pudo cancelar la inscripción.');
            }
        } catch (error) {
            console.error(error);
        }
    }
});

if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
        modal.close();
    });
}
