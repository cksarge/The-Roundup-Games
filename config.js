/* ================================================================
   THE ROUNDUP GAMES — CONFIG
   ----------------------------------------------------------------
   This file is shared by every page (index.html, mini-crossword.html,
   weekly-crossword.html, guess-the-teacher.html, special-edition.html,
   archive.html) — so you only ever edit game content in ONE place.

   HOW THIS WORKS NOW
   -----------------------------------------------------------------
   Every daily puzzle (Mini Crossword + Guess the Teacher) lives in
   ONE list: DAILY_PUZZLES. Every Weekly Crossword lives in ONE list:
   WEEKLY_PUZZLES. Past, present, and future puzzles all sit in the
   same list, in any order — there's no more manually cutting
   "today" into an archive.

   SPECIAL_PUZZLES works a little differently (see its own section
   below) — each entry is only "live" between its own start date and
   end date, then it moves to the archive on its own. It's a one-off
   game slot (any embed type — a crossword one time, a spelling bee
   the next, etc.) for things like school breaks or special events,
   not a regular recurring game.

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
   • SPECIAL_PUZZLES — every Special Edition game, one entry per
     occasion, each with its own start/end date. See its own section
     below for details.
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
const SITE_VERSION = "1.2.1";

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
    isoDate: "2026-08-21",
    date: "August 21, 2026",
    crossword: {
      difficulty: "3/5",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupaug21&set=carter"
    },
    guessTheTeacher: {
      difficulty: "2/5",
      answer: "Sr. Leyba",
      clues: [
        "This teacher is of Native American ancestry.",
        "This teacher teaches a language class.",
        "He teaches in Keating."
      ]
    }
  },
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

/* ----------------------------------------------------------------
   SPECIAL EDITION — one-off games (school breaks, special events)
   ----------------------------------------------------------------
   Unlike DAILY_PUZZLES/WEEKLY_PUZZLES, a Special Edition doesn't
   roll forward and keep showing until you add the next one — it
   only shows up between its own startIsoDate and endIsoDate, then
   automatically moves to the archive the day after endIsoDate.
   Before startIsoDate, it doesn't exist anywhere on the site — no
   homepage card, no hint, nothing.

   Each entry:
     startIsoDate — "yyyy-mm-dd". First day it's shown as live.
     endIsoDate   — "yyyy-mm-dd". Last day it's shown as live —
                    the day after this, it moves to the archive.
                    Can be the same as startIsoDate for a one-day
                    special.
     date         — the display label shown to visitors, e.g.
                    "December 15–19, 2026" or "Homecoming Week".
                    Typed by hand on purpose, so you can customize
                    it — it does NOT have to match the isoDates'
                    format.
     theme        — short label describing this occasion, e.g.
                    "Winter Break" or "Homecoming Week". Shown
                    prominently on the homepage card and on the
                    Special Edition page itself.
     difficulty   — e.g. "3/5". Optional — leave "" if not
                    applicable to this particular embed type.
     embedUrl     — the embed link. Can be any embed type (a
                    crossword one time, a spelling bee the next,
                    etc.) — it's just shown in an iframe, so there's
                    no need to describe it as one specific game type
                    anywhere in this file.

   You can have entries for multiple occasions in this list at once,
   past/present/future all mixed together, same as the lists above.
   ---------------------------------------------------------------- */

/* EXAMPLE FOR SPECIAL EDITION

  {
    startIsoDate: "",
    endIsoDate: "",
    date: "",
    theme: "",
    difficulty: "",
    embedUrl: ""
  },

*/

