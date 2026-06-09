// ELEMENTOS DEL DOM
const tabla = document.getElementById('tbody'); 
const buscadorEstudiante = document.querySelector('.buscador'); 
const modal = document.getElementById('modal-estudiante'); 
const formEstudiante = document.getElementById('form-estudiante');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

// Función para llenar la tabla con los datos del DTO (camelCase)
const llenarTabla = (objetoRespuesta) => {
    tabla.innerHTML = ''; 
    
    // Extraemos el array del campo 'data' según la estructura unificada de la API
    const listaEstudiantes = objetoRespuesta.data;

    if (!Array.isArray(listaEstudiantes)) {
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error de consistencia en el formato de datos.</td></tr>';
        return;
    }
    
    if (listaEstudiantes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No se encontraron estudiantes activos con esa búsqueda.</td></tr>';
        return;
    }

    listaEstudiantes.forEach(estudiante => {
        const fila = document.createElement('tr');
        
        // Mapeamos el color y texto usando la propiedad 'activo' del DTO (1 o 0)
        const classEstado = estudiante.activo === 1 ? 'estado-activo' : 'estado-inactivo';
        const textoEstado = estudiante.activo === 1 ? 'Activo' : 'Inactivo';

        // Adaptamos el casteo de la fecha de nacimiento eliminando descalces de huso horario local
        let fechaFormateada = '-';
        if (estudiante.fechaNacimiento) {
            const [anio, mes, dia] = estudiante.fechaNacimiento.split('-');
            fechaFormateada = `${dia}/${mes}/${anio}`;
        }

        // IMPORTANTE: Leemos las claves mapeadas por el DTO en camelCase (idEstudiante)
        fila.innerHTML = `
            <td>${estudiante.idEstudiante || '-'}</td>
            <td>${estudiante.documento || "-"}</td>
            <td>${estudiante.apellido || '-'}</td>
            <td>${estudiante.nombres || '-'}</td>
            <td>${estudiante.email || '-'}</td>
            <td>${fechaFormateada}</td>
            <td><span class="${classEstado}">${textoEstado}</span></td>
            <td>
                <button class="btn-accion btn-ver" data-id="${estudiante.idEstudiante}"><i class="bx bx-show"></i></button>
                <button class="btn-accion btn-editar" data-id="${estudiante.idEstudiante}"><i class="bx bx-edit-alt"></i></button>
                <button class="btn-accion btn-borrar" data-id="${estudiante.idEstudiante}"><i class="bx bx-trash"></i></button>
            </td>
        `;
        tabla.appendChild(fila);
    });
};

// Carga inicial al inicializar el árbol DOM
document.addEventListener('DOMContentLoaded', async function() {
    if (!tabla) return;
    try {
        const respuesta = await fetch('http://localhost:3000/students');
        const objetoRespuesta = await respuesta.json();
        llenarTabla(objetoRespuesta);
        console.log("¡Datos de estudiantes cargados exitosamente!");
    } catch (error) {
        console.error("Error al traer los datos", error);
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error de conexión al cargar los datos de estudiantes.</td></tr>';
    }
});

// Evento de escucha en el buscador conectado al endpoint dinámico
buscadorEstudiante.addEventListener('keyup', async (evento) => {
    const texto = evento.target.value.trim();
    try {
        // Ejecutamos la búsqueda simultánea por Apellido y Documento mediante los Query Params de la cátedra
        const respuesta = await fetch(`http://localhost:3000/students?apellido=${texto}&documento=${texto}`);
        const objetoRespuesta = await respuesta.json();
        llenarTabla(objetoRespuesta);
    } catch (error) {
        console.error("Error al buscar:", error);
    }
});

// Delegación de eventos en la tabla para Acciones (BREAD)
tabla.addEventListener('click', async (evento) => {
    const botonEliminar = evento.target.closest('.btn-borrar');
    const botonEditar = evento.target.closest('.btn-editar');
    const botonVer = evento.target.closest('.btn-ver');

    if (botonEliminar) {
        const idEstudiante = botonEliminar.dataset.id;
        const confirmacion = confirm('¿Está seguro de que desea dar de baja de forma lógica a este estudiante?');
        if (!confirmacion) return;

        try {
            const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`, {
                method: 'DELETE'
            });
            
            if (respuesta.ok) {
                alert('Estudiante dado de baja correctamente (Soft Delete aplicado).');
                const res = await fetch('http://localhost:3000/students');
                const objetoRespuesta = await res.json();
                llenarTabla(objetoRespuesta);
            } else {
                alert('Error al intentar dar de baja al estudiante.');
            }
        } catch (error) {
            console.error("Error en el DELETE:", error);
            alert("Fallo de conexión con el servidor.");
        }
    }
        
    const botonPresionado = botonEditar || botonVer;
    if (botonPresionado) {
        const idEstudiante = botonPresionado.dataset.id;
        
        try {
            const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`);
            if (respuesta.ok) {
                const estudiante = await respuesta.json();
                
                // Cargamos los elementos de la modal usando las claves de respuesta en camelCase
                document.getElementById('modal-id').value = estudiante.idEstudiante;
                document.getElementById('modal-dni').value = estudiante.documento;
                document.getElementById('modal-nombres').value = estudiante.nombres;
                document.getElementById('modal-apellido').value = estudiante.apellido;
                document.getElementById('modal-email').value = estudiante.email;
                
                if (estudiante.fechaNacimiento) {
                    document.getElementById('modal-fecha').value = estudiante.fechaNacimiento;
                }
                
                const tituloModal = document.getElementById('modal-titulo');
                const btnGuardar = document.getElementById('btn-guardar-modal');
                const inputs = formEstudiante.querySelectorAll('input');
                
                if (botonVer) {
                    tituloModal.innerText = "Detalles del Estudiante";
                    btnGuardar.classList.add('oculto');
                    inputs.forEach(input => input.disabled = true);
                } else {
                    tituloModal.innerText = "Editar Estudiante";
                    btnGuardar.classList.remove('oculto');
                    inputs.forEach(input => input.disabled = false);
                }
                modal.showModal();
            } else {
                alert("No se pudieron recuperar los detalles del registro.");
            }
        } catch (error) {
            console.error("Error al traer detalles:", error);
            alert("Fallo de conexión con el servidor.");
        }
    }
});
    
// Actualización vía PUT al enviar los cambios desde el modal
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
            const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estudianteActualizado) 
            });

            if (respuesta.ok) {
                alert('¡Estudiante modificado exitosamente!');
                modal.close(); 
                const res = await fetch('http://localhost:3000/students');
                const objetoRespuesta = await res.json();
                llenarTabla(objetoRespuesta);
            } else {
                const errorBackend = await respuesta.json();
                // Mostramos el mensaje detallado que configuramos en los controles de unicidad
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