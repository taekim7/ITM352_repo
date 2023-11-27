//login.js


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the entered username and password
        var username = document.getElementById("usernameInput").value;
        var password = document.getElementById("passwordInput").value;

        // Check if the username exists in the user_data.json file
        if (!(username in user_reg_data)) {
            alert("Username does not exist. Please sign up for a new account with us!");
            return;
        }

        // Check if the entered password matches the stored password for the username
        if (user_reg_data[username].password !== password) {
            alert("Username or Password does not exist. Please try again.");
            return;
        }

        // If username and password are valid, you can proceed with further actions (e.g., redirect to another page)
        alert("Login successful! Redirecting...");

        // Perform any additional actions, such as redirecting to another page
        window.location.href = "./invoice.html";
    });
});