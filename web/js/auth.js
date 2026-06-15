function logout() {

    mostrarToast(
        'Cerrando sesión...',
        'info'
    );

    setTimeout(() => {

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

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

async function renovarToken() {

    const refreshToken =
        localStorage.getItem('refreshToken');

    if (!refreshToken) {
        logout();
        return null;
    }

    const respuesta = await fetch(
        'http://localhost:3000/auth/refresh',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        }
    );

    if (!respuesta.ok) {
        logout();
        return null;
    }

    const data = await respuesta.json();

    localStorage.setItem(
        'token',
        data.accessToken
    );

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

function verificarSesion() {

    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token && !refreshToken) {
        window.location.href = 'login.html';
    }

}

document.addEventListener('DOMContentLoaded', () => {

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


//const token = localStorage.getItem('token');