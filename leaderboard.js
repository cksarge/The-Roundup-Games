/* ================================================================
   THE ROUNDUP GAMES — LEADERBOARD (Supabase)
   ----------------------------------------------------------------
   Board READS use Supabase's REST API (PostgREST) with plain fetch.
   Board WRITES go through the supabase-js client built in auth.js
   (window.sbClient), so they carry the signed-in user's JWT —
   posting a score needs an account now. Loaded AFTER config.js and
   auth.js, so it can use leaderboardEnabled(), isoWeekKey(),
   currentUser(), currentProfile(), authIdentity(), loadIdentity(),
   formatIdentity(), computeStreak(), puzzleSolveRecord(), escapeHtml(),
   formatTime().

   The tables + Row Level Security + the profile name-stamp / name-check
   triggers are set up in Supabase — see the "Accounts (Supabase Auth)"
   and "Leaderboard (Supabase)" sections of README.md for that SQL.
   Blank SUPABASE_URL / SUPABASE_ANON_KEY in config.js to switch every
   bit of this (accounts + leaderboard) back off.

   Boards, per game:
     metric "score"  → points, higher is better   (Bronco Blitz)
     metric "time"   → seconds, lower is better    (everything else with a speed board)
     metric "streak" → weeks in a row, higher is better  (the weekly puzzles)
   Each metric has a "weekly" board (this ISO week) and an "alltime"
   board (week_key = "all").
   ================================================================ */

const SB_BASE = (typeof SUPABASE_URL === "string" ? SUPABASE_URL : "").replace(/\/+$/, "");

/* Each board: `key` (unique within a game — what the UI passes
   around), `metric` (which stored rows it reads — a game can have
   two boards off the same metric), `agg` ("max"/"min" via
   best-first dedupe, or "sum" to add a person's rows up), `dir`
   (sort), plus display `label`/`unit`. */
const LEADERBOARD_GAMES = [
  { id: "broncoBlitz", label: "Bronco Blitz", kind: "bronco",
    boards: [
      { key: "score", metric: "score", agg: "max", label: "High score", dir: "desc", unit: "pts" },
      { key: "scoreTotal", metric: "score", agg: "sum", label: "Total (all rounds added up)", dir: "desc", unit: "pts" }
    ] },
  { id: "broncoDash", label: "Bronco Dash", kind: "bronco",
    boards: [{ key: "time", metric: "time", agg: "min", label: "Fastest run", dir: "asc" }] },
  { id: "broncoSplash", label: "Bronco Splash", kind: "bronco",
    boards: [{ key: "time", metric: "time", agg: "min", label: "Fastest lap", dir: "asc" }] },
  { id: "weeklyCrossword", label: "Weekly Crossword", kind: "puzzle",
    boards: [
      { key: "time", metric: "time", agg: "min", label: "Fastest solve", dir: "asc" },
      { key: "streak", metric: "streak", agg: "max", label: "Longest streak", dir: "desc", unit: "wks" }
    ] },
  { id: "weeklyWordSearch", label: "Weekly Word Search", kind: "puzzle",
    boards: [
      { key: "time", metric: "time", agg: "min", label: "Fastest solve", dir: "asc" },
      { key: "streak", metric: "streak", agg: "max", label: "Longest streak", dir: "desc", unit: "wks" }
    ] },
  { id: "printCrossword", label: "Print Edition Crossword", kind: "puzzle",
    boards: [{ key: "time", metric: "time", agg: "min", label: "Fastest solve", dir: "asc" }] },
  { id: "specialEdition", label: "Special Edition", kind: "puzzle",
    boards: [{ key: "time", metric: "time", agg: "min", label: "Fastest solve", dir: "asc" }] }
];

function lbGameConfig(gameId){
  return LEADERBOARD_GAMES.find(g => g.id === gameId) || null;
}
function lbBoardConfig(gameId, key){
  const g = lbGameConfig(gameId);
  if (!g) return null;
  return g.boards.find(b => b.key === key) || g.boards[0] || null;
}

