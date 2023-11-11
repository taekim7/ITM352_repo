//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();


// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

//app.get for test was executed
app.get('/test', function(req, res){
	res.send('app.get for test was executed');
	console.log('app.get for test was executed');
})
/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/
let products = require(__dirname + '/products.json');

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



// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
 });




 // Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));


// Process form
app.post("/process_form", function (request, response) {
	let receipt = '';
    // Assuming products is an array of items with a corresponding index
    for (let i in products) {
        let qty = Number(request.body[`quantity_textbox${i}`]); // Corrected the variable name to qty
        console.log("the quantity value is " + qty);
        let validationMessage = validateQuantity(qty, products[i]["qty_available"]);
        let brand = products[i]['name'];
        let brand_price = products[i]['price'];
        
        if (validationMessage === "") {
            products[i]['total_sold'] += qty;
            invoice += `<h3>Mahalo! Enjoy your: ${qty} ${brand}. Your total is \$${qty * brand_price}!</h3>`;
        } else {
            invoice += `<h3><font color="red">${qty} is not a valid quantity for ${brand}!<br>${validationMessage}</font></h3>`;
        }
    }
    // Redirect to the invoice page
    //response.redirect(`/invoice.html`);
	response.redirect(`/invoice.html?receipt=${encodeURIComponent(receipt)}`);
});

// Validation function
function validateQuantity(quantity, maxQuantity) {
    let errorMessage = "";
  
    if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
        errorMessage = "Invalid quantity. Please enter a non-negative integer quantity to order.";
    } else if (quantity > maxQuantity) {
        errorMessage = `Quantity exceeds the available stock (${maxQuantity}). Please enter a valid quantity to order.`;
    }

    return errorMessage;
}

//Get request to invoice
app.get('/invoice.html', function(request, response, next) {
	const invoiceContent = request.query.invoice;
	response.send(invoiceContent);
});



/*
//Process form
app.post("/process_form", function (request, response) {
    let invoice = '';
    for (let i in products) {
        let qtys = Number(request.body[`quantity_textbox${i}`]); // Convert to a number here
        let q = qtys; // No need for q = Number(qtys[i])
        console.log("the quantity value is " + q);
        let validationMessage = validateQuantity(q);
        let brand = products[i]['name'];
        let brand_price = products[i]['price'];
        if (validateQuantity(q) === "") {
            products[i]['total_sold'] += q; // Use 'q' here
            invoice += `<h3>Mahalo! Enjoy your: ${q} ${brand}. Your total is \$${q * brand_price}!</h3>`;
        } else {
            invoice += `<h3><font color="red">${q} is not a valid quantity for ${brand}!<br>${validationMessage}</font></h3>`;
        }
    }
	//redirect to invoice page (chatgpt)
    response.redirect('./public/invoice.html');
});
*/
