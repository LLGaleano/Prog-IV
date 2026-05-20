//Traemos el tbody para cargar los datos de los estudiantes
const tabla = document.getElementById('tbody'); 
//Recibimos los datos del usuario para hacer la busqueda
const buscadorEstudiante = document.querySelector('.buscador'); 
    

//Hice una funcion para cargar los datos para poder cargar cada busqueda que se haga
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
                    <button class="btn-accion btn-borrar data-id="${estudiante.id}""><i class="bx bx-trash"></i></button>
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

//Programando la pantalla modal de editar estudiante
const modal = document.getElementById('modal-estudiante');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const formEstudiante = document.getElementById('form-estudiante');

const abrirModal = () =>{
    modal.showModal();
}

btnCerrarModal.addEventListener('click',() =>{
    modal.close();
})

