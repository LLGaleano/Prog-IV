/// ELEMENTOS DEL DOM (Los dejamos acá arriba para no repetirlo en cada función)
const tabla = document.getElementById('tbody'); 
const buscadorEstudiante = document.querySelector('.buscador'); 
const ventanaEdicion = document.getElementById('ventanaEditar'); 
const formEditarAlumno = document.getElementById('formEditarAlumno');
const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');



//Función para llenar la tabla con los datos recibidos de la API
const llenarTabla = (datos) =>{
    tabla.innerHTML = ''; 
    // Si no es un array, mostramos un error
    if(!Array.isArray(datos)){
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error del servidor al buscar.</td></tr>';
        return;
    }
    // Si el array está vacío, mostramos un mensaje de que no se encontraron resultados
    if(datos.length === 0){
        tabla.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No se encontraron estudiantes con esa búsqueda.</td></tr>';
        return;
    }
    //llenamos la tabla con los datos
    datos.forEach(estudiante => {
        const fila = document.createElement('tr');
        let classEstado = '';
        let textoEstado = '';
        if( estudiante.activo===1){
            classEstado = 'estado-activo';
            textoEstado = 'Activo';
        } else{
            classEstado = 'estado-inactivo';
            textoEstado = 'Inactivo';
        }
        fila.innerHTML = `
                <td>${estudiante.id       || '-'}</td>
                <td>${estudiante.documento|| "-"}</td>
                <td>${estudiante.apellido || '-'}</td>
                <td>${estudiante.nombres  || '-'}</td>
                <td>${estudiante.email    || '-'}</td>
                <td>${new Date(estudiante.fecha_nacimiento).toLocaleDateString()}</td>
                <td><span class="${classEstado}">${textoEstado} </span></td>
                <td>
                    <button class="btn-accion btn-ver" data-id="${estudiante.id}"><i class="bx bx-show"></i></button>
                    <button class="btn-accion btn-editar" data-id="${estudiante.id}"><i class="bx bx-edit-alt"></i></button>
                    <button class="btn-accion btn-eliminar" data-id="${estudiante.id} "><i class="bx bx-trash"></i></button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    //al cargar la pagina, traemos los datos de la api y los mostramos en la tabla
document.addEventListener('DOMContentLoaded', async function() {
    if(!tabla) return;
    try{
        const respuesta = await fetch('http://localhost:3000/students');
        const datos = await respuesta.json();
        llenarTabla(datos);
        console.log("¡Datos de estudiantes cargados exitosamente!");
    } catch(error){
        console.error("Error al traer los datos",error);
    }
})

//Agregamos un evento al buscador para que cada vez que se escriba algo, se haga una consulta a la api y se muestren los resultados
buscadorEstudiante.addEventListener('keyup', async(evento) =>{
    const texto = evento.target.value;
    try{
        const respuesta = await fetch(`http://localhost:3000/students?buscar=${texto}`);
        const datos = await respuesta.json();
        llenarTabla(datos);
    } catch(error){
        console.error("Error al buscar", error);
    }
})


//Funcion para editar o eliminar un estudiante.
tabla.addEventListener('click',async (evento) => {
    const botonEliminar = evento.target.closest('.btn-eliminar');
    const botonEditar = evento.target.closest('.btn-editar');

    if (botonEliminar) {
        // Sacamos el ID del estudiante del dataset del botón
        const idEstudiante = botonEliminar.dataset.id;

        // fetch DELETE
        try {
                const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`, {
                    method: 'DELETE'
                });
                
                if (respuesta.ok) {
                    alert('Estudiante dado de baja correctamente.');
                    // Disparamos una nueva consulta para que la tabla se recargue sola
                    const res = await fetch('http://localhost:3000/students');
                    const datosActualizados = await res.json();
                    llenarTabla(datosActualizados);
                } else {
                    alert('Error al intentar dar de baja al estudiante en la base de datos.');
                }
            } catch (error) {
                console.error("Error en el DELETE:", error);
                alert("Fallo de conexión con el servidor.");
            }
        
        }
        
    // fetch PUT para editar un estudiante
    if (botonEditar) {
        const idEstudiante = botonEditar.dataset.id;
        console.log("¡Clic en Editar! El ID del estudiante es:", idEstudiante);
        
        // Editar: Primero hacemos un GET para traer los datos actuales de ese estudiante y llenar el formulario del modal
        try {
        const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`,)
        if (respuesta.ok) {
            const estudiante = await respuesta.json();
                document.getElementById('editId').value          = estudiante.id ;
                document.getElementById('editDocumento').value   = estudiante.documento ;
                document.getElementById('editNombres').value     = estudiante.nombres;
                document.getElementById('editApellido').value    = estudiante.apellido;
                document.getElementById('editEmail').value       = estudiante.email;
                if (estudiante.fecha_nacimiento) {
                    //Devuelve una fecha como un valor de cadena en formato ISO. "2004-02-15T00:00:00.000Z"
                    const fechaLimpia = new Date(estudiante.fecha_nacimiento).toISOString().split('T')[0];
                    document.getElementById('editFechaNac').value = fechaLimpia;
                }
                document.getElementById('editActivo').value      = estudiante.activo;
                ventanaEdicion.showModal();
                } else {
                alert("No se pudieron cargar los datos de este estudiante.");
            }
            
        } catch (error) {
            console.error("Error al traer los datos:", error);
            alert("Fallo de conexión con el servidor.");
        }
    }
    });
    
    // Agregamos un evento al formulario para que al enviar los cambios, se haga un fetch PUT a la API

if (formEditarAlumno) {
    formEditarAlumno.addEventListener('submit', async (evento) => {
        // Frenamos la recarga de la página
        evento.preventDefault(); 
        const idEstudiante = document.getElementById('editId').value;

        // Armamos el JSON con los valores que el usuario acaba de ingresar
        const estudianteActualizado = {
            documento: document.getElementById('editDocumento').value,
            nombres: document.getElementById('editNombres').value,
            apellido: document.getElementById('editApellido').value,
            email: document.getElementById('editEmail').value,
            fecha_nacimiento: document.getElementById('editFechaNac').value,
            activo: parseInt(document.getElementById('editActivo').value) 
        };
        //Enviamos con el put a la API
        try {
            const respuesta = await fetch(`http://localhost:3000/students/${idEstudiante}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estudianteActualizado) 
            });

            if (respuesta.ok) {
                alert('¡Estudiante actualizado con éxito!');
                ventanaEdicion.close(); 
                const res = await fetch('http://localhost:3000/students');
                const datosActualizados = await res.json();
                llenarTabla(datosActualizados);
            } else {
                alert('Hubo un problema al actualizar los datos en el servidor. ');
            }
        } catch (error) {
            console.error("Error en el PUT:", error);
            alert("Error de conexión al intentar guardar los cambios.");
        }
    });
}

// Evento para el boton cancelar
if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener('click', () => {
        if (ventanaEdicion) ventanaEdicion.close();
    });
}

