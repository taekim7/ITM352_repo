//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

const qs = require('querystring');


// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
 });


/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/

// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

 // Start the server; listen on port 8080 for incoming HTTP requests
 app.listen(8080, () => console.log(`listening on port 8080`));

 let products = require(__dirname + '/products.json');

for (i in products) {
  products.forEach( (prod,i) => {prod.total_sold = 0});
}

    
// Define a route for handling a GET request to a path that matches "./products.js"
app.get('/products.js', function(request, response, next) {
	// Send the response as JS
	response.type('.js');
	// Create a JS string (products_str) that contains data loaded from the products.json file
	// Convert the JS string into a JSON string and embed it within variable products
	const products_str = `let products = ${JSON.stringify(products)};`;
	// Send the string in response to the GET request
	response.send(products_str);
});

app.use(express.urlencoded({ extended: true }));





/////////////////////////////////////////////////////////////////////////////Process Form Stuff////////////////////////////////////////////////////////////////////////////////////
 app.post("/process_form", function (request, response) {
  //Extract content of request's body
  let POST = request.body;
  //Assume input boxes are all initially empty
  let has_qty = false;
  //create object to store error messages for each product's quantity input
  let errorObject = {};


    // Loop through the products
    for (let i in products) {
      let qty = POST[`quantity_textbox${i}`];
      console.log(qty);
      has_qty = has_qty || (qty > 0);

      //validate using the udpdated validateQuantity function
      let errorMessages = validateQuantity(qty, products [i].qty_available);
  
      // Validate quantity
      if (errorMessages.length > 0) {
        errorObject[`qty${i}_error`] = errorMessages.join(', ');
      }
    }

    //If all input boxes are empty and there are no errors
    if (has_qty == false && Object.keys(errorObject).length == 0) {
      //redirect to products pages with "error" parameter in url
      response.redirect("./products_display.html?error");
    }
  
    //if there is an input and there are no errors
    else if (has_qty == true && Object.keys(errorObject).length ==0) {
      //update product quantities and redirect to invoice page with valid data
      for (let i in products){
        let qty = POST[`qty${i}`];
        //update quantities
        products[i].qty_sold += Number(qty);
        products[i].qty_available = products[i].qty_available - qty;
      }
      //redirect to invoice page with valid data in url
      response.redirect("./invoice.html?valid&" + qs.stringify(POST));
    }
    //If there is an input error 
    else if (Object.keys(errorObject).length > 0) {
      //redirect to products page with "inputErr" parameter in url
      response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
    }
  });


// Function to validate quantity
function validateQuantity(quantity, availableQuantity) {
  let errors = [];

  quantity = Number(quantity); 

  switch (true) {
    case isNaN(quantity) || quantity === '':
        errors.push("Not a number. Please enter a non-negative quantity to order.");
        break;
    case quantity < 0 && !Number.isInteger(quantity):
        errors.push("Negative inventory and not an Integer. Please enter a non-negative quantity to order.");
        break;
    case quantity < 0:
        errors.push("Negative inventory. Please enter a non-negative quantity to order.");
        break;
    case quantity !=0 && !Number.isInteger(quantity):
        errors.push("Not an Integer. Please enter a non-negative quantity to order.");
        break;
    case quantity > availableQuantity:
        errors.push(`Quantity exceeds the available stock (${availableQuantity}). Please enter a valid quantity.`);
        break;
    default:
        errors = [];
        break;
  }
  return errors;
}
