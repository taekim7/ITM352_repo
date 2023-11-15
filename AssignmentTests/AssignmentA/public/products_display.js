//products_display.js

const productForm = document.getElementById('productForm');


// declare and push to the DOM the store name at top and bottom
let store_name = "Cool Shoe Store";
top_title.innerHTML = store_name;
// send store name information to the footer title
bottom_title.innerHTML = "Wear History. It's cool.";

let productDisplayContainer = document.getElementById('product-display-container');


// Function to generate table rows and apply quantity validation
for (let i = 0; i < products.length; i++) {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product-item'); // Add a class to the product item

  productDiv.innerHTML = `
        <h2>${products[i]["name"]}  \$${products[i]["price"]}</h2>
        <p style="color: black;">Quantity: <span class="quantity">${products[i]["qty_available"]}</span></p>
        <img src="${products[i]["image"]}" style="width:350px; height: auto;"/>
        <input type="text" class="quantity-input" name="quantity_textbox${i}" value="0" min="0" data-max="${products[i]["qty_available"]}"/>
        <span class="quantity-message" id="quantity_textbox_${i}_message">Enter a quantity</span>
    `;
  productDisplayContainer.appendChild(productDiv);
  };




// Get the URL
let params = (new URL(document.location)).searchParams;

window.onload = function() {
    /* If there is a server side validation error
    Display message to user and allow them to edit their inputs
    User input is made sticky by retrieving quantities from the URL 
    Those inputs are validated by isNonNegInt again */
    if (params.has('error')) {
       
        document.getElementById('errMsg').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);
    } 
    else if (params.has('inputErr')) {
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding."
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);

        for (let i in products) {
            let qtyInput = qty_form[`qty${i}_entered`];
            let qtyError = document.getElementById(`qty${i}_error`);

            if (params.get(`qty${i}`) !==null) {
                //qtyInput_value = params.get(`qty${i}`);
                qtyInput.value = params.get(`qty${i}`);
            }

            //validate quantity and display error
            let errorMessages = validateQuantity(qtyInput.value, products[i].qty_available);
            if (errorMessages.length > 0) {
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = "red";
            } else {
                qtyError.innerHTML = "";
                qtyInput.parentElement.style.borderColor = "black";
            }
        }
    }
}


// Add an event listener to each quantity input for real-time validation
document.querySelectorAll('.quantity-input').forEach((input, i) => {
  input.addEventListener('input', function () {
      const quantityMessage = document.getElementById(`quantity_textbox_${i}_message`);
      const qty = Number(this.value);
      const validationMessage = validateQuantity(qty, products[i]["qty_available"]);

      // Update error message dynamically
      quantityMessage.textContent = validationMessage;
  });
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


//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}