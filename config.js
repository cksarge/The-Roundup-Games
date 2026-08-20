/* ================================================================
   THE ROUNDUP GAMES — CONFIG
   ----------------------------------------------------------------
   This file is shared by every page (index.html, mini-crossword.html,
   weekly-crossword.html, guess-the-teacher.html, archive.html) — so
   you only ever edit game content in ONE place.

   HOW THIS WORKS NOW
   -----------------------------------------------------------------
   Every daily puzzle (Mini Crossword + Guess the Teacher) lives in
   ONE list: DAILY_PUZZLES. Every Weekly Crossword lives in ONE list:
   WEEKLY_PUZZLES. Past, present, and future puzzles all sit in the
   same list, in any order — there's no more manually cutting
   "today" into an archive.

   Each entry just has an isoDate ("2026-08-19"). Using the visitor's
   own device clock, the site figures out on its own:
     • which entry is "current" (shown as today's puzzle) —
       the entry with the LATEST isoDate that is not after today.
       If nothing is dated today, the most recent past entry keeps
       showing (so a puzzle never disappears just because you
       haven't published a replacement yet — handy for weekends,
       or a Monday Weekly Crossword you haven't updated yet).
     • which entries are "archive" — every entry older than the
       current one.
     • which entries are "future" — anything dated after today.
       These are completely invisible: not shown as current, not
       shown in the archive, no mention anywhere, until their date
       arrives.

   To publish a new day (or week), just add a new entry to the list
   with tomorrow's (or next Monday's) isoDate — you can do this
   whenever you want, even days in advance. It'll sit there doing
   nothing until its date actually arrives, at which point it
   automatically becomes "today," and whatever was showing before
   it automatically slides into the archive.

   To fix a mistake in a past puzzle, just edit that entry directly
   in the list — no separate archive file to hunt through.

   • TODAY_DATE — auto-generated from today's real date, shown in
     the header. No need to edit this.
   • DAILY_PUZZLES — every Mini Crossword + Guess the Teacher, past/
     present/future, in one list. See resolution rules above.
   • WEEKLY_PUZZLES — every Weekly Crossword, same idea.
   • GAMES — controls the cards on the homepage.
   • SITE_VERSION — shown in the footer. Bump it whenever you want.
   ================================================================ */

/* TODAY'S DATE
   -----------------------------------------------------------------
   Auto-generated from the visitor's own clock, so this always
   shows the real current date — no manual updating needed. */
const TODAY_DATE = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
});

/* SITE VERSION
   -----------------------------------------------------------------
   Shown in the footer, e.g. "Version 1.3". Purely a label for your
   own tracking — change it to whatever you want, whenever you want. */
const SITE_VERSION = "1.0";

/* ----------------------------------------------------------------
   DAILY PUZZLES — Mini Crossword + Guess the Teacher
   ----------------------------------------------------------------
   One object per day, any order, past/present/future all mixed
   together — it's sorted out automatically (see the big note up
   top). Each entry:

     isoDate  — "yyyy-mm-dd". This is what the site actually uses
                to decide past vs. present vs. future. Get this
                right or the whole thing shows on the wrong day.
     date     — the display label shown to visitors, e.g.
                "August 19, 2026". Typed by hand on purpose, so you
                can customize it (e.g. "Homecoming Week Special")
                — it does NOT have to match isoDate's format.
     crossword.difficulty / .embedUrl
     guessTheTeacher.difficulty / .answer / .clues
   ---------------------------------------------------------------- */

/* EXAMPLE FOR DAILY PUZZLES

  {
    isoDate: "",
    date: "",
    crossword: {
      difficulty: "",
      embedUrl: ""
    },
    guessTheTeacher: {
      difficulty: "",
      answer: "",
      clues: [
        "",
        "",
        ""
      ]
    }
  },

*/

