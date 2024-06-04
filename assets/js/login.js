import { getUsuarios } from './peticiones/getUsuarios.js';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    
    try {
        const usuarios = await getUsuarios();

        let validUser = usuarios.find(user => user.usuario === username && user.contraseña === password);
        if (validUser) {

            localStorage.setItem('loggedIn', true);
            window.location.href = 'index.html';
        } else {

            document.getElementById('loginMessage').textContent = 'Nombre de usuario y/o contraseña incorrectos. Pruebe otra vez.';
        }
    } catch (error) {

        document.getElementById('loginMessage').textContent = 'Error. Inténtelo de nuevo más tarde.';
    }
    
});