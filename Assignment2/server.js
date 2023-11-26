//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const path = require ('path');
const app = express();

app.use(session({
    secret: 'your-secret-key', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
const bodyParser = require('body-parser');
//user data
const fs = require('fs');
let filename = __dirname + '/user_data.json';
let user_reg_data;
//Define set to store logged-in users
const loggedInUsers = new Set ();

if (fs.existsSync(filename)) {
    console.log('File exists');

            let data = fs.readFileSync(filename, 'utf-8');

            user_reg_data = JSON.parse(data);

            let user_stats = fs.statSync(filename);

            let stats_size = user_stats.size;
}
//Username and password
const username = 'newuser';
user_reg_data[username] = {};
user_reg_data[username].password = 'newpass';
user_reg_data[username].email = 'newuser@user.com';
//write the users_reg_data object to user_data.json using JSON.stringify() and fs.writeFileSync()
fs.writeFileSync(filename, JSON.stringify(user_reg_data), 'utf-8');



app.use(express.urlencoded({ extended: true }));





//grabs everything from public
app.use(express.static(path.join(__dirname, 'public')));

//sets up the product array from the json file
let products = require(__dirname + '/products.json');
products.forEach( (prod,i) => {prod.total_sold = 0});










// Define a route for handling a GET request to a path that matches "./products.js"
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});
//whenever a post with proccess form is recieved
app.post("/process_form", function (request, response) {
    //get the quantities
    let qtys = request.body[`quantity_textbox`];
    //console.log(qtys);
    let valid = true;
    //set url
    let url = '';
    let soldArray =[];
    // loop through quantities
for (i in qtys) {
    // set q as the number
    let q = Number(qtys[i]);
    // call validate quantity
    if (validateQuantity(q) == '') {
        // if not enough in stock, set valid to false
        if (products[i]['qty_available'] - Number(q) < 0) {
            valid = false;
            url += `&prod${i}=${q}`;
        }
        // else, add to sold array
        else {
            soldArray[i] = Number(q);
            // add to url
            url += `&prod${i}=${q}`;
        }
    } else {
        valid = false;
        url += `&prod${i}=${q}`;
    }
}

// if there is no quantity, set valid to false
if (url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
    valid = false;
}

if (valid == false) {
    response.redirect(`products_display.html?error=true` + url);
} else {
    // store quantities in session
    request.session.qtys = soldArray;
    // Check if the user is logged in
    if (loggedInUsers.has(/* user identifier, you need a way to identify users */)) {
        // User is logged in, proceed with the purchase or redirect to invoice
        for (i in qtys) {
            // add to total sold
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('invoice.html?' + url);
    } else {
        // User is not logged in (new user), redirect to registration page
        response.redirect('/login.html');
    }
}
});












/*
//Route for login page
app.get("login", function (request, response, next) {
    const usernameParam = request.query.username || '';
    // Give a simple login form
    const str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" value="${usernameParam}"><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    //use login.html file
    response.sendFile(__dirname + "/login.html");
});
*/



app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});





app.post("/login", function (request, response) {
  
    let username_entered = request.body['username'];
    let password_entered = request.body['password'];
    request.session.loggedInUser = username_entered;
    let response_msg = '';
    let errors = false;

    // Check if username and password exist in user_reg_data
    if (typeof user_reg_data[username_entered] != 'undefined') {
        if (password_entered == user_reg_data[username_entered].password) {
            // Store the username in the session
            req.session.user = { username: req.body.username };
            // Redirect to invoice page after successful login
            response.redirect(`./invoice.html?username=${username_entered}`);
            return;
        } else {
            // Incorrect Password
            response_msg = 'Wrong username or password. Please try again.';
            errors = true;
        }
    } else {
        // Username does not exist
        response_msg = `${username_entered} does not exist`;
        errors = true;
    }

    // If there are errors, redirect to login page with error message and retained username
    if (errors) {
        // Set a session variable for the entered username
        request.session.enteredUsername = username_entered;

        setTimeout(() => {
            // Redirect to login page with error message
            response.redirect(`/login.html?error=${response_msg}`);
        }, 3000);
    }
});

// Example route to check if the user is logged in
app.get('/dashboard', (req, res) => {
  // Check if there's a user in the session
  if (req.session.user) {
    res.send(`Welcome, ${req.session.user.username}!`);
  } else {
    res.redirect('/login');
  }
});

// In your route handling code where you handle user logout
app.get("/logout", function (request, response) {
    // Destroy the session on logout
    request.session.destroy();
    response.redirect(/* wherever you want to redirect after logout */);
});





function isEmailDuplicate(email) {
    const lowerCaseEmails = Object.values(user_reg_data)
        .map(user => user.email.toLowerCase());
    return lowerCaseEmails.some(existingEmail => existingEmail === email);
}



app.post("/registration", function (request, response, next) {
    // process a simple register form
    let new_user = request.body.username;
    let new_email = request.body.email;
    let errors = false;
    let resp_msg = "";

    if (typeof user_reg_data[new_user] !== 'undefined') {
        resp_msg = `${new_user} already exists`;
        errors = true;
    }

    // Check for duplicate email
    if (isEmailDuplicate(new_email)) {
        resp_msg = resp_msg.length > 0 ? resp_msg + ' and email' : 'Email';
        resp_msg += ` already exists`;
        errors = true;
    }

    if (!errors) {
        if (request.body.password === request.body.repeat_password) {
            user_reg_data[new_user] = {
                password: request.body.password,
                email: new_email,
                name: request.body.name
            };

            fs.writeFileSync(filename, JSON.stringify(user_reg_data), 'utf-8');

            // Log in the user after registration
            loggedInUsers.add(new_user);
            response.redirect(`./invoice.html?username=${new_user}`);
            return;
        } else {
            // Store entered values in session for displaying in the form
            request.session.enteredUsername = new_user;
            request.session.enteredEmail = new_email;
            request.session.enteredName = request.body.name;
            resp_msg = `Passwords do not match`;
            errors = true;
        }
    }

    // Render the registration page with entered values and an alert message if there are errors
    resp_msg += `<script>alert("${resp_msg}"); window.location.href = "/registration.html";</script>`;
    resp_msg += `<input type="text" name="username" size="40" placeholder="enter username" value="${request.session.enteredUsername || ''}"><br />`;
    resp_msg += `<input type="password" name="password" size="40" placeholder="enter password"><br />`;
    resp_msg += `<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />`;
    resp_msg += `<input type="email" name="email" size="40" placeholder="enter email" value="${request.session.enteredEmail || ''}"><br />`;
    resp_msg += `<input type="text" name="name" size="40" placeholder="enter name" value="${request.session.enteredName || ''}"><br />`;
    response.send(resp_msg);
});


















// Route all other GET requests to serve static files from a directory named "public"

app.all('*', function (request, response, next) {
    //console.log(request.method + ' to ' + request.path);
    next();
 });

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

//function to validate the quantity
function validateQuantity(quantity){
    //console.log(quantity);
    if(isNaN(quantity)){
        return "Not a Number";
    }else if (quantity<0 && !Number.isInteger(quantity)){
        return "Negative Inventory & Not an Integer";
    }else if (quantity <0){
        return "Negative Inventory";
    }else if(!Number.isInteger(quantity)){
        return "Not an Integer";
    }else{
        return"";
    }

}

