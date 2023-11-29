//server.js

// Importing the Express.js framework 
const { isUtf8 } = require('buffer');
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



 //----------------------Assignment 2 Stuff-----------------------//
 /*
 let user_data;
 const fs = require ('fs');
 const filename = __dirname + '/user_data.json';
 if (fs.existsSync(filename)) {
   let data = fs.readFileSync(filename, 'utf8');
   user_data = JSON.parse(data);
   console.log(user_data);
 } else {
     console.log (`${filename} does not exist`);
     user_data = {};
 }
*/
const fs = require('fs').promises;

let user_data;

(async () => {
    const filename = __dirname + '/user_data.json';
    try {
        const data = await fs.readFile(filename, 'utf8');
        user_data = JSON.parse(data);
        console.log(user_data);
    } catch (error) {
        console.log(`${filename} does not exist`);
        user_data = {};
    }
})();




//-----------------------------temp user-----------------------------//
let temp_user = {}; //temp storage for user inputs to be passed along. Slide 10




//-----------------------------Process Form -----------------------------//
app.post("/process_form", function (request, response) {
    // Get the quantities
    let qtys = request.body[`quantity_textbox`];
    let valid = true;
    let url = '';
    let soldArray = [];

    // Loop through quantities
    //for (i in qtys) {
        for (let i = 0; i < qtys.length; i++) {
        let q = Number(qtys[i]);
        console.log(`Quantity for prod${i}: ${q}`);
        // Call validate quantity
        //if (validateQuantity(q) == '') {
            if (!isNaN(q) && validateQuantity(q) === '') {
            if (products[i]['qty_available'] - Number(q) < 0) {
                valid = false;
                url += `&prod${i}=${q}`;
            } else {
                soldArray[i] = Number(q);
                url += `&prod${i}=${q}`;
            }
        } else {
            valid = false;
            url += `&prod${i}=${q}`;
        }

        // If there is no quantity, set valid to false
        //if (url == `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
        if (isNaN(q) || url === `&prod0=&prod1=&prod2=&prod3=&prod4=&prod5=`) {
            valid = false;
        }
    }

   // Log quantities and temp_user information
   console.log('Quantities from form:', qtys);
   console.log('Temp_user before update:', temp_user);

   // Add this line to see the final value of 'valid'
    console.log('Is valid:', valid);
    // If not valid, redirect back

    //if (valid == false) {
        if (!valid) {
        response.redirect(`products_display.html?error=true` + url);
    } else {
        // Check if the user is logged in
        if (userIsLoggedIn(request)) {
            // User is logged in, redirect to invoice page
            response.redirect('/invoice.html');
        } else {
            // User not logged in, redirect to login page with temp_user parameters
            for (let i in qtys) {
                let qtyKey = `qty${i}`;
                temp_user[qtyKey] = request.body[qtyKey];
                products[i]['total_sold'] += soldArray[i];
                products[i]['qty_available'] -= soldArray[i];
                console.log(`Updated temp_user:`, temp_user);
            }
    
            let params = new URLSearchParams(temp_user);
            console.log(`redirecting to login with temp_user:`, temp_user);
            response.redirect(`/login.html?${params.toString()}`);
        }
    }
});


function userIsLoggedIn(request) {
    // Check if 'username' and 'password' properties exist in request.body
    if ('username' in request.body && 'password' in request.body) {
        const entered_username = request.body['username'].toLowerCase();
        const entered_password = request.body['password'];

        return user_data[entered_username] && user_data[entered_username].password === entered_password;
    }

    return false;
}









//------------------------------Process login------------------------------//
app.post("/process_login", function (request, response) {
    // Requesting the body of the request (id and pw)
    let POST = request.body;
    let entered_username = POST['username'].toLowerCase();
    let entered_password = POST['password'];

    if (entered_username.length == 0 && entered_password.length == 0) {
        request.query.loginError = 'Username and Password cannot be empty';
    } else if (user_data[entered_username]) {
        if (user_data[entered_username].password == entered_password) {
            temp_user['username'] = entered_username;
            temp_user['name'] = user_data[entered_username].name;
            console.log(temp_user);

            let params = new URLSearchParams(temp_user);

            response.redirect(`./invoice.html?valid=${params.toString()}`);
            return;
        } else if (entered_password == 0) {
            request.query.loginError = 'Password cannot be blank';
        } else {
            request.query.loginError = 'Incorrect Password';
        }
    } else {
        request.query.loginError = 'Username does not exist';
    }

    request.query.username = entered_username;
    let params = new URLSearchParams(request.query);

    response.redirect(`./login.html?=${params.toString()}`);
});




//------------------------------Process Register-----------------------------//
app.post("/process_register", function (request, response) {
    // Retrieve user input from the request body
    let username = request.body.username;
    let password = request.body.password;
    let email = request.body.email;
    let name = request.body.name;

    // Add user data to the user_data object
    user_data[username] = {
        password: password,
        email: email,
        name: name
    };

    // Save user_data to the file
    fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (error) => {
        if (error) {
            console.log('Error updating user data');
        } else {
            console.log('User data updated successfully');
        }
    });
    // Direct to invoice page when successfully registered
    response.redirect('./invoice.html');
});



//------------------------------Continue Shopping---------------------------//
app.post ('/continue_shopping', function (request, response) {
    let params = new URLSearchParams(temp_user);
    response.redirect('./products_display.html?{params.toString()}');
});

//-----------------------------purchase logout-----------------------------//
app.post ('/purchase_logout', function (request, response) {

    for (let i in products) {
        // have to get quantity sold from the temp user
        products[i]['total_sold'] += Number(temp_user[`qty${i}`]);
        products[i]['qty_available'] -= Number(temp_user[`qty${i}`]);
    }

    fs.writeFile(__dirname +'/products.json', JSON.stringify(products), 'utf-8', (error) => {
        if (error) {
            console.log('Error updating products data');
        } else {
            console.log('Products data updated successfully');
        }
    })

//remove user info from temp user
delete temp_user['username'];
delete temp_user['name'];

response.redirect('./products_display.html');
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




