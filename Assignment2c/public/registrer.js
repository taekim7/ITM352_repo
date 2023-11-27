document.forms['register_form'].addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get entered values
    let username = document.forms['registration_form']['username'].value;
    let password = document.forms['registration_form']['password'].value;
    let repeatPassword = document.forms['registration_form']['repeat_password'].value;
    let email = document.forms['registration_form']['email'].value;
    let name = document.forms['registration_form']['name'].value;

    // Perform basic validation...
    // (You can still perform client-side validation for better user experience)

    try {
        const response = await fetch('/process_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword: repeatPassword
            })
        });

        const data = await response.json();

        // Check if there are errors
        if (data.error) {
            // Handle errors (e.g., display error messages, make textboxes sticky)
            console.error(data.errors);
        } else {
            // Registration successful, redirect to the invoice page
            window.location.href = `/invoice.html?${new URLSearchParams(data).toString()}`;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        // Handle unexpected errors
    }
});