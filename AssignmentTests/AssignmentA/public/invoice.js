//invoice.js


//Product Data
const params = (new URL (document.location)).searchParams;
let quantity = [];
//let q = Number(params.get('quantity'));
let error = params.get('error');

//if (error){
//  alert(error);
//}

for (let i = 0; i < products.length; i++) {
  let quantityValue = params.get(`quantity_textbox${i}`);
  console.log(quantityValue);
  if (quantityValue !== null){
    quantity[i] = Number(quantityValue);
   
  }
}



//Variables for subtotal, tax, shipping charge, and total
let subtotal = 0;
let taxRate = 0.04;
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;

generateItemRows();

if (subtotal <= 300) {
  shippingCharge = 5;
} else if (subtotal <= 600) {
  shippingCharge = 10;
} else {
  shippingCharge = subtotal * 0.04;
}

//Calculate total with shipping
taxAmount = subtotal * taxRate;
total = subtotal + taxAmount + shippingCharge;


//Setting subtotal, tax, and total cells
document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
document.getElementById('tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
document.getElementById('shipping_cell').innerHTML = '$' + shippingCharge.toFixed(2);
document.getElementById('total_cell').innerHTML = `$${total.toFixed(2)}`;

//I tried a different method..but it didn't work
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
  

//function to generate table rows and apply quantity validation
function generateItemRows() {
  let table = document.getElementById('invoiceTable');
  table.innerHTML = '';
  let hasErrors = false;
  
  for (let i = 0; i < products.length; i++) {
    let item = products[i];
    let itemQuantity = quantity[item.quantityIndex];

    let validationMessage = validateQuantity(itemQuantity);
    if (validationMessage !== "") {
      hasErrors = true;
      let row = table.insertRow();
      row.insertCell(0).innerHTML = item.name;
      row.insertCell(1).innerHTML = validationMessage;
    } else if (itemQuantity > 0) {
      let extendedPrice = item.price * itemQuantity;
      subtotal += extendedPrice;

      let row = table.insertRow();
      row.insertCell(0).innerHTML = item.name;
      row.insertCell(1).innerHTML = itemQuantity;
      row.insertCell(2).innerHTML = '$' + item.price.toFixed(2);
      row.insertCell(3).innerHTML = '$' + extendedPrice.toFixed(2);
    }
    }
    //if no error, display total
    if (!hasErrors){
      document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
    }
  }
