//=================================================server.js======================================================//

// Import required modules
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = 8080;

// The 'bodyParser' middleware parses the request body and makes it available on the 'req.body' property
app.use(bodyParser.urlencoded({ extended: true }));


// Enable parsing of JSON request bodies
app.use(bodyParser.json());

// Routes for Jersey products
app.get('/jersey', (req, res) => {
    // Handle rendering of the jersey products page
    res.sendFile(path.join(__dirname, 'public', 'jersey.html'));
  });

  // Routes for Golf products
app.get('/golf', (req, res) => {
    // Handle rendering of the golf products page
    res.sendFile(path.join(__dirname, 'public', 'golf.html'));
  });

  

// Initialize an empty array to store cart data
// This variable will be used to keep track of the items in the user's shopping cart
let cart = [];

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Enable session handling
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Load products data from 'products.json' file
let products = require(__dirname + '/products.json');

// Declare a variable to store user data
let user_data;

// Define the path to the user data file
const filename = __dirname + '/user_data.json';

// Check if the user data file exists
if (fs.existsSync(filename)) {
    // Read the user data from the file
    let data = fs.readFileSync(filename, 'utf8');
    user_data = JSON.parse(data);
    console.log(user_data);
} else {
    console.log(`${filename} does not exist`);
    user_data = {};
}

// Middleware to handle all requests
app.all('*', function (request, response, next) {
    next();
});

// Start the server
app.listen(port, () => console.log(`listening on port ${port}`));

// Serve the 'products.js' file
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

