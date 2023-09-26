
let monthInput=document.getElementById("monthInput");
let result=document.getElementById("result");

document.querySelector('button').addEventListener('click', function () {
    
    let month=monthInput.value.toLowerCase();
    let num_days = -1;

    switch(month) {
        case "january":
        case "march":
        case "may":
        case "july":
        case "august":
        case "october":
        case "december":
            num_days=31;
            break;
        case "april":
        case "june":
        case "september":
        case "november":
            num_days=30;
            break;
        case "february":
            num_days=28; // could be 29 days
            break;
        default:
            num_days=-1;
            break;
    }

    if (num_days === -1) {
        result.textContent = 'Invalid month. Please enter a valid month name.';
    } else {
        result.textContent = `There are ${num_days} days in ${month}.`;
    }
});