const DAILY_PUZZLES = [
  {
    isoDate: "2026-08-20",
    date: "August 20, 2026",
    crossword: {
      difficulty: "3/5",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupaug20&set=carter"
    },
    guessTheTeacher: {
      difficulty: "2/5",
      answer: "Mr. Middlemist",
      clues: [
        "This teacher's classroom is in 2F Eller.",
        "This teacher loves sci-fi, Star Wars especially.",
        "This teacher's department is English."
      ]
    }
  },
  {
    isoDate: "2026-08-19",
    date: "August 19, 2026",
    crossword: {
      difficulty: "2/5",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupaug19&set=carter"
    },
    guessTheTeacher: {
      difficulty: "3/5",
      answer: "Mr. Lewkowitz",
      clues: [
        "This teacher is teaching an all-new class this year.",
        "It's this teacher's first year here at Brophy.",
        "This teacher works in the IC."
      ]
    }
  }

  // TO SCHEDULE A FUTURE DAY: add another object here with a
  // later isoDate, e.g. "2026-08-20". It stays completely hidden
  // — not shown as current, not in the archive — until that date
  // actually arrives on the visitor's clock.
];

/* ----------------------------------------------------------------
   WEEKLY PUZZLES — Weekly Crossword
   ----------------------------------------------------------------
   Same idea as DAILY_PUZZLES above: one object per week, any
   order, past/present/future all mixed together. isoDate should
   be the Monday that week's puzzle goes live.
   ---------------------------------------------------------------- */

/* EXAMPLE FOR WEEKLY PUZZLES

  {
    isoDate: "",
    date: "",
    difficulty: "",
    crossword: {
      embedUrl: ""
    }
  },

*/

const WEEKLY_PUZZLES = [
  {
    isoDate: "2026-08-17",
    date: "Week of August 17, 2026",
    difficulty: "4/5",
    crossword: {
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupweekaug17&set=carter"
    }
  }

  // TO SCHEDULE A FUTURE WEEK: add another object here with next
  // Monday's isoDate — same rule, stays hidden until that date
  // arrives.
];

/* ================================================================
   RESOLUTION LOGIC — figures out present/past/future from the
   lists above using the visitor's own device clock. You shouldn't
   need to touch this.
   ================================================================ */

/* Today's date as "yyyy-mm-dd", built from local date parts (not
   UTC) so it lines up with how isoDate is written above. */
