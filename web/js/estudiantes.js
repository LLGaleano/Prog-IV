document.addEventListener('DOMContentLoaded', async function() {
    const tabla = document.getElementById('tbody');

    // Si no encuentra la tabla, no ejecutamos nada para evitar errores
    if (!tabla) return; 

    try {
        // Pedimos los datos al Back-end
        const respuesta = await fetch('http://localhost:3000/students');
        const datos = await respuesta.json();

        // Limpiamos la tabla
        tabla.innerHTML = ''; 

        // Llenamos la tabla con los datos
        datos.forEach(estudiante => {
            const fila = document.createElement('tr');
            
            // Usamos nombres genéricos por si las columnas de la BD cambian
            fila.innerHTML = `
                <td>${estudiante.id || estudiante.id_estudiante || '-'}</td>
                <td>${estudiante.documento || estudiante.documento_estudiante || "-"}</td>
                <td>${estudiante.apellido || '-'}</td>
                <td>${estudiante.nombres || '-'}</td>
                <td>${estudiante.email || '-'}</td>
            `;
            tabla.appendChild(fila);
        });
        console.log("¡Datos de estudiantes cargados exitosamente!");
        
    } catch (error) {
        console.error("Error al traer los datos:", error);
        tabla.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar datos. Verifica que el servidor (Node) esté encendido.</td></tr>';
    }
});