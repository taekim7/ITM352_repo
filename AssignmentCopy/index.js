// Add an event listener to ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  // Fetch product data from the server
  fetch('/products.js')
    .then(response => response.json())
    .then(data => {
      // Your code to display the products goes here
      let products = data;
      for (let i = 0; i < products.length; i++) {
        document.querySelector('.main').innerHTML += `
          <section class="item" onmouseover="changeClassName(this);" onclick="resetClassName(this);">
            <h2>${products[i].name}</h2>
            <p>$${products[i].price}</p>
            <img src="${products[i].image}" />
          </section>`;
      }
    });
});

//declare and push to the DOM the store name at top and bottom
const store_name="Cool Shoe Store";
top_title.innerHTML=(store_name);
//send store name infor to the footer title
bottom_title.innerHTML=("Wear History. It's cool.");


//Product information
let products = [
  {
    "name": "Jordan 1 OG BRED",
    "image": "../images/bred1.webp",
    "price": 400.0,
    "quantity": 10
  },
  {
    "name": "Jordan 4 White Cement",
    "image": "../images/cement4.jpg",
    "price": 350.0,
    "quantity": 10
  },
  {
    "name": "Jordan 5 UNC",
    "image": "../images/unc5.jpg",
    "price": 300.0,
    "quantity": 10
  },
  {
    "name": "Jordan 6 Infrared",
    "image": "../images/infrared6.webp",
    "price": 240.0,
    "quantity": 10
  },
  {
    "name": "Jordan 11 Concord",
    "image": "../images/concord11.webp",
    "price": 280.0,
    "quantity": 10
  },
  {
    "name": "Jordan 12 Flu Game",
    "image": "../images/flugame12.jpg",
    "price": 320.0,
    "quantity": 10
  }
];


for (i = 0; i < products.length; i++){
    document.querySelector('.main').innerHTML += `
    <section class="item" onmouseover="changeClassName(this);"
    onclick="resetClassName(this);">
        <h2>${products[i].name}</h2>
        <p>$${products [i].price}</p>
        <img src="${products [i].image}" />
    
    </section>`;
}












