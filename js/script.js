const DATA_URL = "data/calendar-2026.json";

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sundayOf(date) {
  const monday = mondayOf(date);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

function formatDate(date, opts = {}) {
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    ...opts,
  });
}

function formatRange(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = formatDate(start, sameMonth ? { day: "numeric" } : {});
  const endStr = formatDate(end);
  return `${startStr} – ${endStr}`;
}

function buildWeeks(weeksData) {
  return weeksData.map((w) => {
    const raceDate = new Date(w.raceDate + "T12:00:00");
    const weekStart = mondayOf(raceDate);
    const weekEnd = sundayOf(raceDate);
    return { ...w, raceDate, weekStart, weekEnd };
  });
}

function findCurrentWeek(weeks) {
  const now = new Date();
  return weeks.find((w) => now >= w.weekStart && now <= w.weekEnd);
}

function findNextWeek(weeks) {
  const now = new Date();
  return weeks.find((w) => w.weekStart > now);
}

function cardHTML(week, isCurrent) {
  return `
    <article class="card" id="round-${week.round}">
      ${isCurrent ? '<span class="badge">Settimana attuale</span>' : ""}
      <div class="card-main">
        <div class="card-round">Round ${week.round}</div>
        <h3 class="card-circuit">${week.circuit}</h3>
        <div class="card-location">${week.location}, ${week.country}</div>
      </div>
      <div class="card-dates">
        <div class="card-week-range">${formatRange(week.weekStart, week.weekEnd)}</div>
        <div class="card-gp-name">${week.gpName}</div>
      </div>
    </article>
  `;
}

function render(weeks) {
  const current = findCurrentWeek(weeks);
  const currentSection = document.getElementById("current-week");
  const listSection = document.getElementById("calendar-list");
  const select = document.getElementById("filter");

  if (current) {
    currentSection.innerHTML = cardHTML(current, true);
  } else {
    const next = findNextWeek(weeks);
    currentSection.innerHTML = `
      <div class="card">
        <div class="card-main">
          <div class="card-round">Nessun GP questa settimana</div>
          <h3 class="card-circuit">${next ? "Prossimo: " + next.circuit : "Stagione conclusa"}</h3>
        </div>
      </div>
    `;
  }

  listSection.innerHTML = weeks
    .map((w) => cardHTML(w, current && w.round === current.round))
    .join("");

  select.innerHTML = weeks
    .map((w) => `<option value="round-${w.round}">Round ${w.round} — ${w.circuit}</option>`)
    .join("");

  select.addEventListener("change", () => {
    const el = document.getElementById(select.value);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

async function init() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();
    const weeks = buildWeeks(data.weeks);
    render(weeks);
  } catch (err) {
    document.getElementById("calendar-list").innerHTML =
      "<p>Errore nel caricamento del calendario.</p>";
    console.error(err);
  }
}

init();