const SPECIAL_PUZZLES = [
  {
    startIsoDate: "2026-08-18",
    endIsoDate: "2026-08-28",
    date: "First Week of Roundup Games",
    theme: "Welcome to The Roundup Games",
    difficulty: "3/5",
    embedUrl: "https://puzzleme.amuselabs.com/pmm/wordf?id=roundupspecial1&set=carter"
  }
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

/* Special Edition uses a different rule than resolvePuzzleSet above:
   each entry has its own startIsoDate/endIsoDate range instead of
   rolling forward indefinitely.
     current — the entry whose range contains today, or null if none
     archive — every entry whose endIsoDate has already passed
   An entry whose startIsoDate hasn't arrived yet is skipped
   entirely — not current, not archive, invisible. */
function resolveSpecialPuzzle(entries){
  const todayIso = getTodayIsoDate();
  const sorted = [...entries].sort((a, b) => (a.startIsoDate < b.startIsoDate ? -1 : a.startIsoDate > b.startIsoDate ? 1 : 0));

  let current = null;
  const archive = [];

  for (const entry of sorted) {
    if (entry.startIsoDate > todayIso) continue; // hasn't started yet — invisible
    if (entry.endIsoDate < todayIso) {
      archive.push(entry); // already over
    } else {
      current = entry; // live today
    }
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

const SPECIAL_RESOLVED = resolveSpecialPuzzle(SPECIAL_PUZZLES);
const SPECIAL_EDITION = SPECIAL_RESOLVED.current; // null when nothing is live today
const SPECIAL_ARCHIVE = SPECIAL_RESOLVED.archive;

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
  if (data.isoDate) wrap.dataset.statsWinId = data.isoDate;
  if (!data.crossword || !data.crossword.embedUrl || data.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL has been set for this edition yet.</div>`;
    return;
  }
  wrap.innerHTML = `<iframe src="${data.crossword.embedUrl}" title="Daily crossword — ${dateLabel || ""}" loading="lazy"></iframe>`;
}

/* ---------- special edition embed ----------
   Generic — unlike renderCrossword above, this doesn't assume the
   embed is a crossword, since a Special Edition can be any embed
   type (spelling bee, trivia, etc.) depending on the occasion. */
function renderSpecialEmbed(mountId, embedUrl, titleLabel, winId){
  const wrap = document.getElementById(mountId);
  if (!wrap) return;
  if (winId) wrap.dataset.statsWinId = winId;
  if (!embedUrl || embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No embed URL has been set for this special edition yet.</div>`;
    return;
  }
  wrap.innerHTML = `<iframe src="${embedUrl}" title="${titleLabel}" loading="lazy"></iframe>`;
}

/* ---------- crossword embed completion messages ----------
   AmuseLabs PuzzleMe embeds (crosswords, spelling bees, etc.) post a
   message to the parent page via window.postMessage when a puzzle
   is completed. The embed already shows its own "you finished!"
   screen, so we don't display anything here — we just use this to
   record a win in stats (see STAT_GAMES / recordWin below). The
   AmuseLabs puzzle id (present both in the message and in that
   embed's iframe src) is only used to find the right wrap on the
   page — the win itself is recorded under that wrap's own
   data-stats-win-id (the site's own isoDate for that puzzle), so
   wins line up with DAILY_PUZZLES/WEEKLY_PUZZLES/SPECIAL_PUZZLES for
   streak calculations regardless of AmuseLabs' internal id. */
const AMUSELABS_ORIGIN = "https://puzzleme.amuselabs.com";

function initPuzzleCompletionListener(){
  window.addEventListener("message", (event) => {
    if (event.origin !== AMUSELABS_ORIGIN) return;
    const data = event.data;
    if (!data || data.type !== "PUZZLE_COMPLETE" || !data.completedCorrectly || !data.id) return;

    document.querySelectorAll(".crossword-frame-wrap iframe").forEach(iframe => {
      if (iframe.src.indexOf(data.id) !== -1) {
        const wrap = iframe.closest(".crossword-frame-wrap");
        const category = wrap && wrap.dataset.statsCategory;
        const winId = wrap && wrap.dataset.statsWinId;
        if (category && winId) recordWin(category, winId);
      }
    });
  });
}

/* ---------- special edition homepage card (index.html only) ----------
   Live: a large, prominent banner above the regular games grid.
   Not live: a normal card at the very bottom of the grid, still
   linking to special-edition.html (which explains there's nothing
   live right now). */
function renderSpecialHomepageCard(){
  const bannerMount = document.getElementById("specialBanner");
  const gridMount = document.getElementById("gameCards");

  if (SPECIAL_EDITION) {
    if (bannerMount) {
      bannerMount.innerHTML = `
        <a class="special-banner" href="special-edition.html">
          <span class="special-banner__eyebrow">✦ Special Edition</span>
          <h2 class="special-banner__theme">${escapeHtml(SPECIAL_EDITION.theme)}</h2>
          <p class="special-banner__meta">${withDifficulty(SPECIAL_EDITION.date, SPECIAL_EDITION.difficulty)}</p>
          <span class="btn">Play →</span>
        </a>
      `;
    }
    return;
  }

  if (bannerMount) bannerMount.innerHTML = "";
  if (!gridMount) return;
  const card = document.createElement("article");
  card.className = "game-card";
  card.innerHTML = `
    <div class="game-card__row"><span>Special Edition</span></div>
    <h2>Special Edition</h2>
    <p>A one-off game for school breaks and special occasions — a different kind of puzzle every time, so check back.</p>
    <a class="btn" href="special-edition.html">Play →</a>
  `;
  gridMount.appendChild(card);
}

/* ---------- special edition page (special-edition.html only) ---------- */
function renderSpecialEditionPage(){
  const titleEl = document.getElementById("specialTitle");
  const descEl = document.getElementById("specialDesc");
  const headingEl = document.getElementById("specialPanelHeading");
  const dateEl = document.getElementById("specialDate");

  if (!SPECIAL_EDITION) {
    if (headingEl) headingEl.textContent = "No Special Edition Today";
    if (dateEl) dateEl.textContent = "";
    const wrap = document.getElementById("specialFrameWrap");
    if (wrap) wrap.innerHTML = `<div class="crossword-fallback">Sorry, but there is no special edition game today. Check back during school breaks and special occasions.</div>`;
    return;
  }

  if (titleEl) titleEl.textContent = SPECIAL_EDITION.theme;
  if (descEl) descEl.textContent = "A special one-off game, live for a limited time — enjoy it while it lasts.";
  if (headingEl) headingEl.textContent = "Play";
  if (dateEl) dateEl.textContent = withDifficulty(SPECIAL_EDITION.date, SPECIAL_EDITION.difficulty);
  renderSpecialEmbed("specialFrameWrap", SPECIAL_EDITION.embedUrl, `Special Edition — ${SPECIAL_EDITION.theme}`, SPECIAL_EDITION.startIsoDate);
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

/* ---------- win stats (stats.html) ----------
   Tracks how many times the player has won each game, stored per
   browser in localStorage. Each category stores an array of unique
   win ids — that puzzle's isoDate (startIsoDate for Special Edition)
   — rather than a plain counter, so recording the same win twice
   (an embed re-firing its completion message, or backfilling below)
   never double counts, and so streaks (see computeStreak) can check
   "was this specific day won" directly.

   `streak` marks which categories get a streak — daily/weekly games
   only, not Special Edition (it's a one-off, not a recurring
   schedule, so "consecutive" doesn't mean anything for it). */
const STATS_STORAGE_KEY = "roundup:stats";
const STAT_GAMES = [
  { id: "miniCrossword", label: "Mini Crossword", streak: true, streakUnit: "day" },
  { id: "weeklyCrossword", label: "Weekly Crossword", streak: true, streakUnit: "week" },
  { id: "guessTheTeacher", label: "Guess the Teacher", streak: true, streakUnit: "day" },
  { id: "specialEdition", label: "Special Edition", streak: false, streakUnit: null }
];

function loadStats(){
  const raw = loadGameState(STATS_STORAGE_KEY);
  const stats = {};
  STAT_GAMES.forEach(game => {
    stats[game.id] = (raw && Array.isArray(raw[game.id])) ? raw[game.id] : [];
  });
  return stats;
}

function recordWin(category, winId){
  if (!winId || !STAT_GAMES.some(game => game.id === category)) return;
  const stats = loadStats();
  if (!stats[category].includes(winId)) {
    stats[category].push(winId);
    saveGameState(STATS_STORAGE_KEY, stats);
  }
}

function getWinCount(category){
  return loadStats()[category].length;
}

/* the published-puzzle list a category's streak/backfill is checked
   against, each as { isoDate, label } and already limited to
   puzzles whose date has actually arrived (no crediting the future) */
function getPublishedEntries(category){
  const todayIso = getTodayIsoDate();
  if (category === "weeklyCrossword") {
    return [...WEEKLY_PUZZLES]
      .filter(e => e.isoDate <= todayIso)
      .sort((a, b) => (a.isoDate < b.isoDate ? -1 : 1))
      .map(e => ({ isoDate: e.isoDate, label: e.date }));
  }
  if (category === "specialEdition") {
    return [...SPECIAL_PUZZLES]
      .filter(e => e.startIsoDate <= todayIso)
      .sort((a, b) => (a.startIsoDate < b.startIsoDate ? -1 : 1))
      .map(e => ({ isoDate: e.startIsoDate, label: e.date }));
  }
  // miniCrossword and guessTheTeacher both run off DAILY_PUZZLES
  return [...DAILY_PUZZLES]
    .filter(e => e.isoDate <= todayIso)
    .sort((a, b) => (a.isoDate < b.isoDate ? -1 : 1))
    .map(e => ({ isoDate: e.isoDate, label: e.date }));
}

/* Current streak for a daily/weekly category: consecutive published
   entries won, counting backward from the most recent one. If the
   very latest entry (today's day, or this week) hasn't been played
   yet, it's skipped rather than treated as a break — the streak
   reflects "every opportunity you've actually had so far," and only
   really breaks once a day/week passes with nothing recorded for it. */
function computeStreak(category){
  const game = STAT_GAMES.find(g => g.id === category);
  if (!game || !game.streak) return null;

  const wins = loadStats()[category];
  const entries = getPublishedEntries(category);

  let i = entries.length - 1;
  if (i >= 0 && !wins.includes(entries[i].isoDate)) i--;

  let streak = 0;
  while (i >= 0 && wins.includes(entries[i].isoDate)) {
    streak++;
    i--;
  }
  return streak;
}

/* ---------- recounting wins from before this feature existed ----------
   Two different situations here:

   1. Guess the Teacher already stored win/lose state per puzzle in
      localStorage long before stats existed (see mountTeacherGame),
      so any past win is still sitting there and can be recovered
      automatically — no guessing involved. This runs once on every
      page load; it's cheap and recordWin's de-dup makes it safe to
      repeat.
   2. Crossword-type embeds (Mini/Weekly/Special) only tell us about
      a completion at the moment it happens via postMessage — there's
      no record of a solve that happened before this feature shipped,
      and no documented way to ask AmuseLabs "was this already solved
      previously." So for those, recounting is a manual, honest
      self-report (see renderStatsPage's "add a past win" control)
      rather than something we can detect automatically. */
function backfillGuessTheTeacherWins(){
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key.indexOf("roundup:teacher:") !== 0) continue;
      const state = loadGameState(key);
      if (!state || !state.won) continue;

      const suffix = key.slice("roundup:teacher:".length);
      let isoDate = null;
      if (suffix.indexOf("archive::") === 0) {
        isoDate = suffix.slice("archive::".length);
      } else if (suffix.indexOf("today::") === 0) {
        const dateLabel = suffix.slice("today::".length);
        const match = DAILY_PUZZLES.find(entry => entry.date === dateLabel);
        if (match) isoDate = match.isoDate;
      }
      if (isoDate) recordWin("guessTheTeacher", isoDate);
    }
  } catch (e) {
    // localStorage unavailable — nothing to backfill
  }
}

