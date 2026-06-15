const iniciar = () => {
   
    flatpickr("#fechaInicio", {
        locale: "es",                  
        dateFormat: "Y-m-d",          
        altInput: true,               
        altFormat: "d/m/Y",             
        disableMobile: "true"          
    });

    
    const envio = document.getElementById("btnGuardar");
    if (envio) {
        envio.addEventListener("click", async (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            const obj = {
                nombre: document.getElementById("nombre").value,
                descripcion: document.getElementById("descripcion").value,
                fechaInicio: document.getElementById("fechaInicio").value,
                cantidadHoras: document.getElementById("cantidadHoras").value,
                cantidadInscriptos: document.getElementById("cantidadInscriptos").value
            };

            console.log("Datos del nuevo curso:", obj);
        });
    }
};

verificarSesion();
document.addEventListener('DOMContentLoaded', iniciar);