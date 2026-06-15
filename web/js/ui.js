const mostrarToast = (mensaje, tipo = 'exito') => {

    const toast = document.createElement('div');
    toast.className = `toast-notificacion ${tipo}`;

    const icono =
        tipo === 'exito'
            ? 'bx-check-circle'
            : tipo === 'error'
                ? 'bx-error-circle'
                : 'bx-log-out-circle';

    toast.innerHTML = `
        <i class="bx ${icono}" style="font-size: 1.25rem;"></i>
        <span>${mensaje}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, tipo === 'error' ? 5000 : 3000);
};