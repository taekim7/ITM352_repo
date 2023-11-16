//invoice.js
//Product Data
const params = (new URL (document.location)).searchParams;

// On load, if there is no 'valid' key, redirect the user back to the Home page
window.onload = function() {
  if (!params.has('valid')) {
    console.error("No 'valid' parameter detected. Redirecting to Home.");
      document.write(`<head><link rel="stylesheet" href="invoice.css"></head><body style="text-align: center; margin-top: 10%;"><h2>ERROR: No form submission detected.</h2><h4>Return to <a href="products_display.html">Home</a></h4> </body>`)
  }
}


//Variables for subtotal, tax, shipping charge, and total
let subtotal = 0;
let extended_price;
let shipping;
let shipping_display;
let total;

let qty = [];
for (let i in products) {
    qty.push(params.get(`qty${i}`));
}

for (let i in qty) {
    if (qty[i] == 0 || qty[i] == '') continue;

    extended_price = (params.get(`qty${i}`) * products[i].price).toFixed(2);
    subtotal += Number(extended_price);

    document.querySelector('#invoice_table').innerHTML += `
        <tr style="border: none;">
            <td width="10%"><img src="${products[i].image}" alt="${products[i].alt}" class="invoice-img"></td>
            <td>${products[i].name}</td>
            <td>${qty[i]}</td>
            <td>${products[i].qty_available}</td>
            <td>$${products[i].price.toFixed(2)}</td>
            <td>$${extended_price}</td>
        </tr>
    `;
}




//Tax Rate
let tax_rate = 0.04;
let tax_amt = subtotal * tax_rate;


//Shipping Charge
if (subtotal < 300) {
  shipping = 5;
  shipping_display = `$${shipping.toFixed(2)}`;
  total = Number(tax_amt + subtotal + shipping);
} else if (subtotal >= 300 && subtotal < 500) {
  shipping = 10;
  shipping_display = `$${shipping.toFixed(2)}`;
  total = Number(tax_amt + subtotal + shipping);
} else {
  shipping = 0;
  shipping_display = 'FREE';
  total = Number(tax_amt + subtotal + shipping);
}


document.querySelector('#total_display').innerHTML += `
    <tr style="border-top: 2px solid black;">
        <td colspan="5" style="text-align:center;">Sub-total</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Tax @ ${Number(tax_rate) * 100}%</td>
        <td>$${tax_amt.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Shipping</td>
        <td>${shipping_display}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;"><b>Total</td>
        <td><b>$${total.toFixed(2)}</td>
    </tr>
`;

/*
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
  */
