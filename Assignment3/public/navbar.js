//navbar.js

let params= (new URL(document.location)).searchParams;

//Direct user to appropriate product page

//From Port's example code
let products_key= "Shoes";
if (params.has('products_key')) {
    products_key = params.get ('products_key');
}
else {
    products_key
}






//Load shopping cart
let shopping_cart;

//initialize the total number of items in cart
let totalItemsInCart = 0;

//Load cart data from JSON
loadJSON('/get_cart', function(response) {

    //Parse JSON
    shopping_cart = JSON.parse(response);
    //Go through each product in cart
    for (let productKey in shopping_cart){
        let productQuantities = shopping_cart[productKey];
        let productTotalQuantity = productQuantities.reduce((accumulator, currentQuantity) => accumulator + currentQuantity);

        totalItemsInCart += productTotalQuantity;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    //If user's cookie exists
    if (getCookie('user_cookie') != false){
        //turn string of key value pairs into an array
        let user_cookie=getCookie('user_cookie');

        if (document.getElementById('nav_container')) {
            //make login button into a button with user's name leading to cart page
            document.querySelector('#nav_container').innerHTML +=`
            <a class="nav-link mx-3 highlight" href="/logout.html">
            <span class = "fa-solid fa-user highlight" style="color: white"></span> ${user_cookie['name']}
            </a>
            `;
        }

        //personalization on homepage
        if (document.getElementById('user_name')) {
            document.getElementById('user_name').innerHTML = user_cookie['name'];
        }
    }else{
        document.querySelector('#nav_container').innerHTML +=`
        <a class="nav-link mx-3 highlight" href="/login.html">
        <span class = "fa-solid fa-user highlight" style="color: white"></span> Login
        </a>
        `;
    }
})

//Getting user's cookie
function getCookie(cname) {
    //prepare the cookie name to search
    let name = cname + "=";

    //get and decode the cookie string
    let decodeCookie = decodeURIComponent(document.cookie);

    //split cookie string into an array of individual cookie entries
    let cookieEntries = decodedCookie.split(';');

    //Iterate through each cookie entry
    for (let i = 0; i < cookieEntries.length; i++) {
        let cookieEntry = cookieEntries[i];

        //Remove leading spaces
        while (cookieEntry.charAt(0) == ' ') {
            cookieEntry = cookieEntry.substring(1);
        }

        //Check if current cookie entry starts with desired name
        if (cookieEntry.indexOf(name) ==0) {
            //Extract and parse the value part of cookie
            let cookieValueString = cookieEntry.substring(name.length, cookieEntry.length);
            return JSON.parse(cookieValueString);
        }
}

//Return an empty string if cookie with specified name is not found
return "";
}

function updateCartTotal() {
    //assuming cart is an array of items with quantity property
    let newTotal = 0;

    //loop through each item in the cart and add up quantities
    for (let item of shopping_cart) {
        newTotal += item.quantity;
    }
    //update the totalItemsInCart with new total
    totalItemsInCart = newTotal;

    //update display element in navbar
    document.getElementById('cart_total').innerHTML = totalItemsInCart;

}