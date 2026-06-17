const iniciar = () => {
   
    flatpickr("#fechaInicio", {
        locale: "es",                  
        dateFormat: "Y-m-d",          
        altInput: true,               
        altFormat: "d/m/Y",             
        disableMobile: "true"          
    });

    const envio = document.getElementById("btnGuardar");
    const errorDiv = document.getElementById("error");

    const btnCancelar = document.querySelector('.btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener("click", (evt) => {
            evt.preventDefault();
            window.location.href = 'cursos.html'; 
        });
    }

    if (envio) {
        envio.addEventListener("click", async (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            errorDiv.style.display = 'none';
            errorDiv.innerHTML = '';

            const obj = {
                nombre: document.getElementById("nombre").value.trim(),
                descripcion: document.getElementById("descripcion").value.trim(),
                fecha_inicio: document.getElementById("fechaInicio").value,
                cantidad_horas: parseInt(document.getElementById("cantidadHoras").value),
                inscriptos_max: parseInt(document.getElementById("cantidadInscriptos").value),
                id_curso_estado: 1 
            };


            console.log("Enviando al servidor:", JSON.stringify(obj));

            if (!obj.nombre || !obj.descripcion || !obj.fecha_inicio || obj.cantidad_horas <= 0 || obj.inscriptos_max <= 0) {
                errorDiv.textContent = "Por favor, complete todos los campos con valores válidos.";
                errorDiv.style.display = 'block';
                return; 
            }

            try {
                const respuesta = await fetchConAuth('http://localhost:3000/cursos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                });

                const data = await respuesta.json();

                if (respuesta.ok) {
                    // si sale bien volvemos a la pantalla principal
                    mostrarToast('¡Curso creado con éxito!');
                    
                    setTimeout(() => {
                        window.location.href = 'cursos.html';
                    }, 1500);
                } else {
                    // si el backend rebota mostramos porque
                    errorDiv.style.display = 'block';
                    
                    if (data.errors) {
                        const mensajes = data.errors.map(err => `<li>${err.msg}</li>`).join('');
                        errorDiv.innerHTML = `<ul style="margin:0; padding-left:20px;">${mensajes}</ul>`;
                    } else if (data.error) {
                        errorDiv.textContent = data.error;
                    } else {
                        errorDiv.textContent = 'Ocurrió un error inesperado al guardar el curso.';
                    }
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
                errorDiv.textContent = 'Error de red. Verifique que el servidor esté encendido.';
                errorDiv.style.display = 'block';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', iniciar);