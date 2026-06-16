const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');

/**
 * Genera un Buffer PDF con los diplomas masivos de un curso.
 * @param {Object} curso - Objeto con los datos del curso (nombre, cantidad_horas)
 * @param {Array} alumnos - Array de objetos de los estudiantes inscritos
 */
async function generarDiplomasMasivosPDF(curso, alumnos) {
    // 1. Buscamos el archivo HTML que creamos en el Paso 1
    // Ajustá la ruta según dónde guardaste tu carpeta de templates
    const templatePath = path.join(__dirname, '../templates/diploma.html');
    const htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // 2. Compilamos el HTML con Handlebars
    const templateCompiled = handlebars.compile(htmlTemplate);
    
    // 3. Le pasamos el objeto con toda la data dinámica
    const htmlFinal = templateCompiled({
        curso_nombre: curso.nombre,
        curso_horas: curso.cantidad_horas,
        fecha_actual: new Date().toLocaleDateString('es-AR'),
        alumnos: alumnos // El array que iterará el HTML
    });

    // 4. Levantamos el navegador headless de Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Parámetros limpios de seguridad
    });
    
    const page = await browser.newPage();
    
    // Seteamos el HTML ya procesado con los nombres
    await page.setContent(htmlFinal, { waitUntil: 'networkidle0' });

    // 5. Imprimimos el PDF en formato A4 horizontal (Landscape)
    const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true, // Obligatorio para que salgan los bordes y colores CSS
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    // 6. Cerramos el navegador y retornamos el archivo binario (Buffer)
    await browser.close();
    return pdfBuffer;
}

module.exports = { generarDiplomasMasivosPDF };