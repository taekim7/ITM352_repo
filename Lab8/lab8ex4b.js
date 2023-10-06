//Defining Product Quantities Array
let product_quantities=[2,1,1,1,1];

//Lab8 3.2
// array of all products
// corresponds to product_quantities array
// product_quantities[i] is the quantity for products[i]
products = [
    { 'name': 'small gumball', 'price': 0.02 },
    { 'name': 'medium gumball', 'price': 0.05 },
    { 'name': 'large gumball', 'price': 0.07 },
    { 'name': 'small jawbreaker', 'price': 0.06 },
    { 'name': 'large jawbreaker', 'price': 0.10 }
   ];


//Printing Each Element in Table
document.write("<table>");
//document.write("<tr><th>Product #</th><th>Quantity</th></tr>");
//Lab 8 3.2
document.write("<tr><th>Product #</th><th>Name</th><th>Price</th><th>Quantity</th><th>Extended Cost</th></tr>");

for (let i=0; i < product_quantities.length; i ++) {

    let quantity = product_quantities[i];
    let product = products[i];
    let extended_cost = quantity * product.price;

    document.write("<tr>");
    document.write("<td>" + (i+1) + "</td>"); //Product #
    document.write("<td>" + product.name + "</td>"); //Name
    document.write("<td>" + product.price.toFixed(2) + "</td>"); //Price
    document.write("<td>" + product_quantities[i] + "</td>"); //Quantity
    document.write("<td>" + extended_cost.toFixed(2) + "</td>"); //Extended Cost
    document.write("</tr>");
}

document.write("</table>");

//Lab 8 Part 4.2: Create a button to delete the last row for task 4.2
let deleteButton = document.createElement('button');
//let the text content of the button to be "Delete Last Row"
deleteButton.textContent = 'Delete Last Row';
//Add click event to the button. Once clicked, the deleteLastRow function will be triggered.
deleteButton.addEventListener('click', deleteLastRow);
//Append the button to the body
document.body.appendChild(deleteButton);


//Lab 8 Part 4.1

function addNewRow () {
    let table = document.querySelector('table');

    let newRow = table.insertRow();
    newRow.innerHTML = `
    <td> blank </td>
    <td> blank </td>
    <td> blank </td>
    <td> blank </td>
    <td> blank </td>
    `;
};

//Adding click event to the table to trigger the addnewrow function
document.addEventListener('DOMContentLoaded', function() {
    let table = document.querySelector('table');
    table.addEventListener('click', addNewRow);
});

//Create Delete Button
function deleteLastRow () {
    let table = document.querySelector('table');
    let rowCount = table.rows.length; //Gives row count

    if (rowCount > 1) {
        table.deleteRow(rowCount - 1);
    };
};