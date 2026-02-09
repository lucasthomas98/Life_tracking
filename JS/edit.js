const categoryEl = document.getElementById("category");
const flightFieldsEl = document.getElementById("flight");
 const whereFieldEl = document.getElementById("where-question");
    
const whereEl = document.getElementById("where");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");

function updateFields() {
    const selected = categoryEl.value;

flightFieldsEl.style.display = "none";
whereFieldEl.style.display = "none";

fromEl.required = false;
toEl.required = false;
whereEl.required = false;

fromEl.value = "";
toEl.value = "";
whereEl.value = "";

if (selected === "workouts") {
    whereFieldEl.style.display = "block";
    whereEl.required = true;
}

if (selected === "flights") {
    flightFieldsEl.style.display = "block";
    fromEl.required = true;
    toEl.required = true;
}
}

categoryEl.addEventListener("change", updateFields);
updateFields();