/* one-time cleanup for anyone who had stats recorded under the
   previous version, where crossword wins were stored keyed by the
   AmuseLabs puzzle id instead of the site's own isoDate — maps each
   old id back to its isoDate (by matching it against embedUrls) so
   existing wins keep counting and can feed streaks going forward. */
function migrateCrosswordWinIds(){
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  const sources = {
    miniCrossword: DAILY_PUZZLES.map(e => ({ needle: e.crossword && e.crossword.embedUrl, isoDate: e.isoDate })),
    weeklyCrossword: WEEKLY_PUZZLES.map(e => ({ needle: e.crossword && e.crossword.embedUrl, isoDate: e.isoDate })),
    specialEdition: SPECIAL_PUZZLES.map(e => ({ needle: e.embedUrl, isoDate: e.startIsoDate }))
  };

  const stats = loadStats();
  let changed = false;

  ["miniCrossword", "weeklyCrossword", "specialEdition"].forEach(category => {
    const migrated = stats[category].map(id => {
      if (isoPattern.test(id)) return id;
      const match = sources[category].find(s => s.needle && s.needle.indexOf(id) !== -1);
      if (match) { changed = true; return match.isoDate; }
      return id;
    });
    stats[category] = [...new Set(migrated)];
  });

  if (changed) saveGameState(STATS_STORAGE_KEY, stats);
}

