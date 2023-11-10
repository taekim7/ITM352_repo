//products_display.js

//declare and push to the DOM the store name at top and bottom
const store_name="Cool Shoe Store";
top_title.innerHTML=(store_name);
//send store name infor to the footer title
bottom_title.innerHTML=("Wear History. It's cool.");


/*
//Product information
let products = [
  {
    "name": "Jordan 1 OG BRED",
    "image": "./images/bred1.webp",
    "price": 400.0,
    "qty_available": 10
  },
  {
    "name": "Jordan 4 White Cement",
    "image": "./images/cement4.jpg",
    "price": 350.0,
    "qty_available": 10
  },
  {
    "name": "Jordan 5 UNC",
    "image": "./images/unc5.jpg",
    "price": 300.0,
    "qty_available": 10
  },
  {
    "name": "Jordan 6 Infrared",
    "image": "./images/infrared6.webp",
    "price": 240.0,
    "qty_available": 10
  },
  {
    "name": "Jordan 11 Concord",
    "image": "./images/concord11.webp",
    "price": 280.0,
    "qty_available": 10
  },
  {
    "name": "Jordan 12 Flu Game",
    "image": "./images/flugame12.jpg",
    "price": 320.0,
    "qty_available": 10
  }
];

//Creating a loop to display product data to html
for (i = 0; i < products.length; i++){
  document.querySelector('.main').innerHTML += `
  <section class="item" onmouseover="changeClassName(this);"
  onclick="resetClassName(this);">
      <h2>${products[i].name}</h2>
      <p>$${products [i].price}</p>
      <img src="${products [i].image}" />
      <p>Quantity: ${products[i].qty_available}</p>
      <label for="qty_available${i}">Quantity Available:</label>
      <span id="remaining${i}">${products[i].qty_available}</span>
      <label for="qty_textbox">Quantity Desired:</label>
      <input type="text" name="qty_textbox">
      <span id="qty_textbox_message">Enter a quantity</span>
  
  </section>`;
}
*/

/*const form = document.getElementById('productForm');
let formHTML = ''; //blank content of form to add to it

//write a loop to print product information and then add quantity text input box for every element of the product array
for (let i in products) {
    formHTML += `<h3>${products[i]["name"]} at \$${products[i]["price"]} (${products[i]["total_sold"]} sold)</h3>`;
    formHTML += `<label for="qty_textbox${i}">Quantity Desired:</label>
    <input type = "text" name = "quantity_textbox${i}" name = "quantity_textbox[${i}]" onkeyup = "checkQuantityTextbox(this);">
    <span id = "quantity_textbox[${i}]_message">Enter a 
    quantity</span><br>
`;
}
*/
//Create loop using the arrays from products.json and generate it into the html








/*
//ensure the submit button is part of the form
formHTML += `<br> <input type = "submit" value = "Purchase">`;
//Push form content to the DOM
form.innerHTML = formHTML;
}
*/


// Update remaining quantity
function updateRemainingQuantity(index, quantityInput) {
  const remainingQuantitySpan = document.getElementById(`remaining${index}`);
  const quantityInputValue = parseInt(quantityInput.value, 10);
  if (!isNaN(quantityInputValue)) {
    const remainingQuantity = products[index].qty_available - quantityInputValue;
    remainingQuantitySpan.textContent = `Remaining Quantity: ${remainingQuantity}`;
  }
}

// Add an event listener to the input fields to call the updateRemainingQuantity function
for (let i = 0; i < products.length; i++) {
  const quantityInput = document.querySelector(`input[name=qty_available${i}]`);
  quantityInput.addEventListener('input', function () {
    updateRemainingQuantity(i, this);
  });
}

//add the checkQuantityTextbox()
function checkQuantityTextbox(theTextbox) {
  let errs = validateQuantity(theTextbox.value, true);
  document.getElementById(theTextbox.name + '_message').innerHTML = errs;
}


//Validating Quantity
function validateQuantity(quantity) {
  let errorMessage = "";

  if (isNaN(quantity)) {
    errorMessage = "Not a number. Please enter a non-negative quantity to order.";
  } else if (quantity <= 0 && !Number.isInteger(quantity)) {
    errorMessage = "Negative inventory and not an Integer. Please enter a non-negative quantity to order.";
  } else if (quantity <= 0) {
    errorMessage = "Negative inventory. Please enter a non-negative quantity to order.";
  } else if (!Number.isInteger(quantity)) {
    errorMessage = "Not an Integer. Please enter a non-negative quantity to order.";
  }

  return errorMessage;
}
