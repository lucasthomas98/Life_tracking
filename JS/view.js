document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "lifeTrackerEntries";
  const resultsEl = document.getElementById("results");
  const filterDateEl = document.getElementById("filter-date");
  const filterTextEl = document.getElementById("filter-text");
  const clearBtn = document.getElementById("clear-filters");
  
  let editingId = null;

  function getEntries() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
  
  function textMatch(entry, q) {
    if (!q) return true;
    const query = q.toLowerCase();
    const where = (entry.where || "").toLowerCase();
    const from = (entry.from || "").toLowerCase();
    const to = (entry.to || "").toLowerCase();
    return where.includes(query) || from.includes(query) || to.includes(query);
  }

  function dateMatch(entry, date) {
    if (!date) return true;
    return entry.date === date;
  }

  function render() {
    const entries = getEntries();
    const dateFilter = filterDateEl.value;
    const textFilter = filterTextEl.value.trim();

    const filtered = entries
      .slice()
      .sort((a, b) => (b.date || "").localeCompare(a.date || "")) // newest date first
      .filter((e) => dateMatch(e, dateFilter) && textMatch(e, textFilter));

    if (filtered.length === 0) {
      resultsEl.innerHTML = "<p>No matching entries found.</p>";
      return;
    }

    resultsEl.innerHTML = filtered.map((e) => {
      if (e.category === "workouts") {
        if (editingId === e.id) {
          return `
            <div class="entry" data-id="${e.id}">
              <h3>Edit Workout</h3>

              <label>Date:</label><br>
              <input type="date" data-field="date" value="${e.date || ""}"><br><br>

              <label>Where:</label><br>
              <input type="text" data-field="where" value="${(e.where || "").replaceAll('"', "&quot;")}"><br><br>

              <button type="button" data-action="save">Save</button>
              <button type="button" data-action="cancel">Cancel</button>
              <hr>
            </div>
          `;
        }
    
return `
            <div class="entry" data-id="${e.id}">
              <h3>Workout</h3>
              <p><strong>Date:</strong> ${e.date}</p>
              <p><strong>Where:</strong> ${e.where || ""}</p>

              <button type="button" data-action="edit">Edit</button>
              <button type="button" data-action="delete">Delete</button>
              <hr>
            </div>
          `;
        }

        if (editingId === e.id) {
          return `
            <div class="entry" data-id="${e.id}">
              <h3>Edit Flight</h3>

              <label>Date:</label><br>
              <input type="date" data-field="date" value="${e.date || ""}"><br><br>

              <label>From:</label><br>
              <input type="text" data-field="from" value="${(e.from || "").replaceAll('"', "&quot;")}"><br><br>

              <label>To:</label><br>
              <input type="text" data-field="to" value="${(e.to || "").replaceAll('"', "&quot;")}"><br><br>

              <button type="button" data-action="save">Save</button>
              <button type="button" data-action="cancel">Cancel</button>
              <hr>
            </div>
          `;
        }

        return `
          <div class="entry" data-id="${e.id}">
            <h3>Flight</h3>
            <p><strong>Date:</strong> ${e.date}</p>
            <p><strong>From:</strong> ${e.from || ""}</p>
            <p><strong>To:</strong> ${e.to || ""}</p>

            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete">Delete</button>
            <hr>
          </div>
        `;
      })
      .join("");
    }
    resultsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const entryDiv = btn.closest(".entry");
    if (!entryDiv) return;

    const id = Number(entryDiv.dataset.id);
    const action = btn.dataset.action;

    if (action === "delete") {
      const updated = getEntries().filter((x) => x.id !== id);
      saveEntries(updated);
      render();
      return;
    }

    if (action === "edit") {
      editingId = id;
      render();
      return;
    }

    if (action === "cancel") {
      editingId = null;
      render();
      return;
    }

    if (action === "save") {
      const entries = getEntries();
      const idx = entries.findIndex((x) => x.id === id);
      if (idx === -1) return;

      const updatedEntry = { ...entries[idx] };

      entryDiv.querySelectorAll("[data-field]").forEach((input) => {
        updatedEntry[input.dataset.field] = input.value.trim();
      });

      if (!updatedEntry.date) return alert("Date is required.");
      if (updatedEntry.category === "workouts" && !updatedEntry.where)
        return alert("Where is required.");
      if (
        updatedEntry.category === "flights" &&
        (!updatedEntry.from || !updatedEntry.to)
      )
        return alert("From and To are required.");

      entries[idx] = updatedEntry;
      saveEntries(entries);

      editingId = null;
      render();
    }
  });

  filterDateEl.addEventListener("change", render);
  filterTextEl.addEventListener("input", render);

  clearBtn.addEventListener("click", () => {
    filterDateEl.value = "";
    filterTextEl.value = "";
    render();
  });

  render();
});