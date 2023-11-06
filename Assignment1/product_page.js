//product_page.js
// Fetch products from the server and populate the product list
function displayProducts() {
  fetch('products.json')
      .then(response => response.json())
      .then(products => {
          const productList = document.getElementById('product-list');
          
          products.forEach(product => {
              const productCard = document.createElement('div');
              productCard.innerHTML = `
                  <h2>${product.name}</h2>
                  <p>Price: $${product.price}</p>
                  <p>Quantity Available: ${product.quantity_available}</p>
                  <img src="${product.image}" alt="${product.name}">
                  <button data-product='${JSON.stringify(product)}' onclick='addToCart(this)'>Add to Cart</button>
              `;
              productList.appendChild(productCard);
          });
      })
      .catch(error => {
          console.error('Error fetching product data: ', error);
      });
}
// Function to fetch and display products from the server
/*fetch('/api/products')
  .then(response => response.json())
  .then(products => {
    const productList = document.getElementById('product-list');
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.innerHTML = `
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <p>Quantity Available: ${product.quantity_available}</p>
        <img src="${product.image}" alt="${product.name}">
        <button data-product='${JSON.stringify(product)}' onclick='addToCart(this)'>Add to Cart</button>
      `;
      productList.appendChild(productCard);
    });
  });
*/
// Function to add a product to the cart
function addToCart(button) {
  const product = JSON.parse(button.getAttribute('data-product'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (product.quantity_available > 0) {
    cart.push(product);
    product.quantity_available--;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart.length);
  } else {
    alert('Product is out of stock.');
  }
}

// Function to update the cart count
function updateCartCount(count) {
  const cartCount = document.getElementById('cart-count');
  cartCount.innerHTML = count;
}
//function to display products when page loads
document.addEventListener('DOMContentLoaded', displayProducts);








































/*let products = [
    {
        name: "Air Jordan 1 Bred",
        price: 400.00,
        image: "../images/bred1.webp"
      },
      {
        name: "Air Jordan 4 White Cement",
        price: 350.00,
        image: "../images/cement4.jpg"
      },
      {
        name: "Air Jordan 5 UNC",
        price: 300.00,
        image: "../images/unc5.jpg"
      },
      {
        name: "Air Jordan 6 Infrared",
        price: 240.00,
        image: "../images/infrared6.webp"
      },
      {
        name: "Air Jordan 11 Concord",
        price: 280.00,
        image: "../images/concord11.webp"
      },
      {
        name: "Air Jordan 12 Flu Game",
        price: 320.00,
        image: "../images/flugame12.jpg"
      },
];

window.addEventListener('DOMContentLoaded', function () {
  // Get the product list container
  const sneakerListContainer = document.querySelector('.sneaker-list');

  // Loop through the products and add them to the container
  for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Create a new product element
      const productElement = document.createElement('section');
      productElement.classList.add('sneaker-item');
      productElement.addEventListener('mouseover', function () {
          changeClassName(this);
      });
      productElement.addEventListener('click', function () {
          resetClassName(this);
      });

      // Create the HTML content for the product
      productElement.innerHTML = `
          <h2>${product.name}</h2>
          <p>$${product.price}</p>
          <img src="${product.image}" alt="${product.name}" />
          <label for="quantity${i}">Quantity Desired:</label>
          <input type="text" name="quantity${i}" id="quantity${i}">
      `;

      // Append the product element to the container
      sneakerListContainer.appendChild(productElement);
  }
});

for (let i = 0; i < products.length; i++) {
    const product = products[i];
    document.querySelector('.sneaker-list').innerHTML += `
        <section class="sneaker-item" onmouseover="changeClassName(this);"
        onclick="resetClassName(this);">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <img src="${product.image}" alt="${product.name}" />
            <label for="quantity${i}">Quantity Desired:</label>
            <input type="text" name="quantity${i}" id="quantity${i}">
        </section>`;
}

function changeClassName(element) {
    element.classList.add("highlighted");
}

function resetClassName(element) {
    element.classList.remove("highlighted");
}
*/