//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

const qs = require('querystring');

// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/
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



// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
 });


/////////////////////////////////////////////////////////////////////////////Process Form Stuff////////////////////////////////////////////////////////////////////////////////////
 // Handle form submissions
app.post("/process_form", function (request, response) {
  // Get textbox inputs as an array
  let qtys = request.body[`quantity_textbox`];
  // Initially set the validity check to true
  let valid = true;
  // Initialize an empty string to hold the URL parameters
  let url = '';
  let soldArray = [];

  // Iterate over each quantity
  for (let i in qtys) {
      // Convert the quantity to a number
      let q = Number(qtys[i]);

      // Check if the quantity is valid
      if (validateQuantity(q) === '') {
          // Check if buying this quantity would result in a negative inventory
          if (products[i]['qty_available'] - q < 0) {
              valid = false;
              url += `&prod${i}=${q}`;
          }
          // If not, update total_sold and subtract from available quantity
          else {
              soldArray[i] = q;
              url += `&prod${i}=${q}`;
          }
      }
      // If the quantity is not valid, set validity to false
      else {
          valid = false;
          url += `&prod${i}=${q}`;
      }
  }

  // Check if no products were bought
  if (url === `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
      valid = false;
  }

  // If validity is false, redirect to the store with an error parameter
  if (valid === false) {
      response.redirect(`store.html?error=true` + url);
  }
  // Otherwise, redirect to the invoice with the URL parameters attached
  else {
      // Update total_sold and quantity available for each product
      for (let i in qtys) {
          products[i]['total_sold'] += soldArray[i];
          products[i]['qty_available'] -= soldArray[i];
      }
      response.redirect('invoice.html?' + url);
  }
});


 // Start the server; listen on port 8080 for incoming HTTP requests
 app.listen(8080, () => console.log(`listening on port 8080`));















// Validate Quantity
function validateQuantity(quantity, maxQuantity) {
    let errorMessage = "";

    switch (true) {
        case isNaN(quantity):
            errorMessage = "Not a number. Please enter a non-negative quantity to order.";
            break;
        case quantity <= 0 && !Number.isInteger(quantity):
            errorMessage = "Negative inventory and not an Integer. Please enter a non-negative quantity to order.";
            break;
        case quantity <= 0:
            errorMessage = "Negative inventory. Please enter a non-negative quantity to order.";
            break;
        case !Number.isInteger(quantity):
            errorMessage = "Not an Integer. Please enter a non-negative quantity to order.";
            break;
        case quantity > maxQuantity:
            errorMessage = `Quantity exceeds the available stock (${maxQuantity}). Please enter a valid quantity.`;
            break;
        default:
            errorMessage = ""; // No errors
            break;
    }

    return errorMessage;
}