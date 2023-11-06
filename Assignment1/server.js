// Importing the Express.js framework 
let express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
let app = express();



// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));
app.get('/api/products', (req, res) => {
   //read product from products.json
   let products = require('./products.json');
   res.json(products);
});
// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));





//Validating Quantity
function validateQuantity (quantity) {
   if (isNaN(quantity)) {
   return "Not a number";
   }else if (quantity < 0 && !Number.isInteger(quantity)) {
   return "Negative Inventory and not an integer";
   }else if (quantity <0){
   return "Negative Inventory";
   }else if (!Number.isInteger(quantity)){
   return "not an integer";
   }else {
   return "";
   }
   }