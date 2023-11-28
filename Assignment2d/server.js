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





let temp_user = {}; //temp storage for user inputs to be passed along. Slide 10




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
            temp_user [`qty${i}`]= POST[`qty${i}`];
            /* Move to after invoice purchase button is pushed
            //add to total sold
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
            */

        }
        let params = new URLSearchParams(temp_user);
        response.redirect(`./login.html? ${params.toString()}`);
    }
 });


 //Assignment 2 Starts here
let user_data;
const fs = require ('fs');
const filename = __dirname + 'user_data.json';
if (fs.existsSync(filename)) {
  let data = fs.readFileSync(filename, "utf8");
  user_data = JSON.parse(data);
  console.log(user_data);
} else {
    console.log (`${filename} does not exist`);
    user_data = {};
}





//Process login
app.post("/process_login", function (request, response) {
//Requesting the body of the request (id and pw)
let POST = request.body;
let entered_username = POST['username'].toLowerCase;
let entered_password = POST['password'];

if (entered_username.length == 0 && entered_password.length == 0){
    request.query.loginError = 'Username and Password cannot be empty';    
} else if (user_data[entered_username]){
    if (user_data[entered_username].password == entered_password){
        temp_user['username'] = entered_username;
        temp_user['name'] = user_date[entered_username].name;
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

}
);







app.post ('/continue_shopping', function (request, response) {
    let params = new URLSearchParams(temp_user);
    response.redirect('./products_display.html?{params.toString()}');
});


app.post ('/purchase_logout', function (request, response) {

    for (let i in products){
        //have to get quantity sold from the temp user
    products[i]['total_sold'] += soldArray[i]; //Number(temp_user[`qty${i}`]);
    products[i]['qty_available'] -= soldArray[i]; //products[i].qty_available - Number(temp_user[`qty${i}`]);
    }

    fs.writeFile(__dirname +'products.json', JSON.stringify(products), 'utf-8', (error) => {
        if (error) {
            console.log('Error updating products data');
        } else {
            console.log('Products data updated successfully');
        }
    })
});
//remove user info from temp user
delete temp_user['username'];
delete temp_user['name'];

response.redirect('./products_display.html');




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