/* ---------- name moderation ----------
   The blocklist + lbNameLooksBad() / lbTextMatchesBlocklist() now live
   in config.js (so profile.html can screen a sign-up's first name
   without loading this file). They're global; this file just calls
   them. The AUTHORITATIVE check is the name-check TRIGGER on Supabase
   (on the `profiles` table — see the README "Accounts" section). */

/* ---------- REST helpers ----------
   Board READS are public — plain anon fetch, unchanged. WRITES go
   through the supabase-js client from auth.js (window.sbClient) so
   they carry the signed-in user's JWT; RLS then checks
   auth.uid() = user_id, and a trigger stamps the display
   name / last initial / grad year from that user's profile. */
function lbHeaders(extra){
  const h = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": "Bearer " + SUPABASE_ANON_KEY,
    "Content-Type": "application/json"
  };
  if (extra) Object.keys(extra).forEach(k => { h[k] = extra[k]; });
  return h;
}
function lbInsert(rows){
  if (!leaderboardEnabled() || !window.sbClient || !rows || !rows.length) return Promise.resolve(false);
  return window.sbClient.from("scores").insert(rows)
    .then(({ error }) => !error)
    .catch(() => false);
}

/* Which metrics this ACCOUNT has already posted for a game this week
   — a server-side backstop against re-posting on top of the
   localStorage "solved" / "posted" flags. Resolves to an object like
   { time: true }. */
function lbMetricsPostedThisWeek(gameId){
  const user = (typeof currentUser === "function") ? currentUser() : null;
  if (!leaderboardEnabled() || !user) return Promise.resolve({});
  const qs = [
    "select=metric",
    "game_id=eq." + encodeURIComponent(gameId),
    "board=eq.weekly",
    "week_key=eq." + encodeURIComponent(isoWeekKey()),
    "user_id=eq." + encodeURIComponent(user.id),
    "limit=50"
  ].join("&");
  return fetch(SB_BASE + "/rest/v1/scores?" + qs, { headers: lbHeaders() })
    .then(r => r.ok ? r.json() : [])
    .then(rows => {
      const out = {};
      (Array.isArray(rows) ? rows : []).forEach(r => { out[r.metric] = true; });
      return out;
    })
    .catch(() => ({}));
}

/* One row per PERSON = one row per account. Falls back to the name
   triple only for any legacy row with no user_id. */
function lbPersonKey(row){
  if (row.user_id) return "u:" + row.user_id;
  return (row.name || "").toLowerCase() + "|" + (row.last_initial || "").toLowerCase() + "|" + (row.grade || "");
}
/* GET one board's rows, resolved to ONE row per person:
   agg "sum" adds all of a person's rows up; anything else keeps the
   single best (rows come back sorted best-first, so first-seen wins).
   Returns { name, last_initial, grade, value }, sorted for display. */
function lbFetchBoard(gameId, board, key){
  const bcfg = lbBoardConfig(gameId, key);
  if (!leaderboardEnabled() || !bcfg) return Promise.resolve([]);
  const wk = board === "alltime" ? "all" : isoWeekKey();
  const isSum = bcfg.agg === "sum";
  const qs = [
    "select=user_id,name,last_initial,grade,value",
    "game_id=eq." + encodeURIComponent(gameId),
    "board=eq." + (board === "alltime" ? "alltime" : "weekly"),
    "week_key=eq." + encodeURIComponent(wk),
    "metric=eq." + encodeURIComponent(bcfg.metric),
    "order=value." + (bcfg.dir || "desc"),
    "limit=" + (isSum ? 5000 : 300)
  ].join("&");
  return fetch(SB_BASE + "/rest/v1/scores?" + qs, { headers: lbHeaders() })
    .then(r => r.ok ? r.json() : [])
    .then(rows => {
      rows = Array.isArray(rows) ? rows : [];
      if (!isSum) return lbDedupePeople(rows);
      const acc = {};
      rows.forEach(row => {
        const k = lbPersonKey(row);
        if (!acc[k]) acc[k] = { user_id: row.user_id, name: row.name, last_initial: row.last_initial, grade: row.grade, value: 0 };
        acc[k].value += Number(row.value) || 0;
      });
      const arr = Object.keys(acc).map(k => acc[k]);
      arr.sort((a, b) => (bcfg.dir === "asc" ? a.value - b.value : b.value - a.value));
      return arr;
    })
    .catch(() => []);
}
function lbDedupePeople(rows){
  const seen = {};
  const out = [];
  rows.forEach(row => {
    const key = lbPersonKey(row);
    if (seen[key]) return;
    seen[key] = true;
    out.push(row);
  });
  return out;
}

