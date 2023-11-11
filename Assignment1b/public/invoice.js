//receipt.js



function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get the receipt parameter from the URL
var receiptContent = getParameterByName('receipt');

// Display the receipt content
document.getElementById('receiptContent').innerHTML = receiptContent;



//get products from product.js
const products = getProducts();


// Variables for subtotal, tax, shipping charge, and total
let subtotal = 0;
let taxRate = 0.04;
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;



// Calculate shipping
if (subtotal <= 200) {
  shippingCharge = 15;
} else if (subtotal <= 400) {
  shippingCharge = 20;
} else {
  shippingCharge = subtotal * 0.04;
}

// Calculate total with shipping
taxAmount = subtotal * taxRate;
total = subtotal + taxAmount + shippingCharge;

// Setting total cell
document.getElementById('total_cell').innerHTML = `$${total.toFixed(2)}`;
// Setting subtotal, tax, and total cells
document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
document.getElementById('tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
document.getElementById('shipping_cell').innerHTML = '$' + shippingCharge.toFixed(2);

// Validate Quantity
function validateQuantity(quantity) {
  if (isNaN(quantity)) {
    return "Not a number";
  } else if (quantity < 0 && !Number.isInteger(quantity)) {
    return "Negative Inventory and not an integer";
  } else if (quantity < 0) {
    return "Negative Inventory";
  } else if (!Number.isInteger(quantity)) {
    return "Not an integer";
  } else {
    return "";
  }
}

// Function to generate table rows and apply quantity validation
function generateItemRows() {
  let table = document.getElementById('invoiceTable');
  table.innerHTML = '';
  let hasErrors = false;

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let itemQuantity = quantity[product.quantityIndex];

    let validationMessage = validateQuantity(itemQuantity);
    if (validationMessage !== "") {
      hasErrors = true;
      let row = table.insertRow();
      row.insertCell(0).innerHTML = product.name;
      row.insertCell(1).innerHTML = validationMessage;
    } else if (itemQuantity > 0) {
      let extendedPrice = product.price * itemQuantity;
      subtotal += extendedPrice;

      let row = table.insertRow();
      row.insertCell(0).innerHTML = product.name;
      row.insertCell(1).innerHTML = itemQuantity;
      row.insertCell(2).innerHTML = '$' + product.price.toFixed(2);
      row.insertCell(3).innerHTML = '$' + extendedPrice.toFixed(2);
    }
  }

  // If no error, display total
  if (!hasErrors) {
    document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
  }
}
