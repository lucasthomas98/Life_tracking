document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "lifeTrackerEntries";
  const resultsEl = document.getElementById("results");
  const filterDateEl = document.getElementById("filter-date");
  const filterTextEl = document.getElementById("filter-text");
  const clearBtn = document.getElementById("clear-filters");

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
        return `
          <div>
            <h3>Workout</h3>
            <p><strong>Date:</strong> ${e.date}</p>
            <p><strong>Where:</strong> ${e.where || ""}</p>
            <button type="button" data-delete="${e.id}">Delete</button>
            <hr>
          </div>
        `;
      }

      return `
        <div>
          <h3>Flight</h3>
          <p><strong>Date:</strong> ${e.date}</p>
          <p><strong>From:</strong> ${e.from || ""}</p>
          <p><strong>To:</strong> ${e.to || ""}</p>
          <button type="button" data-delete="${e.id}">Delete</button>
          <hr>
        </div>
      `;
    }).join("");

    resultsEl.querySelectorAll("button[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delete);
        const updated = getEntries().filter((x) => x.id !== id);
        saveEntries(updated);
        render();
      });
    });
  }

  filterDateEl.addEventListener("change", render);
  filterTextEl.addEventListener("input", render);

  clearBtn.addEventListener("click", () => {
    filterDateEl.value = "";
    filterTextEl.value = "";
    render();
  });

  render();
});