/* ---------- rendering ---------- */
function lbFormatValue(num, bcfg){
  if (bcfg.metric === "time") return formatTime(num);
  return num.toLocaleString() + (bcfg.unit ? " " + bcfg.unit : "");
}
function lbBoardRowsHtml(rows, bcfg, meName){
  if (!rows.length) return `<p class="lb-empty">No entries yet — be the first.</p>`;
  return `
    <ol class="lb-list">
      ${rows.slice(0, 10).map((row, i) => {
        const who = escapeHtml(row.name || "—") + (row.last_initial ? " " + escapeHtml(row.last_initial) + "." : "");
        const grade = row.grade ? `<span class="lb-grade">&rsquo;${escapeHtml(row.grade)}</span>` : "";
        const num = Number(row.value);
        const mine = meName && (row.name || "").toLowerCase() === meName.toLowerCase() ? " is-me" : "";
        return `
          <li class="lb-row${mine}">
            <span class="lb-rank">${i + 1}</span>
            <span class="lb-name">${who} ${grade}</span>
            <span class="lb-value">${lbFormatValue(num, bcfg)}</span>
          </li>`;
      }).join("")}
    </ol>`;
}
/* One board into `mountEl`. `key` is a board's `key` field. */
function lbRenderBoard(mountEl, gameId, board, key){
  if (!mountEl) return;
  const bcfg = lbBoardConfig(gameId, key);
  if (!leaderboardEnabled() || !bcfg) { mountEl.innerHTML = ""; return; }
  mountEl.innerHTML = `<p class="lb-empty">Loading…</p>`;
  const me = loadIdentity();
  lbFetchBoard(gameId, board, bcfg.key).then(rows => {
    mountEl.innerHTML = lbBoardRowsHtml(rows, bcfg, me.name || "");
  });
}
/* All of a game's boards, stacked, for a game page's "This Week" panel. */
function lbRenderTop10Panel(mountEl, gameId){
  if (!mountEl) return;
  const g = lbGameConfig(gameId);
  if (!leaderboardEnabled() || !g) { mountEl.innerHTML = ""; return; }
  mountEl.innerHTML = `
    <div class="sidecard">
      <div class="sidecard__eyebrow">This Week’s Top 10</div>
      ${g.boards.map((b, i) => `
        <div class="lb-subboard">
          ${g.boards.length > 1 ? `<div class="lb-subboard__label">${escapeHtml(b.label)}</div>` : ""}
          <div data-board-slot="${i}"></div>
        </div>`).join("")}
      <a class="sidecard__link" href="leaderboard.html">Full leaderboard &amp; all-time &rarr;</a>
    </div>`;
  g.boards.forEach((b, i) => {
    lbRenderBoard(mountEl.querySelector(`[data-board-slot="${i}"]`), gameId, "weekly", b.key);
  });
}

/* ---------- account gate (leaderboard page + submit prompts) ----------
   Posting to the leaderboard now needs a signed-in account. This just
   reports the state; the actual sign-up / log-in lives on profile.html. */