// Handle the 'process_purchase' POST request
app.post("/process_purchase", function (request, response) {
    const { productType, productName, price, quantity } = request.body;
    let POST = request.body;
    console.log("Received from data:", POST);

    let has_qty = false;
    let errorObject = {};


    if (productType === 'jersey') {
        addToCart(cart, 'jersey', productName, price, quantity);
      } else if (productType === 'golf') {
        addToCart(cart, 'golf', productName, price, quantity);
      } else if (productType === 'shoe') {
        addToCart(cart, 'shoe', productName, price, quantity);
        
      }


    // Function to add items to the cart
    function addToCart(cart, productType, productName, price, quantity) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(product => product.name === productName && product.type === productType);
  
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      // Add the product to the cart
      cart.push({
        type: productType,
        name: productName,
        price: price,
        quantity: quantity
      });
    }
  }

    // Validate the quantity for each product
    for (let i in products) {
        let qty = POST[`qty${[i]}`];
        has_qty = has_qty || (qty > 0);

        let errorMessage = validateQuantity(qty, products[i].qty_available);

        if (errorMessage.length > 0) {
            errorObject[`qty${[i]}_error`] = errorMessage.join(', ');
        }
    }

    // Redirect based on the validation results
    if (has_qty == false && Object.keys(errorObject).length == 0) {
        response.redirect("./products_display.html?error");
    } else if (has_qty == true && Object.keys(errorObject).length == 0) {
        // Store the quantities in the session and redirect to the login page
        for (let i in products) {
            request.session[`qty${[i]}`] = POST[`qty${[i]}`];
        }

        response.redirect(`./login.html`);
    } else if (Object.keys(errorObject).length > 0) {
        response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputError`);
    } else {
        if (has_qty == false) {
            response.redirect("./products_display.html?" + qs.stringify(POST) + `&error`);
        }
    }
});




app.post('/process_login', (request, response) => {
    // Extract the email and password from the request body
    let POST = request.body;
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];

    // Check if both email and password are empty
    if (entered_email.length == 0 && entered_password.length == 0) {
        // Set an error message in the session
        request.session.loginError = 'Please enter email and password';

        // Redirect to the login page with the query parameters from the request
        response.redirect(`./login.html?${qs.stringify(request.query)}`);
        return;
    }

    // Check if the entered email exists in the user_data object
    if (user_data[entered_email]) {
        // Extract the stored salt and hash from the user_data object
        const [storedSalt, storedHash] = user_data[entered_email].password.split(':');

        // Generate the hash of the entered password using the stored salt
        const enteredHash = crypto.pbkdf2Sync(entered_password, storedSalt, 10000, 512, 'sha256').toString('hex');

        // Check if the entered hash matches the stored hash
        if (enteredHash === storedHash) {
            // Set the email and name in the session
            request.session.email = entered_email;
            request.session.name = user_data[entered_email].name;

            // Redirect to the invoice page with a "valid" query parameter
            response.redirect(`./invoice.html?valid`);
            return;
        } else {
            // Set an error message in the session
            request.session.loginError = 'Incorrect password';
        }
    } else {
        // Set an error message in the session
        request.session.loginError = 'Incorrect email';
    }

    // Set the entered email in the session
    request.session.email = entered_email;

    // Create a new URLSearchParams object with the query parameters
    let params = new URLSearchParams(request.query);

    // Redirect to the login page with the query parameters
    response.redirect(`./login.html?${params.toString()}`);
});

app.post("/continue_shopping", function (request, response) {
    // Redirect to the products display page
    response.redirect(`/products_display.html`);
});

app.post("/purchase_logout", function (request, response) {
    // Update the quantity sold and available for each product
    for (let i in products) {
        products[i].qty_sold += Number(request.session[`qty${[i]}`]);
        products[i].qty_available = products[i].qty_available - Number(request.session[`qty${[i]}`]);
    }

    // Write the updated products object to the products.json file
    fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (error) => {
        if (error) {
            console.log('error updating products', error);
        } else {
            console.log('File written successfully. Products are updated.');
        }
    });

    // Remove the email and name from the session
    delete request.session.email;
    delete request.session.name;

    // Redirect to the products display page
    response.redirect('./products_display.html');
});




// Define an endpoint for the "/process_register" route with a POST method
app.post("/process_register", function (request, response) {
    // Extract the values from the request body
    let reg_name = request.body.name;
    let reg_email = request.body.email.toLowerCase();
    let reg_password = request.body.password;
    let reg_confirm_password = request.body.confirm_password;

    // Validate the confirm password field
    validateConfirmPassword(reg_password, reg_confirm_password);

    // Validate the password field
    validatePassword(reg_password);

    // Validate the email field
    validateEmail(reg_email);

    // Validate the name field
    validateName(reg_name);

    // Check if there are no registration errors
    if (Object.keys(registration_errors).length == 0) {
        // Encrypt the password
        const encryptedPassword = encryptPassword(reg_password);

        // Create a new user in the user_data object
        user_data[reg_email] = {};
        user_data[reg_email].name = reg_name;
        user_data[reg_email].password = encryptedPassword;

        // Write the user_data object to a JSON file
        fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (error) => {
            // Check if there was an error while writing the file
            if (error) {
                console.log('error updating user_data', error);
            } else {
                console.log('File written successfully. User data is updated.');

                // Set the email and name in the session
                request.session.email = reg_email;
                request.session.name = reg_name;

                // Redirect the user to the invoice.html page with query parameters
                response.redirect(`/invoice.html?regSuccess&valid`);
            }
        });
    } else {
        // Remove the password and confirm_password fields from the request body
        delete request.body.password;
        delete request.body.confirm_password;

        // Redirect the user to the register.html page with query parameters
        response.redirect(`/register.html?${qs.stringify(request.body)}&${qs.stringify(registration_errors)}`);
    }
});

// Function to validate if the confirm password matches the password
function validateConfirmPassword(password, confirm_password) {
    // Remove any previous error for confirm password
    delete registration_errors['confirm_password_type'];

    // Compare the confirm password with the password
    if (confirm_password !== password) {
        // If they don't match, set an error message in the registration_errors object
        registration_errors['confirm_password_type'] = 'Passwords do not match';
    }
}

// Function to encrypt the password
function encryptPassword(password) {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Use pbkdf2Sync to hash the password with the salt
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha256').toString('hex');

    // Return the salt and hash concatenated with a colon
    return `${salt}:${hash}`;
}

// Function to validate the password
function validatePassword(password) {
    // Check if the password length is between 10 and 16 characters
    if (password.length < 10 || password.length > 16) {
        // If not, set an error message in the registration_errors object
        registration_errors.password_error = "Password must be between 10 and 16 characters.";
    } else if (/\s/.test(password)) {
        // Check if the password contains any spaces
        // If it does, set an error message in the registration_errors object
        registration_errors.password_error = "Password cannot contain spaces.";
    }
}

// Function to validate the email
function validateEmail(email) {
    // Define a regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
        // If not, set an error message in the registration_errors object
        registration_errors.email_error = "Invalid email format.";
    }
}

// Function to validate the name
function validateName(name) {
    // Define a regular expression for name validation
    const nameRegex = /^[a-zA-Z\s]+$/;

    // Check if the name matches the regular expression
    if (!nameRegex.test(name)) {
        // If not, set an error message in the registration_errors object
        registration_errors.name_error = "Invalid name format.";
    }
}

// This function validates the quantity input by the user against the available quantity in stock.
// If there are any validation errors, they will be stored in an array and returned at the end.

function validateQuantity(quantity, availableQuantity) {
    let errors = []; // Initialize an empty array to store validation errors

    quantity = Number(quantity); // Convert the quantity input to a number

    // Use a switch statement to check for different validation conditions
    switch (true) {
        case isNaN(quantity) || quantity === '':
            // If the quantity is not a number or is an empty string, add an error message to the array
            errors.push("Not a number. Please enter non-negative quantity");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            // If the quantity is a negative number and not an integer, add an error message to the array
            errors.push("Not an integer. Please enter non-negative quantity");
            break;
        case quantity < 0:
            // If the quantity is a negative number, add an error message to the array
            errors.push("Negative quantity. Please enter non-negative quantity");
            break;
        case quantity > availableQuantity:
            // If the quantity is greater than the available quantity, add an error message to the array
            errors.push("Not enough items in stock");
            break;
    }

    return errors; // Return the array of validation errors
}
