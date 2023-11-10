//products_display.js

//declare and push to the DOM the store name at top and bottom
const store_name="Cool Shoe Store";
top_title.innerHTML=(store_name);
//send store name infor to the footer title
bottom_title.innerHTML=("Wear History. It's cool.");

/*
//Product Display Shoes
for (let i = 0; i < products.length; i++) {
document.write(`<h2>${products[i]["name"]}  \$${products[i]["price"]}</h2>`);
//Display Quantity
document.write(`<p>Quantity: ${products[i]["qty_available"]}</p>`);
//display image
document.write(`<img src="${products[i]["image"]}"/>`);
//generate quantity box with purchase button
}
*/

////////////////////////////////////////////////////////////////////////////Product Display Shoes//////////////////////////////////////////////////////////////////////////////////////////////
let productDisplayContainer = document.getElementById('product-display-container');

for (let i = 0; i < products.length; i++) {
    const productDiv = document.createElement('div');

    productDiv.innerHTML = `
        <h2>${products[i]["name"]}  \$${products[i]["price"]}</h2>
        <p>Quantity: <span class="quantity">${products[i]["qty_available"]}</span></p>
        <img src="${products[i]["image"]}"/>
        <input type="number" class="quantity-input" name="quantity_textbox${i}" value="0" min="0" max="${products[i]["qty_available"]}"/>
        <button onclick="addToCart(${i})">Add to Cart</button>
    `;

    productDisplayContainer.appendChild(productDiv);
}


// ...

// Function to add the product to the cart (ChatGPT)
function addToCart(productIndex) {
  const quantityInput = document.querySelectorAll('.quantity-input')[productIndex];
  const quantitySpan = document.querySelectorAll('.quantity')[productIndex];

  const quantity = parseInt(quantityInput.value);
  const availableQuantity = parseInt(quantitySpan.textContent);

  if (quantity <= availableQuantity) {
      // Update the cart display
      updateCart(products[productIndex], quantity);
      console.log(`Added ${quantity} ${products[productIndex]["name"]} to the cart.`);
  } else {
      console.log(`Not enough quantity available.`);
  }
}




// Function to update the cart display (ChatGPT)
function updateCart(product, quantity) {
  const cartList = document.getElementById('cart-list');

  // Check if the product is already in the cart
  const existingCartItem = Array.from(cartList.children).find(item =>
      item.getAttribute('data-product-name') === product.name
  );

  if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      const existingQuantity = parseInt(existingCartItem.getAttribute('data-quantity'));
      const newQuantity = existingQuantity + quantity;
      existingCartItem.setAttribute('data-quantity', newQuantity);
      existingCartItem.querySelector('.quantity').textContent = `Quantity: ${newQuantity}`;
  } else {
      // If the product is not in the cart, create a new cart item
      const cartItem = document.createElement('li');
      cartItem.setAttribute('data-product-name', product.name);
      cartItem.setAttribute('data-quantity', quantity);

      // Create the HTML for the cart item
      cartItem.innerHTML = `
          <div class="cart-item-content">
              <img src="${product.image}" alt="${product.name}" class="cart-item-image"/>
              <div>
                  <p>${product.name}</p>
                  <p class="quantity">Quantity: ${quantity}</p>
              </div>
          </div>
      `;

      cartList.appendChild(cartItem);
  }
}










let totalCartQuantity = 0; // Variable to store the total cart quantity

// Function to handle hover effect and show/hide the cart container
function handleCartHover() {
    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart-container');

    cartIcon.addEventListener('mouseenter', () => {
        cartContainer.style.display = 'block';
        cartContainer.classList.add('cart-container-visible');
    });

    cartIcon.addEventListener('mouseleave', () => {
      cartContainer.classList.remove('cart-container-visible');
      // Use a setTimeout to wait for the transition to complete before hiding the container
      setTimeout(() => {
          cartContainer.style.display = 'none';
      }, 300);
  });
}

// Function to add the product to the cart
function addToCart(productIndex) {
    const quantityInput = document.querySelectorAll('.quantity-input')[productIndex];
    const quantitySpan = document.querySelectorAll('.quantity')[productIndex];

    const quantity = parseInt(quantityInput.value);
    const availableQuantity = parseInt(quantitySpan.textContent);

    if (quantity <= availableQuantity) {
        // Update the cart display
        updateCart(products[productIndex], quantity);
        console.log(`Added ${quantity} ${products[productIndex]["name"]} to the cart.`);
    } else {
        console.log(`Not enough quantity available.`);
    }
}

// Function to update the cart display
function updateCart(product, quantity) {
    const cartList = document.getElementById('cart-list');

    // Check if the product is already in the cart
    const existingCartItem = Array.from(cartList.children).find(item =>
        item.getAttribute('data-product-name') === product.name
    );

    if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        const existingQuantity = parseInt(existingCartItem.getAttribute('data-quantity'));
        const newQuantity = existingQuantity + quantity;
        existingCartItem.setAttribute('data-quantity', newQuantity);
        existingCartItem.querySelector('.quantity').textContent = `Quantity: ${newQuantity}`;
    } else {
        // If the product is not in the cart, create a new cart item
        const cartItem = document.createElement('li');
        cartItem.setAttribute('data-product-name', product.name);
        cartItem.setAttribute('data-quantity', quantity);

        // Create the HTML for the cart item
        cartItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image"/>
                <div>
                    <p>${product.name}</p>
                    <p class="quantity">Quantity: ${quantity}</p>
                </div>
            </div>
        `;

        cartList.appendChild(cartItem);
    }

    // Update the total cart quantity
    totalCartQuantity += quantity;
    updateCartQuantity(totalCartQuantity);
}

// Function to update the cart quantity indicator
function updateCartQuantity(quantity) {
    const cartQuantity = document.getElementById('cart-quantity');
    cartQuantity.textContent = quantity;
}

// Example usage
handleCartHover();






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
  } else {
    remainingQuantitySpan.textContent = `Remaining Quantity: ${products[index].qty_available}`;
  }}
  


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



// Add an event listener to the form
document.getElementById('productForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Calculate the total and any other necessary details
  const total = calculateTotal();

  // Redirect to the receipt page with the necessary parameters
  window.location.href = `receipt.html?total=${total}`; // Adjust the URL parameters as needed
});

// Function to calculate the total (you might need to customize this based on your needs)
function calculateTotal() {
  // Calculate the total based on the products in the cart
  // You might want to fetch data from localStorage or update the logic based on your requirements
  let total = 0;

  // Example: Calculate the total based on the products in the cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  for (const { productIndex, quantity } of cart) {
      const product = products[productIndex];
      total += product.price * quantity;
  }

  return total;
}


//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}