function lbAccountLine(){
  const user = (typeof currentUser === "function") ? currentUser() : null;
  const id = (typeof authIdentity === "function") ? authIdentity() : null;
  if (user && id && id.name) {
    return `Posting as <strong>${escapeHtml(formatIdentity(id))}</strong>${id.grade ? " &middot; &rsquo;" + escapeHtml(id.grade) : ""}.`;
  }
  if (user) {
    return `You&rsquo;re signed in. <a href="profile.html">Finish your profile</a> to post to the leaderboard.`;
  }
  return `<a href="profile.html">Log in or make an account</a> to post your scores. Anyone can view the boards.`;
}
function lbRenderAccountGate(mountEl){
  if (!mountEl) return;
  mountEl.innerHTML = `<p class="lb-identity__lead">${lbAccountLine()}</p>`;
}

/* ---------- leaderboard.html section ---------- */
function lbInitStatsPage(){
  const mount = document.getElementById("leaderboardSection");
  if (!mount) return;
  if (!leaderboardEnabled()) {
    mount.innerHTML = `<div class="lb-panel"><p class="lb-empty">The weekly leaderboard isn’t set up yet — check back soon.</p></div>`;
    return;
  }

  mount.innerHTML = `
    <div class="lb-panel">
      <div id="lbIdentityGate"></div>
      <div class="lb-controls">
        <label>Game
          <select id="lbGameSelect">
            ${LEADERBOARD_GAMES.map(g => `<option value="${g.id}">${escapeHtml(g.label)}</option>`).join("")}
          </select>
        </label>
        <label>Board
          <select id="lbMetricSelect"></select>
        </label>
        <label>When
          <select id="lbWhenSelect">
            <option value="weekly">This week</option>
            <option value="alltime">All time</option>
          </select>
        </label>
      </div>
      <div id="lbBoardMount"></div>
    </div>`;

  const gameSel = document.getElementById("lbGameSelect");
  const metricSel = document.getElementById("lbMetricSelect");
  const whenSel = document.getElementById("lbWhenSelect");
  const boardMount = document.getElementById("lbBoardMount");
  const gate = document.getElementById("lbIdentityGate");

  function fillMetrics(){
    const g = lbGameConfig(gameSel.value);
    metricSel.innerHTML = (g ? g.boards : []).map(b => `<option value="${b.key}">${escapeHtml(b.label)}</option>`).join("");
  }
  function redraw(){ lbRenderBoard(boardMount, gameSel.value, whenSel.value, metricSel.value); }

  lbRenderAccountGate(gate);
  document.addEventListener("roundup:authchange", () => { lbRenderAccountGate(gate); redraw(); });
  gameSel.addEventListener("change", () => { fillMetrics(); redraw(); });
  metricSel.addEventListener("change", redraw);
  whenSel.addEventListener("change", redraw);
  fillMetrics();
  redraw();
}

/* ---------- submitting ----------
   Rows only carry game_id + user_id + the metric/value/bucket. The
   `scores` insert trigger fills name / last_initial / grade from the
   signed-in user's profile, so a client can't post under another
   name. */
function lbRowBase(gameId){
  const user = (typeof currentUser === "function") ? currentUser() : null;
  return user ? { game_id: gameId, user_id: user.id } : null;
}
function lbRowsForMetric(gameId, metric, value){
  const base = lbRowBase(gameId);
  if (!base) return [];
  return [
    Object.assign({}, base, { metric: metric, value: value, board: "weekly", week_key: isoWeekKey() }),
    Object.assign({}, base, { metric: metric, value: value, board: "alltime", week_key: "all" })
  ];
}

