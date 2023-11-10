//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();


// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/
const products = require(__dirname + './products.json');

// Define a route for handling a GET request to a path that matches "./products.js"
app.get('./products.js', function(request, response, next) {
	// Send the response as JS
	response.type('.js');
	
	// Create a JS string (products_str) that contains data loaded from the products.json file
	// Convert the JS string into a JSON string and embed it within variable products
	const products_str = `let products = ${JSON.stringify(products)};`;
	
	// Send the string in response to the GET request
	response.send(products_str);
});

//added just now
app.use(express.urlencoded({ extended: true }));


//Process form
app.post("/process_form", function (request, response) {
    let receipt = '';
    for (let i in products) {
        let qtys = Number(request.body[`quantity_textbox${i}`]); // Convert to a number here
        let q = qtys; // No need for q = Number(qtys[i])
        console.log("the quantity value is " + q);
        let validationMessage = validateQuantity(q);
        let brand = products[i]['name'];
        let brand_price = products[i]['price'];
        if (validateQuantity(q) === "") {
            products[i]['total_sold'] += q; // Use 'q' here
            receipt += `<h3>Thank you for purchasing: ${q} ${brand}. Your total is \$${q * brand_price}!</h3>`;
        } else {
            receipt += `<h3><font color="red">${q} is not a valid quantity for ${brand}!<br>${validationMessage}</font></h3>`;
        }
    }
    response.send(receipt);
    response.end();
});

// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
 });

 // Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

//Validating Quantity
function validateQuantity (quantity) {
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
		default:
			errorMessage = ""; //No errors
			break;
	}
  
	return errorMessage;
  }

let params = (new URL(document.location)).searchParams;
let q = Number(params.get('quantity'));
let error = params.get('error');
//if error, alert user
if (error) {
	alert(error);
	}
  // Loop through the products and generate the HTML for each product
  const form = document.getElementById('productForm');
let formHTML = ''; //blank content of form to add to it

//write a loop to print product information and then add quantity text input box for every element of the product array
for (let i in products) {
	formHTML += `img src = "${products[i]["image"]}">`;
    formHTML += `<h3>${products[i]["name"]} at \$${products[i]["price"]} (${products[i]["total_sold"]} sold)</h3>`;
    formHTML += `<label for="qty_textbox${i}">Quantity Desired:</label>
    <input type = "text" name = "quantity_textbox${i}" name = "quantity_textbox[${i}]" onkeyup = "checkQuantityTextbox(this);">
    <span id = "quantity_textbox[${i}]_message">Enter a quantity</span><br>
`;
}
form.innerHTML = formHTML;
