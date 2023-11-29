// login.js

let params = (new URL(document.location)).searchParams;

window.onload = function () {
    if (params.has('loginError')) {
        document.getElementById('errorMessage').innerText = params.get('loginError');
        alert(params.get('loginError'));
    }

    // Set the value of the username input field
    document.getElementById('usernameInput').value = params.get('username');
};