const DATA_URL = "data/calendar.json";

const TYPE_LABELS = {
  f1: "GP F1 reale",
  unified: "Circuito unificato",
};

function parseDay(iso) {
  return new Date(iso + "T00:00:00");
}

function endOfDay(iso) {
  return new Date(iso + "T23:59:59");
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
  return weeksData.map((w) => ({
    ...w,
    weekStartDate: parseDay(w.weekStart),
    weekEndDate: endOfDay(w.weekEnd),
  }));
}

function findCurrentWeek(weeks) {
  const now = new Date();
  return weeks.find((w) => now >= w.weekStartDate && now <= w.weekEndDate);
}

function findNextWeek(weeks) {
  const now = new Date();
  return weeks.find((w) => w.weekStartDate > now);
}

function typeBadge(type) {
  return `<span class="type-badge type-${type}">${TYPE_LABELS[type] || type}</span>`;
}

function cardHTML(week, isCurrent) {
  return `
    <article class="card" id="week-${week.sequence}">
      ${isCurrent ? '<span class="badge">Settimana attuale</span>' : ""}
      <div class="card-main">
        <div class="card-round">Settimana ${week.sequence}</div>
        <h3 class="card-circuit">${week.circuit}</h3>
        <div class="card-location">${week.country}</div>
      </div>
      <div class="card-dates">
        <div class="card-week-range">${formatRange(week.weekStartDate, week.weekEndDate)}</div>
        ${typeBadge(week.type)}
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
          <div class="card-round">Nessuna settimana attiva</div>
          <h3 class="card-circuit">${next ? "Prossimo: " + next.circuit : "Calendario concluso"}</h3>
        </div>
      </div>
    `;
  }

  listSection.innerHTML = weeks
    .map((w) => cardHTML(w, current && w.sequence === current.sequence))
    .join("");

  select.innerHTML = weeks
    .map((w) => `<option value="week-${w.sequence}">Settimana ${w.sequence} — ${w.circuit} (${w.country})</option>`)
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