/* Bronco games: value comes from a roundup:roundcomplete result. */
function lbValueFromResult(gameId, result){
  const g = lbGameConfig(gameId);
  result = result || {};
  if (!g || g.kind !== "bronco") return null;
  const b = g.boards[0];
  if (b.metric === "score" && typeof result.score === "number") return { metric: "score", value: Math.round(result.score) };
  if (b.metric === "time" && result.won && typeof result.timeSeconds === "number") return { metric: "time", value: Math.round(result.timeSeconds * 100) / 100 };
  return null;
}
function lbSubmitRun(gameId, result){
  const val = lbValueFromResult(gameId, result);
  const user = (typeof currentUser === "function") ? currentUser() : null;
  if (!leaderboardEnabled() || !val || !user) return Promise.resolve(false);
  // Bronco Blitz posts EVERY round — that's what feeds the "Total"
  // board (and the High score board just takes the max anyway).
  // Dash / Splash keep one row per week (a fastest-time board only
  // wants your best).
  if (gameId === "broncoBlitz") {
    return lbInsert(lbRowsForMetric(gameId, val.metric, val.value));
  }
  return lbMetricsPostedThisWeek(gameId).then(have => {
    if (have[val.metric]) return true; // already posted this week from this account
    return lbInsert(lbRowsForMetric(gameId, val.metric, val.value));
  });
}

/* Puzzle games: value(s) come from a frozen first-completion record. */
function lbCurrentWinId(gameId){
  if (gameId === "weeklyCrossword" || gameId === "weeklyWordSearch") {
    return (typeof THIS_WEEK !== "undefined" && THIS_WEEK) ? THIS_WEEK.isoDate : null;
  }
  if (gameId === "printCrossword") {
    return (typeof THIS_PRINT !== "undefined" && THIS_PRINT) ? THIS_PRINT.isoDate : null;
  }
  if (gameId === "specialEdition") {
    return (typeof SPECIAL_EDITION !== "undefined" && SPECIAL_EDITION) ? SPECIAL_EDITION.startIsoDate : null;
  }
  return null;
}
function lbPostedFlagKey(gameId, winId){ return "roundup:lbposted:" + gameId + ":" + winId; }

/* Post the frozen solve for the CURRENT puzzle, if it hasn't been
   posted from this browser yet. Cheat-proof: the time is whatever
   was frozen at the genuine first completion — restarting the
   puzzle never changes it, and this never re-freezes. */
function lbPostPuzzleSolve(gameId){
  const g = lbGameConfig(gameId);
  const winId = lbCurrentWinId(gameId);
  const host = document.getElementById("leaderboardSubmitMount");
  if (!leaderboardEnabled() || !g || g.kind !== "puzzle" || !winId) return Promise.resolve(false);

  const rec = (typeof puzzleSolveRecord === "function") ? puzzleSolveRecord(gameId, winId) : null;
  if (!rec) return Promise.resolve(false); // not solved yet

  let posted = false;
  try { posted = localStorage.getItem(lbPostedFlagKey(gameId, winId)) === "1"; } catch (e) {}
  if (posted) return Promise.resolve(true);

  const user = (typeof currentUser === "function") ? currentUser() : null;
  if (!user) {
    if (host) host.innerHTML = `<p class="lb-submit">Your solve${rec.t ? ` (${escapeHtml(formatTime(rec.t))})` : ""} is saved on this device. <a href="profile.html">Log in or make an account</a> to put it on the leaderboard.</p>`;
    return Promise.resolve(false);
  }
  // A reveal-assisted solve was frozen with no time (see the guard in
  // config.js). It still counts as a win + streak; it just can't go on
  // the fastest-solve board.
  if (rec.assisted && rec.t == null) {
    const g2 = lbGameConfig(gameId);
    const hasStreak = g2 && g2.boards.some(b => b.metric === "streak");
    if (host && !hasStreak) {
      host.innerHTML = `<p class="lb-submit">Solve recorded for your stats. Reveal-assisted solves don&rsquo;t go on the fastest-solve leaderboard.</p>`;
    }
  }

  return lbMetricsPostedThisWeek(gameId).then(have => {
    const rows = [];
    if (rec.t != null && !have.time) rows.push.apply(rows, lbRowsForMetric(gameId, "time", rec.t));
    const hasStreakBoard = g.boards.some(b => b.metric === "streak");
    if (hasStreakBoard && !have.streak && typeof computeStreak === "function") {
      const st = computeStreak(gameId);
      if (typeof st === "number" && st > 0) rows.push.apply(rows, lbRowsForMetric(gameId, "streak", st));
    }
    if (!rows.length) {
      try { localStorage.setItem(lbPostedFlagKey(gameId, winId), "1"); } catch (e) {}
      return true;
    }
    return lbInsert(rows).then(ok => {
      if (ok) {
        try { localStorage.setItem(lbPostedFlagKey(gameId, winId), "1"); } catch (e) {}
        if (host) host.innerHTML = `<p class="lb-submit lb-submit__done">Posted to this week’s leaderboard${rec.t ? ` — solve time ${escapeHtml(formatTime(rec.t))}` : ""}. Nice.</p>`;
        const panel = document.getElementById("weeklyTop10Mount");
        if (panel) lbRenderTop10Panel(panel, gameId);
      }
      return ok;
    });
  });
}

