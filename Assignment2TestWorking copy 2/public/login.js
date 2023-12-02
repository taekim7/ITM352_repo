//login.js
let params = (new URL(document.location)).searchParams;

//when window loads, perform following:
window.onload = function() {
    if (params.has('loginError')) {
        document.getElementById('errorMessage').innerText = params.get('loginError');
        
    }
    document.getElementById('email').value = params.get('email');
}