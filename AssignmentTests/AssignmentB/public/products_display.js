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
        <input type="text" class="quantity-input" name="quantity_textbox" value="0" min="0" data-max="${products[i]["qty_available"]}"/>
        <span class="quantity-message" id="quantity_textbox_${i}_message">Enter a quantity</span>
    `;
  productDisplayContainer.appendChild(productDiv);
  };



// Function to validate quantity
function validateQuantity(quantity, maxQuantity) {
    let errorMessage = "";
    quantity=Number(quantity);
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




// CHECK INPUT BOXES AGAINST DATA VALIDATION FUNCTION
// Remove leading 0's
// Updated checkInputTextbox function
function checkInputTextbox(textBox, availableQuantity) {
    let str = String(textBox.value);

    // Check if the first character is '0' and remove it if found
    if (str.charAt(0) == '0') {
        textBox.value = Number(str.slice(0, 0) + str.slice(1, str.length));
    }

    // Convert the input value to a number
    let inputValue = Number(textBox.value);

    // Validate the user input quantity using the updated validateQuantity function
    let errorMessages = validateQuantity(inputValue, availableQuantity);

    // Check if there are any error messages and update the display
    let errorDisplay = document.getElementById(textBox.name + '_error');
    if (errorMessages.length > 0) {
        errorDisplay.innerHTML = errorMessages.join('<br>');
        errorDisplay.style.color = "red";
        textBox.parentElement.style.borderColor = "red";
    } else {
        errorDisplay.innerHTML = "";
        textBox.parentElement.style.borderColor = "black";
    }
}














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
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);

        for (let i in products) {
            let qtyInput = qty_form[`qty${[i]}_entered`];
            let qtyError = document.getElementById(`qty${[i]}_error`);

            // Set the value from URL parameters
            if (params.get(`qty${i}`) !== null) {
                qtyInput.value = params.get(`qty${i}`);
            }

            // Validate the quantity and display errors
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



  



//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}