/* ---------- wiring a game page ---------- */
function lbAttachGamePage(gameId){
  const g = lbGameConfig(gameId);
  if (!g || g.kind !== "bronco") return;

  const panel = document.getElementById("weeklyTop10Mount");
  if (panel) {
    if (leaderboardEnabled()) lbRenderTop10Panel(panel, gameId);
    else panel.innerHTML = "";
  }

  document.addEventListener("roundup:roundcomplete", (e) => {
    if (!e.detail || e.detail.category !== gameId || !leaderboardEnabled()) return;
    const val = lbValueFromResult(gameId, e.detail.result);
    if (!val) return;
    const host = document.getElementById("leaderboardSubmitMount");
    if (!host) return;
    const user = (typeof currentUser === "function") ? currentUser() : null;
    const id = (typeof authIdentity === "function") ? authIdentity() : null;
    const shown = val.metric === "time" ? formatTime(val.value) : Number(val.value).toLocaleString();

    if (!user || !id || !id.name) {
      host.innerHTML = `<p class="lb-submit"><a href="profile.html">Log in or make an account</a> to post this (${escapeHtml(shown)}) to the leaderboard.</p>`;
      return;
    }
    host.innerHTML = `
      <div class="lb-submit">
        <span>Post <strong>${escapeHtml(shown)}</strong> to this week’s leaderboard as ${escapeHtml(formatIdentity(id))}?</span>
        <button class="btn" type="button" data-act="post">Post it</button>
        <span class="lb-submit__done" hidden>Posted ✓</span>
      </div>`;
    host.querySelector('[data-act="post"]').addEventListener("click", (ev) => {
      ev.target.disabled = true;
      lbSubmitRun(gameId, e.detail.result).then(ok => {
        const done = host.querySelector(".lb-submit__done");
        if (ok && done) { done.hidden = false; ev.target.hidden = true; }
        else ev.target.disabled = false;
        const panel2 = document.getElementById("weeklyTop10Mount");
        if (ok && panel2) lbRenderTop10Panel(panel2, gameId);
      });
    });
  });
}

/* ---------- wiring a puzzle page (crossword / word search / special) ---------- */
function lbAttachPuzzlePage(gameId){
  const g = lbGameConfig(gameId);
  if (!g || g.kind !== "puzzle") return;

  const panel = document.getElementById("weeklyTop10Mount");
  if (panel) {
    if (leaderboardEnabled()) lbRenderTop10Panel(panel, gameId);
    else panel.innerHTML = "";
  }

  // solved earlier this week, just now came back? (may run before auth
  // has loaded — the authchange handler below re-checks once it has)
  lbPostPuzzleSolve(gameId);
  document.addEventListener("roundup:authchange", () => { lbPostPuzzleSolve(gameId); });

  // first completion of the current puzzle, live
  document.addEventListener("roundup:puzzlesolved", (e) => {
    if (!e.detail || e.detail.category !== gameId) return;
    if (!e.detail.firstTime) return;
    if (e.detail.winId !== lbCurrentWinId(gameId)) return; // ignore archive solves
    lbPostPuzzleSolve(gameId);
  });
}
