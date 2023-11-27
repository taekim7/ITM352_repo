//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

app.use(express.urlencoded({ extended: true }));

//grabs everything from public
app.use(express.static(__dirname + '/public'));

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
    //loop through quantities
    for (i in qtys) { 
        //set q as the number
        let q = Number(qtys[i]);
        //call validate quantity
        if (validateQuantity(q)=='') {
            //if not enough in stock, set valid to false
            if(products[i]['qty_available'] - Number(q) < 0){
                valid = false;
                url += `&prod${i}=${q}`
            }
            //else, add to sold array
            else{
                soldArray[i] = Number(q);
                //add to url
                url += `&prod${i}=${q}`
            }
        }
        //if not a number, set valid to false
         else {
            valid = false;
            url += `&prod${i}=${q}`
        }
        //if there is no quantity, set valid to false
        if(url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`){
            valid = false
        }
    }
    //if not valid, redirect back
    if(valid == false)
    {
        response.redirect(`products_display.html?error=true` + url);
    }
    //else, redirect to invoice
    else{
         for (i in qtys)
        {
            //add to total sold
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('invoice.html?' + url);
    }
 });













 //app.post("/process_login", function (request, response) {
    //retrieve the request.body and perform server-side validation on the credentials the user provided
        /*Example Validations:
        If email and password fields are both empty
        If email matches with an existing one in user_data
        If password entered matches with the stored password
        If password entered did not match with the stored password
        If email does not exist in user_data
        */
       //If there are input errors, redirect the user back to the login page
       //To make textboxes sticky, append and send their entered email back (do not send password throught the url)
       //Also send their selected quantities back
       //let params = new URLSearchParams(request.body).toString();
      // response.redirect(`./login.html?{params.toString()}`);
       //If there are no input errors, redirect the user to the invoice page
       //To make textboxes sticky, append and send their entered email back (do not send password throught the url)
       //Also send their selected quantities back
       //response.redirect(`./invoice.html?{params.toString()}`);
// }); 









app.post("/process_login", function (request, response) {
    // Retrieve the request.body and perform server-side validation on the credentials the user provided
    const email = request.body.email;
    const password = request.body.password;

    // Example Validations:
    let errors = [];

    // If email and password fields are both empty
    if (!email && !password) {
        errors.push("Please enter both email and password.");
    } else {
        // Check if the email matches an existing one in user_data
        const user = user_data[email];
        if (!user) {
            errors.push("Invalid email or password.");
        } else {
            // Check if the password entered matches with the stored password
            if (user.password !== password) {
                errors.push("Invalid email or password.");
            }
        }
    }
    // If there are input errors, redirect the user back to the login page
    // To make textboxes sticky, append and send their entered email back (do not send the password through the URL)
    // Also, send their selected quantities back
    if (errors.length > 0) {
        let params = new URLSearchParams({
            error: true,
            email: email,  // Sending back entered email
            // Add other parameters for selected quantities if needed
        }).toString();
        response.redirect(`./login.html?${params}`);
    } else {
        // If there are no input errors, redirect the user to the invoice page
        // To make textboxes sticky, append and send their entered email back (do not send password through the URL)
        // Also, send their selected quantities back
        let params = new URLSearchParams({
            email: email,  // Sending back entered email
            // Add other parameters for selected quantities if needed
        }).toString();
        response.redirect(`./invoice.html?${params}`);
    }
});










 //app.post("/process_register", function (request, response) {
    //Retrieve the request.body and perform server-side validation on the information the user provided.

    /*Example Validations:
    Name Validation: input is between 2 and 30 characters and only contains letter characters
    Email Validation: email is not blank and is in email format (starts with sequence of characters, followed by @, ending with domain), email is not already registered to another user
    Password Validation: password is not blank and is between 8 and 30 characters, has at least 1 lower case letter, 1 upper case letter, 1 number, and 1 special character
    Confirm Password Validation: password and confirm password are the same
    */
    
   //If there are input errors, redirect the user back to the registration page
   //To make textboxes sticky, append and send their entered email back (do not send password throught the url).
   //Also send their selected quantities back
   //let params = new URLSearchParams(request.body).toString();
   //response.redirect(`./register.html?{params.toString()}`);

   //If no input errors, redirect the user to invoice page
   //Also, append their selected quantities back
   //response.redirect(`./invoice.html?{params.toString()}`);
 //});
 







 app.post("/process_register", function (request, response) {
    // Retrieve the request.body and perform server-side validation on the information the user provided.

    /* Example Validations:
    Name Validation: input is between 2 and 30 characters and only contains letter characters
    Email Validation: email is not blank and is in email format (starts with a sequence of characters, followed by @, ending with domain), email is not already registered to another user
    Password Validation: password is not blank and is between 8 and 30 characters, has at least 1 lower case letter, 1 upper case letter, 1 number, and 1 special character
    Confirm Password Validation: password and confirm password are the same
    */

    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    // Example Validations
    let errors = [];

    // Name Validation
    if (!/^[a-zA-Z]{2,30}$/.test(name)) {
        errors.push("Name should be between 2 and 30 characters and only contain letters.");
    }

    // Email Validation
    if (!/^.+@.+\..+$/.test(email)) {
        errors.push("Please enter a valid email address.");
    } else {
        // Check if the email is not already registered to another user
        const existingUser = user_data[email];
        if (existingUser) {
            errors.push("This email is already registered. Please choose another.");
        }
    }

    // Password Validation
    if (!/^.{8,30}$/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z\d]/.test(password)) {
        errors.push("Password should be between 8 and 30 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.");
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
        errors.push("Password and confirm password do not match.");
    }

    // If there are input errors, redirect the user back to the registration page
    // To make textboxes sticky, append and send their entered email back (do not send the password through the URL)
    // Also, send their selected quantities back
    if (errors.length > 0) {
        let params = new URLSearchParams({
            error: true,
            name: name,  // Sending back entered name
            email: email,  // Sending back entered email
            // Add other parameters for selected quantities if needed
        }).toString();
        response.redirect(`./register.html?${params}`);
    } else {
        // If no input errors, redirect the user to the invoice page
        // Also, append their selected quantities back
        let params = new URLSearchParams({
            name: name,  // Sending back entered name
            email: email,  // Sending back entered email
            // Add other parameters for selected quantities if needed
        }).toString();
        response.redirect(`./invoice.html?${params}`);
    }
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