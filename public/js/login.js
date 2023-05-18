const loginButton = document.querySelector('.login');
const username = document.querySelector('#username');
const password = document.querySelector('#password');


loginButton.addEventListener('click', () => {
    console.log("clicked")
    window.location.href += `savecache?username=${username.value}&password=${password.value}`
})