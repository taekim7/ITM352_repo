function splitString(string, separator) {
    return string.split(separator);
}

// Define attributes
let attributes = "<name>;<age>;<age + 0.5>;<0.5 - age>";

// Split attributes into an array
let pieces = splitString(attributes, ";");

// Loop through the parts and determine their data types
for (let part of pieces) {
    console.log(`Part: ${part}, Data Type: ${typeof part}`);
}

let invertedString = pieces.join(separator);

