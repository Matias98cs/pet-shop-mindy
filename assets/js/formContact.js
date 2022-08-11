//querySelector
const formulario = document.querySelector('#formularioContacto');

formulario.addEventListener('submit', e => {
    e.preventDefault();

    Swal.fire(
        'Mensaje Enviado!',
        'Has enviado un mensaje!',
        'success'
        )
    
    formulario.reset()
})