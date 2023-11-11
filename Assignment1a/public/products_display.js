//products_display.js

// declare and push to the DOM the store name at top and bottom
let store_name = "Cool Shoe Store";
top_title.innerHTML = store_name;
// send store name information to the footer title
bottom_title.innerHTML = "Wear History. It's cool.";

let productDisplayContainer = document.getElementById('product-display-container');
let cartList = document.getElementById('cart-list');

for (let i = 0; i < products.length; i++) {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product-item'); // Add a class to the product item

  productDiv.innerHTML = `
        <h2>${products[i]["name"]}  \$${products[i]["price"]}</h2>
        <p style="color: black;">Quantity: <span class="quantity">${products[i]["qty_available"]}</span></p>
        <img src="${products[i]["image"]}" style="width:350px; height: auto;"/>
        <form class="addToCartForm">
        <input type="text" class="quantity-input" name="quantity_textbox${i}" value="0" min="0" data-max="${products[i]["qty_available"]}"/>
        <button onclick="addToCart(${i})">Add to Cart</button>
        </form>
    `;

  productDisplayContainer.appendChild(productDiv);

  let addToCartForm = productDiv.querySelector('.addToCartForm');
  addToCartForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addToCart(i);
  });
}

// Function to ADD PRODUCT TO CART
function addToCart(productIndex) {
  const quantityInput = document.querySelectorAll('.quantity-input')[productIndex];
  const quantitySpan = document.querySelectorAll('.quantity')[productIndex];

  const quantity = parseInt(quantityInput.value);
  const availableQuantity = parseInt(quantitySpan.textContent);

  if (quantity <= availableQuantity) {
    // Check if the product is already in the cart
    const existingCartItem = Array.from(cartList.children).find(item => item.getAttribute('data-product-name') === products[productIndex].name);

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      const existingQuantity = parseInt(existingCartItem.getAttribute('data-quantity'));
      const newQuantity = existingQuantity + quantity;
      existingCartItem.setAttribute('data-quantity', newQuantity);
      existingCartItem.querySelector('.quantity').textContent = `Quantity: ${newQuantity}`;
    } else {
      // If the product is not in the cart, create a new cart item
      const cartItem = document.createElement('li');
      cartItem.setAttribute('data-product-name', products[productIndex].name);
      cartItem.setAttribute('data-quantity', quantity);

      // Create the HTML for the cart item
      cartItem.innerHTML = `
          <div class="cart-item-content">
              <img src="${products[productIndex].image}" alt="${products[productIndex].name}" class="cart-item-image"/>
              <div>
                  <p>${products[productIndex].name}</p>
                  <p class="quantity"> ${quantity}</p>
              </div>
          </div>
      `;

      // Add the cartItem to the cartList
      cartList.appendChild(cartItem);
    }

    // Update the available quantity in the DOM
    quantitySpan.textContent = `Quantity: ${availableQuantity - quantity}`;

    // Calculate and update the overall subtotal
    const overallSubtotal = calculateOverallSubtotal();
    updateOverallSubtotal(overallSubtotal);

    console.log(`Added ${quantity} ${products[productIndex].name} to the cart.`);
  } else {
    console.log(`Not enough quantity available.`);
  }
}

let totalCartQuantity = 0; // Initialize the total cart quantity

// Function to handle hover effect and show/hide the cart container
function handleCartHover() {
  const cartIcon = document.getElementById('cart-icon');
  const cartContainer = document.getElementById('cart-container');

  cartIcon.addEventListener('mouseenter', () => {
    cartContainer.style.display = 'block';
  });

  cartIcon.addEventListener('mouseleave', () => {
    cartContainer.classList.remove('cart-container-visible');
    // Use a setTimeout to wait for the transition to complete before hiding the container
    setTimeout(() => {
      cartContainer.style.display = 'none';
    }, 1000);
  });
}

//Update Cart Quantity
handleCartHover();
updateCartQuantity(0); // Update the quantity as needed

// Function to update the cart display
function updateCart(product, quantity) {
  // Check if the product is already in the cart
  const existingCartItem = Array.from(cartList.children).find(item => item.getAttribute('data-product-name') === product.name);

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

  // Update the overall subtotal
  const overallSubtotal = calculateOverallSubtotal();
  updateOverallSubtotal(overallSubtotal);

  console.log(`Added ${quantity} ${product.name} to the cart.`);
}

// Function to calculate the overall subtotal
function calculateOverallSubtotal() {
  const cartItems = document.querySelectorAll('#cart-list li');
  let overallSubtotal = 0;

  cartItems.forEach(item => {
    const productName = item.getAttribute('data-product-name');
    const quantity = parseInt(item.getAttribute('data-quantity'));

    const productIndex = products.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
      overallSubtotal += products[productIndex].price * quantity;
    }
  });

  return overallSubtotal.toFixed(2);
}

// Function to update the overall subtotal in the DOM
function updateOverallSubtotal(subtotal) {
  const overallSubtotalElement = document.getElementById('overall-subtotal');
  overallSubtotalElement.textContent = `Overall Subtotal: $${subtotal}`;
}

// Function to handle the purchase button click
function handlePurchase() {
  // Calculate the total
  const total = calculateTotal();

  // Redirect to the invoice page with the necessary parameters
  const invoiceParams = `total=${total}&otherParam=value`;
    window.location.href = `invoice.html?total=${total}`;
}


  // Redirect to the invoice page with the necessary parameters
  const invoiceParams = `total=${total}&otherParam=value`;
  window.location.href = `invoice.html?${invoiceParams}`;

// Function to calculate the total
function calculateTotal() {
  // Implement your logic to calculate the total based on the cart items
  // For example, you can iterate through the cart items and sum up the subtotals
  const cartItems = document.querySelectorAll('#cart-list li');
  let total = 0;

  cartItems.forEach(item => {
    const productName = item.getAttribute('data-product-name');
    const quantity = parseInt(item.getAttribute('data-quantity'));

    const productIndex = products.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
      total += products[productIndex].price * quantity;
    }
  });

  return total.toFixed(2);
}

// Add an event listener to the purchase button
document.getElementById('purchase-button').addEventListener('click', handlePurchase);

// Function to update the cart quantity indicator
function updateCartQuantity(quantity) {
  const cartQuantity = document.getElementById('cart-quantity');
  cartQuantity.textContent = quantity;
}

// Update remaining quantity
function updateRemainingQuantity(index, quantityInput) {
  const remainingQuantitySpan = document.getElementById(`remaining${index}`);
  const quantityInputValue = parseInt(quantityInput.value, 10);
  if (!isNaN(quantityInputValue)) {
    const remainingQuantity = products[index].qty_available - quantityInputValue;
    remainingQuantitySpan.textContent = `Remaining Quantity: ${remainingQuantity}`;
  } else {
    remainingQuantitySpan.textContent = `Remaining Quantity: ${products[index].qty_available}`;
  }
}

// Add an event listener to the input fields to call the updateRemainingQuantity function
for (let i = 0; i < products.length; i++) {
  const quantityInput = document.querySelector(`input[name=quantity_textbox${i}]`);
  quantityInput.addEventListener('input', function () {
    updateRemainingQuantity(i, this);
  });
}

// Add the checkQuantityTextbox()
function checkQuantityTextbox(theTextbox) {
  let errs = validateQuantity(theTextbox.value, true);
  document.getElementById(theTextbox.name + '_message').innerHTML = errs;
}

// Validating Quantity
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

//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}


