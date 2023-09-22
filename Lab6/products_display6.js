//declare and push to the DOM the store name at top and bottom
const store_name="Tae Kim";
top_title.innerHTML = (store_name + "'s Used Smart Phone Store");
bottom_title.innerHTML=(store_name + "'s Used Smart Phone Store");

let hits = 0;
let spins = 0;
hits_span.innerHTML = hits;
spins_span.innerHTML = spins;



function changeClassName (element){
element.className='item rotate';
spins_span.innerHTML = spins++;
}

function resetClassName (element){
element.className='item';
hits_span.innerHTML = hits++;

let hits = 0;
let spins = 10;
hits_span.innerHTML = hits;
spins_span.innerHTML = spins;
}


