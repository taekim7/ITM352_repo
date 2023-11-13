//products_display.js

// declare and push to the DOM the store name at top and bottom
let store_name = "Cool Shoe Store";
top_title.innerHTML = store_name;
// send store name information to the footer title
bottom_title.innerHTML = "Wear History. It's cool.";

let params = (new URL(document.location)).searchParams;
let error;
let order = [];

error = params.get('error');

params.forEach((value, key) => {
  if (key.startsWith('prod')) {
    order.push(parseInt(value));
  }
});

if(error =='true'){
  document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger">Input Error - Please Fix!</h2><br>`;
}




// Function to generate table rows and apply quantity validation
for (let i = 0; i < products.length; i++) {
  document.querySelector('.row').innerHTML += 
     `<div class="col-md-6 Shoes mb-4">
      <div class="card">
      <div class="text-center">
              <img src="${products[i].image}" class="name-img-top border-top" alt="Product Image">
      </div>
      <div class="shoe-body">
              <h5 class="shoe-name">${products[i].name}</h5>
              <p class="shoe-text">
                  Price: $${(products[i].price).toFixed(2)}<br>
                  Available: ${products[i].qty_available}<br>
                  Total Sold: ${products[i].total_sold}
              </p>
              
              <input type="text" placeholder="0" name="quantity_textbox" id="${[i]}" class="form-control mb-2" oninput="validateQuantity(this)" value="${order[i] !== 0 && order[i] !== undefined ? order[i] : ''}" onload="validateQuantity(this)">
              <p id="invalidQuantity${[i]}" class="text-danger"></p>
      </div>
      </div>
      </div>`
      validateQuantity(document.getElementById(`${[i]}`));
;}

        


  
function validateQuantity(quantity) {
  const valMessage = document.getElementById(`invalidQuantity${quantity.id}`);
  const quantityNumber = Number(quantity.value);

  if (isNaN(quantityNumber)) {
    valMessage.innerHTML = "Please Enter a Number";
  } else if (quantityNumber < 0 && !Number.isInteger(quantityNumber)) {
    valMessage.innerHTML = "Please Enter a Positive Integer";
  } else if (quantityNumber < 0) {
    valMessage.innerHTML = "Please Enter a Positive Value";
  } else if (!Number.isInteger(quantityNumber)) {
    valMessage.innerHTML = "Please Enter an Integer";
  } else if (quantityNumber > products[quantity.id]['qty_available']) {
    valMessage.innerHTML = "Not Enough Items in Stock!";
  } else {
    valMessage.innerHTML = '';
  }
}


//autoplay music
function playAudio() {
  var audio = document.getElementById("background-music");
  audio.play();
}