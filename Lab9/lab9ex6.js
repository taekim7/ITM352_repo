//function for splits
function splitString(string, separator) {
    return string.split(separator);
}

//validate if valie is a non-negative integer
function validateNonNegativeInteger(q, returnErrors = false){
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

/*
function checkIt(item, index) {
    console.log(`part ${index} is ${(validateNonNegativeInteger(item) ? 'a' : 'not a')} quantity`);
}

pieces.forEach(checkIt);
*/

pieces.forEach((item, index) => {
    console.log(`part ${index} is ${(validateNonNegativeInteger(item) ? 'a' : 'not a')} quantity`);
});

function download(url, callback) {
    setTimeout(() => {
        // script to download the picture here
        console.log(`Downloading ${url} ...`);
        picture_data = "image data:XOXOXO";
        callback(picture_data); // 
    }, 3* 1000);
    
}

function process(picture) {
    console.log(`Processing ${picture}`);
}

let url = 'https://www.example.com/big_pic.jpg';
download(url, process);