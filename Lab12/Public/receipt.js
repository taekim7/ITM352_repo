//receipt.js



let params = (new URL(document.location)).searchParams;
let q = Number(params.get('quantity'));

let brand = products[0]['brand'];
let brand_price = products[0]['price'];


let validationMessage = validateQuantity(q);

if (validationMessage === "") {
    document.getElementById('receiptContent').innerHTML = `<h2>Thank you for purchasing ${q} ${brand}. Your total is \$${q * brand_price}!</h2>`;
} else {
    alert(validationMessage + '<br>' + `Error: ${q} is not a quantity. Hit the back button to fix.`);
    document.getElementById('receiptContent').innerHTML = (validationMessage + '<br>' + `Error: ${q} is not a quantity. Hit the back button to fix.`);
}

function validateQuantity (quantity) {
        let errorMessage = "";

        if (isNaN(quantity)) {
            return "Not a number";
        }else if (quantity < 0 && !Number.isInteger(quantity)) {
            return "Negative Inventory and not an integer";
        }else if (quantity <0){
            return "Negative Inventory";
        }else if (!Number.isInteger(quantity)){
            return "not an integer";
        }else {
            return "";
        }
}