/* Run immediately (not gated behind DOMContentLoaded) — these are
   pure localStorage operations with no DOM dependency, and need to
   have already happened before any page-specific inline script
   (e.g. stats.html's renderStatsPage()) reads stats, since that
   script runs before DOMContentLoaded fires. */
migrateCrosswordWinIds();
backfillGuessTheTeacherWins();

/* ---------- Guess the Teacher widget factory ----------
   `storageKey` should be a short unique string for this specific
   puzzle (e.g. today's date, or an archive entry's date) — it's
   what remembers a player's guesses across a reload, and what
   makes a *new* puzzle (a new storageKey) start fresh. `winId`
   should be that same puzzle's isoDate — kept separate from
   storageKey since it's what stats/streaks are recorded against,
   and needs to stay stable and isoDate-shaped regardless of how
   storageKey is formatted. */
function mountTeacherGame(container, data, storageKey, winId){
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
      if (state.won && winId) recordWin("guessTheTeacher", winId);
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
   One generic list/toggle renderer, used for all three archive
   sections. Each row's detail panel is its own list item directly
   below that row (not a single shared panel below the whole list),
   so "View" expands content right where you clicked it. */
function renderArchiveSection(listElId, entries, renderDetail, getRowLabel){
  const listEl = document.getElementById(listElId);
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
    <li class="archive-row-detail" data-detail-index="${i}" hidden></li>
  `).join("");

  let openIndex = null;

  listEl.querySelectorAll("[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      const detailEl = listEl.querySelector(`[data-detail-index="${index}"]`);

      if (openIndex === index) {
        // this entry is already open — collapse it
        detailEl.innerHTML = "";
        detailEl.hidden = true;
        btn.textContent = "View →";
        btn.setAttribute("aria-expanded", "false");
        openIndex = null;
        return;
      }

      // switching to a different entry (or opening for the first time) —
      // reset whichever row was previously showing "Hide"
      if (openIndex !== null) {
        const prevBtn = listEl.querySelector(`[data-index="${openIndex}"]`);
        const prevDetailEl = listEl.querySelector(`[data-detail-index="${openIndex}"]`);
        if (prevBtn) {
          prevBtn.textContent = "View →";
          prevBtn.setAttribute("aria-expanded", "false");
        }
        if (prevDetailEl) {
          prevDetailEl.innerHTML = "";
          prevDetailEl.hidden = true;
        }
      }

      renderDetail(sorted[index], detailEl);
      detailEl.hidden = false;
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
        <div class="crossword-frame-wrap" id="archiveCrosswordWrap" data-stats-category="miniCrossword" data-stats-win-id="${entry.isoDate}"></div>
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

  mountTeacherGame(document.getElementById("archiveTeacherMount"), entry, `archive::${entry.isoDate}`, entry.isoDate);
}

function renderWeeklyCrosswordArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Weekly Crossword</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.difficulty)}</span>
      </div>
      <div class="panel__body">
        <div class="crossword-frame-wrap" id="weeklyArchiveCrosswordWrap" data-stats-category="weeklyCrossword" data-stats-win-id="${entry.isoDate}"></div>
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
    "archiveList", ARCHIVE, renderMiniCrosswordArchiveDetail,
    entry => entry.date
  );
}

function renderWeeklyArchive(){
  renderArchiveSection(
    "weeklyArchiveList", WEEKLY_ARCHIVE, renderWeeklyCrosswordArchiveDetail,
    entry => entry.date
  );
}

function renderSpecialEditionArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>${escapeHtml(entry.theme)}</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.difficulty)}</span>
      </div>
      <div class="panel__body">
        <div class="crossword-frame-wrap" id="specialArchiveWrap" data-stats-category="specialEdition"></div>
      </div>
    </div>
  `;
  renderSpecialEmbed("specialArchiveWrap", entry.embedUrl, `Special Edition — ${entry.theme}`, entry.startIsoDate);
}

function renderSpecialArchive(){
  renderArchiveSection(
    "specialArchiveList", SPECIAL_ARCHIVE, renderSpecialEditionArchiveDetail,
    entry => `${entry.theme} — ${entry.date}`
  );
}

/* ---------- stats page (stats.html only) ---------- */
function renderStatsPage(){
  const listEl = document.getElementById("statsList");
  if (!listEl) return;

  listEl.innerHTML = STAT_GAMES.map(game => {
    const count = getWinCount(game.id);
    const streak = computeStreak(game.id);
    const wins = loadStats()[game.id];
    const options = getPublishedEntries(game.id).map(entry =>
      `<option value="${entry.isoDate}">${wins.includes(entry.isoDate) ? "✓ " : ""}${escapeHtml(entry.label)}</option>`
    ).join("");

    return `
      <li class="stats-row">
        <div class="stats-row__top">
          <span class="stats-row__label">${game.label}</span>
          <span class="stats-row__count">${count} win${count === 1 ? "" : "s"}${streak !== null ? ` · ${streak} ${game.streakUnit}${streak === 1 ? "" : "s"} streak` : ""}</span>
        </div>
        <details class="stats-recount">
          <summary>Add a past win</summary>
          <div class="stats-recount__form">
            <select data-recount-select="${game.id}">
              <option value="">Choose an edition…</option>
              ${options}
            </select>
            <button class="btn btn--ghost" type="button" data-recount-btn="${game.id}">Mark as won</button>
          </div>
        </details>
      </li>
    `;
  }).join("");

  listEl.querySelectorAll("[data-recount-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.recountBtn;
      const select = listEl.querySelector(`[data-recount-select="${category}"]`);
      if (select && select.value) {
        recordWin(category, select.value);
        renderStatsPage();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  document.getElementById("siteVersion") && (document.getElementById("siteVersion").textContent = SITE_VERSION);
  initEditionLabel();
  initPuzzleCompletionListener();
});
