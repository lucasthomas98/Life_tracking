

const categoryEl = document.getElementById("category");
const flightFieldsEl = document.getElementById("flight");
 const whereFieldEl = document.getElementById("where-question");
    
const whereEl = document.getElementById("where");
const fromEl = document.getElementById("from");
const toEl = document.getElementById("to");
const dateEl = document.getElementById("date");
const formEl = document.getElementById("entryform");

const storageKey = "lifeTrackerEntries";

function getEntries() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}
function saveEntry(entries) {
    localStorage.setItem(storageKey, JSON.stringify(entry));
}
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
formEl.addEventListener("submit", function (e) {
    e.preventDefault();

    const category = categoryEl.value;
    if (!category) {
        alert("Please select Workouts or Flights Taken.");
        return;
    }

    const entry = {
        id: Date.now(),
        category,
        date: dateEl.value,
    };

    if (category === "workouts") {
        entry.where = whereEl.value.trim();
    } else if (category === "flights") {
        entry.from = fromEl.value.trim();
        entry.to = toEl.value.trim();
    }
    const entries = getEntries();
    entries.push(entry);
    saveEntry(entries);

    alert("Saved!");
    formEl.reset();
    updateFields();
});