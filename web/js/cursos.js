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
});

async function cargarCursos(page) {
    try {
        const respuesta = await fetchConAuth(`http://localhost:3000/cursos?page=${page}&limit=20`);

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
                    <td><button style="cursor:pointer;"><i class='bx bx-search'></i></button></td>
                `;

                tabla.appendChild(fila);
            });
            
            document.getElementById('info-paginacion').textContent = `Página ${paginaActual} de ${totalPaginas}`;

            //Se deshabilitan los botones si ya no hay
            document.getElementById('btn-ant').disabled = (paginaActual === 1);
            document.getElementById('btn-sig').disabled = (paginaActual === totalPaginas);
        }
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
    }
}