function getTodayIsoDate(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* Given a list of { isoDate, ... } entries, returns:
     current — the entry with the latest isoDate that isn't in the
               future (or null if every entry is in the future, or
               the list is empty)
     archive — every entry older than `current`, unsorted
   Entries dated after today are simply skipped entirely — they
   end up in neither `current` nor `archive`. */
function resolvePuzzleSet(entries){
  const todayIso = getTodayIsoDate();
  const sorted = [...entries].sort((a, b) => (a.isoDate < b.isoDate ? -1 : a.isoDate > b.isoDate ? 1 : 0));

  let current = null;
  const archive = [];

  for (const entry of sorted) {
    if (entry.isoDate <= todayIso) {
      if (current) archive.push(current);
      current = entry;
    }
    // entry.isoDate > todayIso: a future puzzle — skip it entirely
  }

  return { current, archive };
}

/* Shown when a list has no entry dated today or earlier yet (e.g.
   brand new site, or every entry you've added so far is a future
   one). Keeps the rest of the page from breaking. */
const FALLBACK_DAILY = {
  isoDate: null,
  date: "No puzzle published yet",
  crossword: { difficulty: null, embedUrl: "" },
  guessTheTeacher: null
};
const FALLBACK_WEEKLY = {
  isoDate: null,
  date: "No puzzle published yet",
  difficulty: null,
  crossword: { embedUrl: "" }
};

const DAILY_RESOLVED = resolvePuzzleSet(DAILY_PUZZLES);
const TODAY = DAILY_RESOLVED.current || FALLBACK_DAILY;
const ARCHIVE = DAILY_RESOLVED.archive;

const WEEKLY_RESOLVED = resolvePuzzleSet(WEEKLY_PUZZLES);
const WEEKLY_CROSSWORD = WEEKLY_RESOLVED.current || FALLBACK_WEEKLY;
const WEEKLY_ARCHIVE = WEEKLY_RESOLVED.archive;

/* ----------------------------------------------------------------
   GAMES LIST
   Controls the cards shown on the homepage. `href` is the page the
   Play button links to — add a new game by adding an entry here
   and building its page the same way mini-crossword.html or
   guess-the-teacher.html are built.
   `date` is what shows on the card. The crossword and Guess the
   Teacher cards default to TODAY.date above, so they stay in sync
   automatically — you don't need to edit it here too. Leave `href`
   as null for a game that isn't playable yet (like the placeholder
   below) — it'll show as a quiet "coming soon" card with no link.
   ---------------------------------------------------------------- */
const GAMES = [
  {
    id: "mini-crossword",
    title: "Mini Crossword",
    blurb: "A fresh grid every school day — quotes, campus lingo, and the occasional Latin motto.",
    date: TODAY.date,
    difficulty: TODAY.crossword.difficulty,
    href: "mini-crossword.html"
  },
  {
    id: "weekly-crossword",
    title: "Weekly Crossword",
    blurb: "A bigger, themed puzzle — posted every Monday.",
    date: WEEKLY_CROSSWORD.date,
    difficulty: WEEKLY_CROSSWORD.difficulty,
    href: "weekly-crossword.html"
  },
  {
    id: "guess-teacher",
    title: "Guess the Teacher",
    blurb: "Three clues, hardest to easiest, three guesses. Can you name the faculty member?",
    date: TODAY.date,
    difficulty: TODAY.guessTheTeacher ? TODAY.guessTheTeacher.difficulty : null,
    href: "guess-the-teacher.html"
  },
  {
    id: "coming-soon",
    title: "More Games Coming Soon",
    blurb: "We're building out the rest of the puzzle page. Check back for new additions.",
    date: null,
    difficulty: null,
    href: null
  }
];

/* ================================================================
   END CONFIG — shared rendering logic below.
   You shouldn't need to touch anything past this line.
   ================================================================ */

function initEditionLabel(){
  const el = document.getElementById("editionLabel");
  if (el) el.textContent = TODAY_DATE;
}

function normalizeAnswer(str){
  return str
    .toLowerCase()
    .replace(/\bmr\.?\b|\bmrs\.?\b|\bms\.?\b|\bdr\.?\b|\bfr\.?\b/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- homepage game cards ---------- */
function renderGameCards(){
  const mount = document.getElementById("gameCards");
  if (!mount) return;
  mount.innerHTML = "";
  GAMES.forEach(game => {
    const isPlayable = !!game.href;
    const card = document.createElement("article");
    card.className = "game-card" + (isPlayable ? "" : " is-disabled");
    card.innerHTML = `
      <div class="game-card__row">
        <span>${game.date || "Coming Soon"}${game.difficulty ? ` • Difficulty: ${game.difficulty}` : ""}</span>
      </div>
      <h2>${game.title}</h2>
      <p>${game.blurb}</p>
      ${
        isPlayable
          ? `<a class="btn" href="${game.href}">Play →</a>`
          : `<span class="btn">In the works</span>`
      }
    `;
    mount.appendChild(card);
  });
}

/* ---------- crossword embed ---------- */
function renderCrossword(mountId, dateId, data, dateLabel){
  const dateEl = document.getElementById(dateId);
  if (dateEl) dateEl.textContent = dateLabel || "";
  const wrap = document.getElementById(mountId);
  if (!wrap) return;
  if (!data.crossword || !data.crossword.embedUrl || data.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL has been set for this edition yet.</div>`;
    return;
  }
  wrap.innerHTML = `<iframe src="${data.crossword.embedUrl}" title="Daily crossword — ${dateLabel || ""}" loading="lazy"></iframe>`;
}

/* ---------- tiny localStorage helpers (used to remember guesses) ---------- */
function loadGameState(key){
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveGameState(key, state){
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    // localStorage unavailable (private browsing, etc.) — game still
    // works, it just won't remember guesses across a reload.
  }
}
function escapeHtml(str){
  return str.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

/* ---------- Guess the Teacher widget factory ----------
   `storageKey` should be a short unique string for this specific
   puzzle (e.g. today's date, or an archive entry's date) — it's
   what remembers a player's guesses across a reload, and what
   makes a *new* puzzle (a new storageKey) start fresh. */
function mountTeacherGame(container, data, storageKey){
  if (!data.guessTheTeacher || !data.guessTheTeacher.answer) {
    container.innerHTML = `<div class="crossword-fallback">No Guess the Teacher puzzle has been set for this edition yet.</div>`;
    return;
  }

  const clues = data.guessTheTeacher.clues;
  const answer = data.guessTheTeacher.answer;
  const clueLabels = ["Hardest", "Medium", "Easiest"];
  const maxAttempts = 3;
  const stateKey = storageKey ? `roundup:teacher:${storageKey}` : null;

  let state = (stateKey && loadGameState(stateKey)) || {
    attemptsUsed: 0,
    guesses: [],   // { text, correct }
    finished: false,
    won: false
  };

  container.innerHTML = `
    <ol class="teacher-game__clues"></ol>
    <form class="teacher-game__form" autocomplete="off">
      <input class="teacher-game__input" type="text" placeholder="Type your guess…" aria-label="Guess the teacher's name" />
      <button class="btn" type="submit">Guess</button>
    </form>
    <div class="teacher-game__attempts"></div>
    <ul class="teacher-game__guesses"></ul>
    <div class="teacher-game__result"></div>
  `;

  const clueList = container.querySelector(".teacher-game__clues");
  const form = container.querySelector("form");
  const input = container.querySelector(".teacher-game__input");
  const attemptsEl = container.querySelector(".teacher-game__attempts");
  const guessesEl = container.querySelector(".teacher-game__guesses");
  const resultEl = container.querySelector(".teacher-game__result");

  function draw(){
    const revealedCount = state.finished ? clues.length : Math.min(state.attemptsUsed + 1, clues.length);

    clueList.innerHTML = clues.map((text, i) => `
      <li class="teacher-game__clue ${i < revealedCount ? "is-revealed" : ""}">
        <span class="teacher-game__clue-num">${i + 1}</span>
        <span class="teacher-game__clue-text">
          <span class="teacher-game__clue-label">${clueLabels[i] || ""} clue</span>
          ${text}
        </span>
      </li>
    `).join("");

    let dots = "";
    for (let i = 0; i < maxAttempts; i++) {
      dots += `<span class="teacher-game__dot ${i < state.attemptsUsed ? "is-used" : ""}"></span>`;
    }
    attemptsEl.innerHTML = `${dots}<span>${Math.max(maxAttempts - state.attemptsUsed, 0)} guess${maxAttempts - state.attemptsUsed === 1 ? "" : "es"} left</span>`;

    guessesEl.innerHTML = state.guesses.map((g, i) => `
      <li class="teacher-game__guess ${g.correct ? "is-correct" : "is-wrong"}">
        <span class="teacher-game__guess-num">Guess ${i + 1}</span>
        <span class="teacher-game__guess-text">${escapeHtml(g.text)}</span>
        <span class="teacher-game__guess-mark">${g.correct ? "✓" : "✗"}</span>
      </li>
    `).join("");

    if (state.finished) {
      input.value = "";
      input.disabled = true;
      form.querySelector("button").disabled = true;
      resultEl.classList.add("is-visible", state.won ? "win" : "lose");
      resultEl.textContent = state.won
        ? `Correct — it's ${answer}.`
        : `Out of guesses. The answer was ${answer}.`;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (state.finished) return;
    const guess = input.value.trim();
    if (!guess) return;

    const correct = normalizeAnswer(guess) === normalizeAnswer(answer);
    state.guesses.push({ text: guess, correct });
    input.value = "";

    if (correct) {
      state.finished = true;
      state.won = true;
    } else {
      state.attemptsUsed += 1;
      if (state.attemptsUsed >= maxAttempts) {
        state.finished = true;
        state.won = false;
      }
    }

    if (stateKey) saveGameState(stateKey, state);
    draw();
  });

  draw();
}

/* ---------- archive list + inline detail (archive.html only) ----------
   One generic list/toggle renderer, used twice: once for the Mini
   Crossword + Guess the Teacher archive, once for the Weekly
   Crossword archive. Each takes its own list/detail element ids,
   its own entries array, and a function that knows how to render
   that entry's detail panel(s). */
function renderArchiveSection(listElId, detailElId, entries, renderDetail, getRowLabel){
  const listEl = document.getElementById(listElId);
  const detailEl = document.getElementById(detailElId);
  if (!listEl) return;

  const sorted = [...entries].sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

  if (!sorted.length) {
    listEl.innerHTML = `<li class="archive-empty">No past editions yet — check back after the next issue.</li>`;
    return;
  }

  listEl.innerHTML = sorted.map((entry, i) => `
    <li class="archive-row">
      <span class="archive-row__left">
        <span class="archive-row__date">${getRowLabel ? getRowLabel(entry) : entry.date}</span>
      </span>
      <button class="btn btn--ghost" type="button" data-index="${i}" aria-expanded="false">View →</button>
    </li>
  `).join("");

  let openIndex = null;

  listEl.querySelectorAll("[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);

      if (openIndex === index) {
        // this entry is already open — collapse it
        detailEl.innerHTML = "";
        btn.textContent = "View →";
        btn.setAttribute("aria-expanded", "false");
        openIndex = null;
        return;
      }

      // switching to a different entry (or opening for the first time) —
      // reset whichever button was previously showing "Hide"
      if (openIndex !== null) {
        const prevBtn = listEl.querySelector(`[data-index="${openIndex}"]`);
        if (prevBtn) {
          prevBtn.textContent = "View →";
          prevBtn.setAttribute("aria-expanded", "false");
        }
      }

      renderDetail(sorted[index], detailEl);
      btn.textContent = "Hide";
      btn.setAttribute("aria-expanded", "true");
      openIndex = index;
      detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* small helper: "August 19, 2026" + "Medium" -> "August 19, 2026 • Difficulty: Medium" */
function withDifficulty(dateLabel, difficulty){
  return dateLabel + (difficulty ? ` • Difficulty: ${difficulty}` : "");
}

function renderMiniCrosswordArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Mini Crossword</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.crossword && entry.crossword.difficulty)}</span>
      </div>
      <div class="panel__body">
        <div class="crossword-frame-wrap" id="archiveCrosswordWrap"></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel__head">
        <h2>Guess the Teacher</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.guessTheTeacher && entry.guessTheTeacher.difficulty)}</span>
      </div>
      <div class="panel__body" id="archiveTeacherMount"></div>
    </div>
  `;

  const wrap = document.getElementById("archiveCrosswordWrap");
  if (!entry.crossword || !entry.crossword.embedUrl || entry.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL was saved for this edition.</div>`;
  } else {
    wrap.innerHTML = `<iframe src="${entry.crossword.embedUrl}" title="Mini Crossword — ${entry.date}" loading="lazy"></iframe>`;
  }

  mountTeacherGame(document.getElementById("archiveTeacherMount"), entry, `archive::${entry.isoDate}`);
}

function renderWeeklyCrosswordArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Weekly Crossword</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.difficulty)}</span>
      </div>
      <div class="panel__body">
        <div class="crossword-frame-wrap" id="weeklyArchiveCrosswordWrap"></div>
      </div>
    </div>
  `;

  const wrap = document.getElementById("weeklyArchiveCrosswordWrap");
  if (!entry.crossword || !entry.crossword.embedUrl || entry.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL was saved for this edition.</div>`;
  } else {
    wrap.innerHTML = `<iframe src="${entry.crossword.embedUrl}" title="Weekly Crossword — ${entry.date}" loading="lazy"></iframe>`;
  }
}

function renderArchive(){
  renderArchiveSection(
    "archiveList", "archiveDetail", ARCHIVE, renderMiniCrosswordArchiveDetail,
    entry => entry.date
  );
}

function renderWeeklyArchive(){
  renderArchiveSection(
    "weeklyArchiveList", "weeklyArchiveDetail", WEEKLY_ARCHIVE, renderWeeklyCrosswordArchiveDetail,
    entry => entry.date
  );
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  document.getElementById("siteVersion") && (document.getElementById("siteVersion").textContent = SITE_VERSION);
  initEditionLabel();
});
