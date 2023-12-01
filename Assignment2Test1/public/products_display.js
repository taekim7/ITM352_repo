//products_display.js

// Get the URL
let params = (new URL(document.location)).searchParams;

window.onload = function() {
    /* If there is a server side validation error
    Display message to user and allow them to edit their inputs
    User input is made sticky by retrieving quantities from the URL 
    Those inputs are validated by isNonNegInt again */

    if (params.has('error')) {
        console.log("Error: No quantities selected.");
        document.getElementById('errorMessage').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errorMessage').innerHTML = "";
        }, 2000);
    } 
    else if (params.has('inputError')) {
        console.log("Input Error: Please fix errors before proceeding.");
        document.getElementById('errorMessage').innerHTML = "Please fix errors before proceeding.";
        setTimeout(() => {
            document.getElementById('errorMessage').innerHTML = "";
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
                console.log("Validation Error:", errorMessages);
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = "red";
            } else {
                qtyError.innerHTML = "";
                qtyInput.parentElement.style.borderColor = "black";
            }
        }
    }
    //sticky stuff for quantities
    if (params.has('name')){
        console.log("Hello Message:", `Hello ${params.get('name')}!`);
        document.getElementById('helloMsg').innerHTML = `Hello ${params.get('name')}!`;
        for (let i in products) {
            qty_form [`qty${i}`].value = params.get(`qty${i}`);
            console.log(`Qty ${i} Value:`, params.get(`qty${i}`));
        }
    }
}


// Populate the DOM Form with the product details
for (let i = 0; i < products.length; i++) {
// Products Display Grid
document.querySelector('.row').innerHTML += `
    <div class="col-md-6 product_card">
        <div>
        <h5 style="float: center;" class="product_name">${products[i].name}</h5>
        <h5 style="float: center;" class ="product_price">$${(products[i].price).toFixed(2)}</h5>
        </div>  
        <img src="${products[i].image}" class="img-thumbnail" alt="${products[i].alt}">
        <div style="height: 90px;">
        <table style="width: 100%; text-align: center; font-size: 18px;" id="product_table">
        <tr>
        <!-- Shoes available quantity for the product -->
        <td style=";text-align: center; width: 20%;  ">Shoes Available: ${products[i].qty_available}</td>
        <!-- Input textbox for quantity -->
        <td style="text-align: center; width: 20%;" rowspan="2">
        <input type="text" autocomplete="off" placeholder="Enter Quantity" name="qty${[i]}" id="qty${[i]}_entered" class="inputBox" onkeyup="checkInputTextbox(this,${products[i].qty_available})">
        <!-- Label for quantity -->
        <label id="qty${[i]}_label" style="margin: 6px 0; float: center; padding-right: 10px;">Quantity:</label>
        </td>
        </tr>
        <tr>
        <!-- Sold Quantity -->
        <td style="text-align: center; width: 35%;" id="qty_sold${i}">Sold: ${products[i].qty_sold}</td>
        </tr>
        <tr>
        <!-- Error message -->
        <td colspan="3" style="padding-top: 5px;"><div id="qty${[i]}_error" style="color: red;"></div></td>
        </tr>
        </table>
        </div>  
        </div>
    `;
}

// PERFORM CLIENT-SIDE DATA VALIDATION

// Updated validateQuantity function
function validateQuantity(quantity, availableQuantity) {
    let errors = []; // Initialize an array to hold error messages

    quantity=Number(quantity);

    switch (true) {
        case (isNaN(quantity)) && (quantity != ''):
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
            errors.push(`We do not have ${quantity} available.`);
            break;
        // No default case needed as no errors means the array remains empty
    }

    return errors; // Return the array of errors
};


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