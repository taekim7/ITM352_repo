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




/*
  //Declare params
let params = (new URL(document.location)).searchParams;
if (params.has('error')) {
    document.getElementById('error-message').innerHTML = "no quantities selected";
    setTimeout (() => {
        document.getElementById('error-message').innerHTML = "";
    }, 3000);
    }
    for (let i in products) {
        if (params.get(`qty${i}`) == 0) {
            qty_form[`qty${i}_entered`].value = '';
        }else{
            qty_form[`qty${i}_entered`].value = params.get(`qty${i}`);
            qty_form[`qty${i}_entered`].parentElement.style.borderColor = "red";
        }
        errors = isNonNegInt(params.get(`qty${i}`), true)
        document.getElementById(`qty${i}_error`).innerHTML = errors.join('');
            
    }
*/

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
            if (params.get(`qty${i}`) == 0) {
                qty_form[`qty${i}_entered`].value = '';
            } else {
                qty_form[`qty${i}_entered`].value = params.get(`qty${i}`);
                qty_form[`qty${i}_entered`].parentElement.style.borderColor = "red";
            }
            errors = validateQuantity(params.get(`qty${i}`))
            document.getElementById(`qty${i}_error`).innerHTML = errors.join('');  
        }
        alert("errors = "+errors);
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


//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}