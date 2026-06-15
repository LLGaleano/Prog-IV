// === 1. CONTROL DE ACCESO INMEDIATO (Validación de URLs) ===
if (!window.location.pathname.includes('login.html')) {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    // CASO A: Entrada forzada por URL sin estar logueado (Rebote instantáneo)
    if (!token && !refreshToken) {
        window.location.href = 'login.html';
    } 
    // CASO B: El usuario navegaba pero sus tokens ya expiraron
    else if (token) {
        const usuario = parseJwt(token);
        if (usuario && usuario.exp) {
            const tiempoActual = Math.floor(Date.now() / 1000);
            
            // Si el JWT ya venció, lo mandamos al login avisando en la URL
            if (usuario.exp < tiempoActual) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = 'login.html?sesion=expirada';
            }
        }
    }
}

// === 2. FUNCIÓN DE LOGOUT VOLUNTARIO ===
function logout() {
    mostrarToast('Cerrando sesión...', 'info');
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
}

// === 3. RENOVACIÓN DE TOKENS Y FETCH MANEJO DE 401 ===
async function renovarToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        localStorage.removeItem('token');
        window.location.href = 'login.html?sesion=expirada';
        return null;
    }

    const respuesta = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });

    if (!respuesta.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = 'login.html?sesion=expirada';
        return null;
    }

    const data = await respuesta.json();
    localStorage.setItem('token', data.accessToken);
    return data.accessToken;
}

async function fetchConAuth(url, opciones = {}) {
    let token = localStorage.getItem('token');

    opciones.headers = {
        ...opciones.headers,
        'Authorization': `Bearer ${token}`
    };

    let respuesta = await fetch(url, opciones);

    if (respuesta.status !== 401) {
        return respuesta;
    }

    token = await renovarToken();

    if (!token) {
        return respuesta;
    }

    opciones.headers = {
        ...opciones.headers,
        'Authorization': `Bearer ${token}`
    };

    respuesta = await fetch(url, opciones);
    return respuesta;
}

// === 4. MANEJO DE INTERFAZ ===
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) return;

    const token = localStorage.getItem('token');
    if (token) {
        const usuario = parseJwt(token);
        if (usuario) {
            const spanUsuario = document.getElementById('usuarioLogueado');
            if (spanUsuario) {
                spanUsuario.textContent = usuario.nombre_usuario;
            }
        }
    }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});