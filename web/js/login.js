document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarToast(
                data.error || 'Usuario o contraseña incorrectos',
                'error'
            );
            return;
        }

        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        mostrarToast(
            'Inicio de sesión correcto',
            'exito'
        );

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error(error);

        mostrarToast(
            'No fue posible conectar con el servidor',
            'error'
        );
    }
});

