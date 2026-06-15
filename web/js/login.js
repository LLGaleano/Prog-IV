document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const errorDiv = document.getElementById('error');
    
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
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.error || 'Error al iniciar sesión';
            return;
        }
    
        localStorage.setItem('token', data.accessToken);
        //localStorage.setItem('refreshToken', data.refreshToken);
    
        window.location.href = 'index.html';
    
    } catch (error) {
        console.error(error);
    
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'No fue posible conectar con el servidor';
    }
    
    });

    const mostrarToast = (mensaje, tipo = 'exito') => {
        const toast = document.createElement('div');
        toast.className = `toast-notificacion ${tipo}`;
        
        const icono = tipo === 'exito' ? 'bx-check-circle' : 'bx-info-circle';
        toast.innerHTML = `<i class="bx ${icono}" style="font-size: 1.25rem;"></i> <span>${mensaje}</span>`;
        
        document.body.appendChild(toast);
    
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };
    