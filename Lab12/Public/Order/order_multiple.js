//order_multiple.js for lab12 part 6

window.onload = function() {
    
}

//Checking URL for any error parameters, quantities, and display item
let params = (new URL(document.location)).searchParams;
let q = Number(params.get('quantity'));
let error = params.get('error');

//if error, alert user
if (error) {
alert(error);
//define variable that points to the form on the DOM

}
















