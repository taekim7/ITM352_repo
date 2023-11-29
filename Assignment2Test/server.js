//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();
const qs = require ('querystring');
app.all('*', function (request, response, next) {
    //console.log(request.method + ' to ' + request.path);
    next();
 });

 //grabs everything from public
app.use(express.static(__dirname + '/public'));

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

//sets up the product array from the json file
let products = require(__dirname + '/products.json');


// Define a route for handling a GET request to a path that matches "./products.js"
app.get("/products.js", function (request, response, next) {
    response.type('.js');
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});


app.use(express.urlencoded({ extended: true }));

//function to validate the quantity
function validateQuantity(quantity, availableQuantity){
    //console.log(quantity);
    let errors = [];
    quantity = Number(quantity);

    switch (true) {
        case isNaN(quantity) || quantity == '':
            errors.push("Not a number. Please enter non-negative quantity");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Not an integer. Please enter non-negative quantity");
            break;
        case quantity < 0:
            errors.push("Negative quantity. Please enter non-negative quantity");
            break;
        case quantity !=0 && !Number.isInteger(quantity):
            errors.push("Not an integer. Please enter an integer");
            break;
        case quantity > availableQuantity:
            errors.push("Not enough items in stock");
            break;
    }
    return errors;
}



//------------------------------Assigntment 2-----------------------------//
let user_data;

const fs = require ('fs');
const filename = __dirname + '/user_data.json';
console.log(`Resolved file path`, filename);

if (!fs.existsSync(filename)){
    let data = fs.readFileSync(filename, 'utf8');
    user_data = JSON.parse(data);
    console.log(user_data);
} else {
    console.log(`${filename} does not exist`);
    user_data = {};
}

let temp_user={}; //temp storage for user inputs to be passed along

/*
//add qty_sold variable for each product
for (let i in products){
    products.forEach((prod, i) => {prod.qty_sold = 0});
}
*/

//===========================App Post Purchase Form==========================//
app.post("/process_purchase", function (request, response,) {
//extract content of request's body
let POST = request.body;
//assuming input box are empty
let has_qty = false;
//creating object to store error message for each input
let errorObject = {};

//iterating through each input
for (let i in products) {
    let qty = POST[`qty${i}`];
    has_qty = has_qty || (qty > 0);

    let errorMessages = validateQuantity(qty, products[i].qty_available);

    //store error messages
    if (errorMessages.length > 0) {
        errorObject[`qty${i}`] = errorMessages.join(', ');
    }
}
//if all input boxes are empty with no error
if (has_qty == false && Object.keys(errorObject).length == 0) {
    //redirect to products_display with error in url
    response.redirect("./products_display.html");
} else if (has_qty == true && Object.keys(errorObject).length == 0) {
    //update quantities and redirect to invoice
    for (let i in products) {
        temp_user = POST [`qty${[i]}`];

        console.log(temp_user);

        /*
        //update quantity sold and available
        products[i].qty_sold += Number(qty);
        products[i].qty_available = products[i].qty_available - qty;
        */

    }
    //redirect to invoice page
    let params = new URLSearchParams(temp_user);
    response.redirect(`./login.html?${params.toString()}`);
}
//If there is an error
else if (Object.keys(errorObject).length > 0) {
    response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
}
});
    



//===========================App Post Login Form==========================//
app.post("/process_login", function (request, response) {
    let POST = request.body;
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];

    if(entered_email.length == 0 && entered_password.length == 0){
        response.query.loginError = 'Please enter email and password';
    } else if (user_data[entered_email]) {
        if (user_data[entered_email].password == entered_password) {
            temp_user['email'] = entered_email;
            temp_user['name'] = user_data[entered_email].name;

            console.log(temp_user);

            let params = new URLSearchParams(temp_user);
            response.redirect(`./invoice.html?valid&${params.toString()}`);
            return;
    } else if (entered_password == 0) {
        request.query.loginError = 'Please enter password';
    } else {
        request.query.loginError = 'Incorrect password';
    } 
    } else {
        request.query.loginError = 'Incorrect email';
    }
    request.query.email = entered_email;
    let params = new URLSearchParams(request.query);
    response.redirect (`./login.html?${params.toString()}`);
});




