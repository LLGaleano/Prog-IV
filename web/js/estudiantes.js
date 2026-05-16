const tabla = document.getElementById('tbody');
const buscadorEstudiante = document.querySelector('.buscador');
    

//Hice una funcion para cargar los datos para poder cargar cada busqueda que se haga
const llenarTabla = (datos) =>{
    tabla.innerHTML = ''; 
    // Llenamos la tabla con los datos
    if(!Array.isArray(datos)){
        tabla.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error del servidor al buscar.</td></tr>';
        return;
    }
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
        // Usamos nombres genéricos por si las columnas de la BD cambian
        fila.innerHTML = `
                <td>${estudiante.id || estudiante.id_estudiante || '-'}</td>
                <td>${estudiante.documento || estudiante.documento_estudiante || "-"}</td>
                <td>${estudiante.apellido || '-'}</td>
                <td>${estudiante.nombres || '-'}</td>
                <td>${estudiante.email || '-'}</td>
                <td>${new Date(estudiante.fecha_nacimiento).toLocaleDateString()}</td>
                <td><span class="${classEstado}">${textoEstado}</td>
                <td>
                    <button class="btn-accion"><i class="bx bx-show"></i></button>
                    <button class="btn-accion"><i class="bx bx-edit-alt"></i></button>
                    <button class="btn-accion"><i class="bx bx-trash"></i></button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    //esto es lo que estaba antes para cargar los datos de base, usando la funcion de antes
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

//aca esta el estudiante, mande un fetch
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