//function for splits
function splitString(string, separator) {
    return string.split(separator);
}

//validate if valie is a non-negative integer
function validateNonNegativeInteger(q){
    let errors = []; //assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    if (returnErrors) {
        return errors;
    } else {
        return returnErrors ? errors : (errors.length === 0); // Return true if there are no errors
    }
}

//Define attributes
let attributes = "Tae;31;MIS";

//Split attributes into array
let attributesArray = attributes.split(";");

//Extract name, age, and major
let name = attributesArray[0];
let age = attributesArray[1];
let major = attributesArray[2];

//Print attributes
console.log("Name: " + attributesArray[0]);
console.log("Age: " + attributesArray[1]);
console.log("Major: " + attributesArray[2]);

//Testing function using the pieces array
let pieces = ["31", "abc", "-5", "42"];

for (let piece of pieces) {
    let errors = isNonNegInt(piece, true); // Pass true to return errors
    let isValid = errors.length === 0;

    console.log()
        piece + " is a valid non-negative integer: " +
        (isValid ? "true" : "false") +
        (errors.length > 0 ? " (Errors: " + errors.join(', ') + ")" : "")
}