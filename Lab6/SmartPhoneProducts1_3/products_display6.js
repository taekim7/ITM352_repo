
const store_name="Tae Kim";
top_title.innerHTML = (store_name + "'s Used Smart Phone Store");
bottom_title.innerHTML = (store_name + "'s Used Smart Phone Store");
let first_name="Tae";
let last_name="Kim";
let line = 1;
let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let hits = 0;
let spins = 0;
hits_span.innerHTML = hits;
spins_span.innerHTML = spins;

function changeClassName(element) {
    element.className = 'item rotate';
    spins = spins + 1;
    spins_span.innerHTML = spins;
    hits_span.innerHTML = (hits / spins).toFixed(2);
}


function incrementHit(element) {
    element.className = 'item';
    hits = hits + 1;
    document.getElementById("hits_span").innerHTML = hits;
    document.getElementById("hit_spin_span").innerHTML = (hits / spins).toFixed(2);
}
document.getElementById("first_name").innerHTML = first_name;
document.getElementById("last_name").innerHTML = last_name;
document.getElementById("current_year").innerHTML = now.getFullYear();

       
let amPm = hours < 12 ? 'AM' : 'PM';
hours = (hours + 11) % 12 + 1;
document.getElementById("current_time").innerHTML = `${hours}:${(minutes < 10 ? '0' : '') + minutes} ${amPm}`;
     


