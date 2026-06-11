/*import express from 'express';
const app = express();
const port = 3004;*/ 

document.addEventListener('DOMContentLoaded',function(){
const tabla = document.getElementById('tbody');
datos.forEach(curso => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${curso.idCurso}</td>
        <td>${curso.nombre}</td>
        <td>${curso.descripcion}</td>
        <td>${new Date(curso.fechaInicio).toLocaleDateString()}</td>
        <td>${curso.inscriptos}</td>
        <td>${curso.inscriptosMax}</td>
    `;
    tabla.appendChild(fila);
});});


const datos = [
    {
        idCurso: 1,
        nombre: "Programación IV",
        descripcion: "Backend con Node.js",
        fechaInicio: "2026-06-15",
        inscriptos: 35,
        inscriptosMax: 40
    },
    {
        idCurso: 2,
        nombre: "Base de Datos",
        descripcion: "PostgreSQL",
        fechaInicio: "2026-07-01",
        inscriptos: 20,
        inscriptosMax: 30
    }
];
/*
const respuesta = await fetch('http://localhost:3000/courses');
const datos = await respuesta.json();
*/ //ESTO VA A FUNCIONAR CUANDO ESTÉ EL BACK



