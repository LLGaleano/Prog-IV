// ESCUCHADOR DE CARGA: Verificamos si venimos de una redirección por expiración
document.addEventListener('DOMContentLoaded', () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    
    if (parametrosURL.get('sesion') === 'expirada') {
        // Mostramos tu toast original de ui.js
        mostrarToast('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'info');
        
        // Limpiamos la URL para que no quede el "?sesion=expirada" feo si el usuario recarga la página
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// TU FORMULARIO DE LOGIN ORIGINAL (Queda exactamente igual)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarToast(data.error || 'Usuario o contraseña incorrectos', 'error');
            return;
        }

        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        mostrarToast('Inicio de sesión correcto', 'exito');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error(error);
        mostrarToast('No fue posible conectar con el servidor', 'error');
    }
});

