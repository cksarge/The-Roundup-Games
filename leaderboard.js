/* ================================================================
   THE ROUNDUP GAMES — LEADERBOARD (Supabase)
   ----------------------------------------------------------------
   Talks to Supabase's auto-generated REST API (PostgREST) with plain
   fetch — no SDK, no build step. Loaded AFTER config.js, so it can
   use leaderboardEnabled(), isoWeekKey(), loadIdentity()/saveIdentity(),
   formatIdentity(), computeStreak(), puzzleSolveRecord(), escapeHtml(),
   formatTime().

   The table + Row Level Security + the name-check trigger are set up
   in Supabase — see the "Leaderboard (Supabase)" section of README.md
   for that SQL. Blank SUPABASE_URL / SUPABASE_ANON_KEY in config.js
   to switch every bit of this back off.

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

/* ---------- name moderation (client side) ----------
   Instant feedback in the form + a stop before anything is sent. The
   AUTHORITATIVE check is the name-check TRIGGER on the Supabase table
   (README "Leaderboard (Supabase)") — keep this list and the
   `blocked_words` table (blocked-words.csv / blocked-words.sql) in sync.

   Two passes, both over a de-leeted (b4d -> bad) version:
     • LB_SLUR_ROOTS  — substring match. Slurs / hardcore profanity
       where "xXfaggotXx"-style evasion is the real risk and a
       collision with a real student name is ~nil.
     • LB_BLOCKED     — the full LDNOOBW English list, matched only as
       a WHOLE token or the whole name, so it can't nuke "Cassandra"
       for containing "ass".
   LDNOOBW: github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words */
const LB_SLUR_ROOTS = [
  "nigg","fagg","kike","spic","chink","cunt","fuck","shit","retard",
  "tranny","wetback","coon","dyke","jigab","beaner","goatse"
];
const LB_BLOCKED = [
  "2g1c","2 girls 1 cup","acrotomophilia","alabama hot pocket","alaskan pipeline","anal",
  "anilingus","anus","apeshit","arsehole","ass","asshole","assmunch","auto erotic","autoerotic",
  "babeland","baby batter","baby juice","ball gag","ball gravy","ball kicking","ball licking",
  "ball sack","ball sucking","bangbros","bangbus","bareback","barely legal","barenaked",
  "bastard","bastardo","bastinado","bbw","bdsm","beaner","beaners","beaver cleaver",
  "beaver lips","beastiality","bestiality","big black","big breasts","big knockers","big tits",
  "bimbos","birdlock","bitch","bitches","black cock","blonde action","blonde on blonde action",
  "blowjob","blow job","blow your load","blue waffle","blumpkin","bollocks","bondage","boner",
  "boob","boobs","booty call","brown showers","brunette action","bukkake","bulldyke",
  "bullet vibe","bullshit","bung hole","bunghole","busty","butt","buttcheeks","butthole",
  "camel toe","camgirl","camslut","camwhore","carpet muncher","carpetmuncher",
  "chocolate rosebuds","cialis","circlejerk","cleveland steamer","clit","clitoris",
  "clover clamps","clusterfuck","cock","cocks","coprolagnia","coprophilia","cornhole","coon",
  "coons","creampie","cum","cumming","cumshot","cumshots","cunnilingus","cunt","darkie",
  "date rape","daterape","deep throat","deepthroat","dendrophilia","dick","dildo","dingleberry",
  "dingleberries","dirty pillows","dirty sanchez","doggie style","doggiestyle","doggy style",
  "doggystyle","dog style","dolcett","domination","dominatrix","dommes","donkey punch",
  "double dong","double penetration","dp action","dry hump","dvda","eat my ass","ecchi",
  "ejaculation","erotic","erotism","escort","eunuch","fag","faggot","fecal","felch","fellatio",
  "feltch","female squirting","femdom","figging","fingerbang","fingering","fisting",
  "foot fetish","footjob","frotting","fuck","fuck buttons","fuckin","fucking","fucktards",
  "fudge packer","fudgepacker","futanari","gangbang","gang bang","gay sex","genitals",
  "giant cock","girl on","girl on top","girls gone wild","goatcx","goatse","god damn","gokkun",
  "golden shower","goodpoop","goo girl","goregasm","grope","group sex","g-spot","guro",
  "hand job","handjob","hard core","hardcore","hentai","homoerotic","honkey","hooker","horny",
  "hot carl","hot chick","how to kill","how to murder","huge fat","humping","incest",
  "intercourse","jack off","jail bait","jailbait","jelly donut","jerk off","jigaboo","jiggaboo",
  "jiggerboo","jizz","juggs","kike","kinbaku","kinkster","kinky","knobbing","leather restraint",
  "leather straight jacket","lemon party","livesex","lolita","lovemaking","make me come",
  "male squirting","masturbate","masturbating","masturbation","menage a trois","milf",
  "missionary position","mong","motherfucker","mound of venus","mr hands","muff diver",
  "muffdiving","nambla","nawashi","negro","neonazi","nigga","nigger","nig nog","nimphomania",
  "nipple","nipples","nsfw","nsfw images","nude","nudity","nutten","nympho","nymphomania",
  "octopussy","omorashi","one cup two girls","one guy one jar","orgasm","orgy","paedophile",
  "paki","panties","panty","pedobear","pedophile","pegging","penis","phone sex","piece of shit",
  "pikey","pissing","piss pig","pisspig","playboy","pleasure chest","pole smoker","ponyplay",
  "poof","poon","poontang","punany","poop chute","poopchute","porn","porno","pornography",
  "prince albert piercing","pthc","pubes","pussy","queaf","queef","quim","raghead",
  "raging boner","rape","raping","rapist","rectum","reverse cowgirl","rimjob","rimming",
  "rosy palm","rosy palm and her 5 sisters","rusty trombone","sadism","santorum","scat",
  "schlong","scissoring","semen","sex","sexcam","sexo","sexy","sexual","sexually","sexuality",
  "shaved beaver","shaved pussy","shemale","shibari","shit","shitblimp","shitty","shota",
  "shrimping","skeet","slanteye","slut","s&m","smut","snatch","snowballing","sodomize","sodomy",
  "spastic","spic","splooge","splooge moose","spooge","spread legs","spunk","strap on",
  "strapon","strappado","strip club","style doggy","suck","sucks","suicide girls",
  "sultry women","swastika","swinger","tainted love","taste my","tea bagging","threesome",
  "throating","thumbzilla","tied up","tight white","tit","tits","titties","titty","tongue in a",
  "topless","tosser","towelhead","tranny","tribadism","tub girl","tubgirl","tushy","twat",
  "twink","twinkie","two girls one cup","undressing","upskirt","urethra play","urophilia",
  "vagina","venus mound","viagra","vibrator","violet wand","vorarephilia","voyeur","voyeurweb",
  "voyuer","vulva","wank","wetback","wet dream","white power","whore","worldsex","wrapping men",
  "wrinkled starfish","xx","xxx","yaoi","yellow showers","yiffy","zoophilia"
];
let _lbBlockedSet = null;
function lbBlockedSet(){
  if (!_lbBlockedSet) {
    _lbBlockedSet = {};
    LB_BLOCKED.forEach(w => { const n = lbNormalizeForModeration(w); if (n) _lbBlockedSet[n] = true; });
  }
  return _lbBlockedSet;
}
/* de-leet, keep single spaces, letters+space only */
function lbNormalizeForModeration(str){
  return String(str || "")
    .toLowerCase()
    .replace(/[4@]/g, "a").replace(/3/g, "e").replace(/[1!|]/g, "i")
    .replace(/0/g, "o").replace(/[5$]/g, "s").replace(/7/g, "t")
    .replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
}
function lbNameLooksBad(name, lastInitial){
  const norm = lbNormalizeForModeration((name || "") + " " + (lastInitial || ""));
  if (!norm) return false;
  const compact = norm.replace(/ /g, "");
  for (let i = 0; i < LB_SLUR_ROOTS.length; i++) {
    if (compact.indexOf(LB_SLUR_ROOTS[i]) !== -1) return true;
  }
  const set = lbBlockedSet();
  if (set[norm] || set[compact]) return true;
  const toks = norm.split(" ");
  for (let i = 0; i < toks.length; i++) {
    if (toks[i] && set[toks[i]]) return true;
  }
  return false;
}

/* ---------- a stable per-browser id (dedupe backstop) ---------- */
function lbClientId(){
  let id = "";
  try { id = localStorage.getItem("roundup:clientId") || ""; } catch (e) {}
  if (!id) {
    id = "c-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem("roundup:clientId", id); } catch (e) {}
  }
  return id;
}

/* ---------- REST helpers ---------- */
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
  if (!leaderboardEnabled() || !rows || !rows.length) return Promise.resolve(false);
  return fetch(SB_BASE + "/rest/v1/scores", {
    method: "POST",
    headers: lbHeaders({ "Prefer": "return=minimal" }),
    body: JSON.stringify(rows)
  }).then(r => r.ok).catch(() => false);
}

/* Which metrics this browser has ALREADY posted for a game this week
   — a server-side backstop against re-posting (the localStorage
   "solved"/"posted" flags are the first line; this catches a
   cleared-storage replay from the same browser). Resolves to an
   object like { time: true }. */
function lbClientMetricsThisWeek(gameId){
  if (!leaderboardEnabled()) return Promise.resolve({});
  const qs = [
    "select=metric",
    "game_id=eq." + encodeURIComponent(gameId),
    "board=eq.weekly",
    "week_key=eq." + encodeURIComponent(isoWeekKey()),
    "client_id=eq." + encodeURIComponent(lbClientId()),
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

function lbPersonKey(row){
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
    "select=name,last_initial,grade,value",
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
        if (!acc[k]) acc[k] = { name: row.name, last_initial: row.last_initial, grade: row.grade, value: 0 };
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
      <a class="sidecard__link" href="stats.html">Full leaderboard &amp; all-time &rarr;</a>
    </div>`;
  g.boards.forEach((b, i) => {
    lbRenderBoard(mountEl.querySelector(`[data-board-slot="${i}"]`), gameId, "weekly", b.key);
  });
}

/* ---------- identity form (stats page) ---------- */
function lbRenderIdentityGate(mountEl, onSaved){
  if (!mountEl) return;
  const id = loadIdentity();
  mountEl.innerHTML = `
    <form class="lb-identity" autocomplete="off">
      <p class="lb-identity__lead">${id.name
        ? `Posting as <strong>${escapeHtml(formatIdentity(id))}</strong>${id.grade ? " · &rsquo;" + escapeHtml(id.grade) : ""}.`
        : "Pick a name to post to the leaderboard — first name and last initial only."}</p>
      <div class="lb-identity__fields">
        <label>First name
          <input type="text" name="name" maxlength="20" value="${escapeHtml(id.name)}" required>
        </label>
        <label>Last initial
          <input type="text" name="lastInitial" maxlength="1" value="${escapeHtml(id.lastInitial)}">
        </label>
        <label>Grad year
          <select name="grade">
            <option value=""${id.grade ? "" : " selected"}>—</option>
            ${["27", "28", "29", "30", "31", "32", "33"].map(g => `<option value="${g}"${id.grade === g ? " selected" : ""}>&rsquo;${g}</option>`).join("")}
          </select>
        </label>
      </div>
      <button class="btn" type="submit">${id.name ? "Update name" : "Save name"}</button>
      <p class="sidecard__hint" data-role="nameerr" hidden></p>
    </form>`;

  mountEl.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const els = e.target.elements;
    const name = els.namedItem("name").value;
    const lastInitial = els.namedItem("lastInitial").value;
    const grade = els.namedItem("grade").value;
    const err = mountEl.querySelector('[data-role="nameerr"]');
    if (lbNameLooksBad(name, lastInitial)) {
      if (err) { err.textContent = "That name can’t be used on the leaderboard — please pick another."; err.hidden = false; }
      return;
    }
    saveIdentity({ name: name, lastInitial: lastInitial, grade: grade });
    lbRenderIdentityGate(mountEl, onSaved);
    if (typeof onSaved === "function") onSaved();
  });
}

/* ---------- stats.html leaderboard section ---------- */
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

  function fillMetrics(){
    const g = lbGameConfig(gameSel.value);
    metricSel.innerHTML = (g ? g.boards : []).map(b => `<option value="${b.key}">${escapeHtml(b.label)}</option>`).join("");
  }
  function redraw(){ lbRenderBoard(boardMount, gameSel.value, whenSel.value, metricSel.value); }

  lbRenderIdentityGate(document.getElementById("lbIdentityGate"), redraw);
  gameSel.addEventListener("change", () => { fillMetrics(); redraw(); });
  metricSel.addEventListener("change", redraw);
  whenSel.addEventListener("change", redraw);
  fillMetrics();
  redraw();
}

/* ---------- submitting ---------- */
function lbIdentityRowBase(gameId, id){
  return {
    game_id: gameId,
    name: (id.name || "").slice(0, 20),
    last_initial: (id.lastInitial || "").slice(0, 1),
    grade: (id.grade || "").slice(0, 2),
    client_id: lbClientId()
  };
}
function lbRowsForMetric(gameId, id, metric, value){
  const base = lbIdentityRowBase(gameId, id);
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
function lbSubmitRun(gameId, result, identity){
  const val = lbValueFromResult(gameId, result);
  const id = identity || loadIdentity();
  if (!leaderboardEnabled() || !val || !id.name) return Promise.resolve(false);
  if (lbNameLooksBad(id.name, id.lastInitial)) return Promise.resolve(false);
  // Bronco Blitz posts EVERY round — that's what feeds the "Total"
  // board (and the High score board just takes the max anyway).
  // Dash / Splash keep one row per week (a fastest-time board only
  // wants your best).
  if (gameId === "broncoBlitz") {
    return lbInsert(lbRowsForMetric(gameId, id, val.metric, val.value));
  }
  return lbClientMetricsThisWeek(gameId).then(have => {
    if (have[val.metric]) return true; // already posted this week from this browser
    return lbInsert(lbRowsForMetric(gameId, id, val.metric, val.value));
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

  const id = loadIdentity();
  if (!id.name) {
    if (host) host.innerHTML = `<p class="lb-submit">Your solve${rec.t ? ` (${escapeHtml(formatTime(rec.t))})` : ""} is saved. <a href="stats.html">Set a name</a> to put it on the leaderboard.</p>`;
    return Promise.resolve(false);
  }
  if (lbNameLooksBad(id.name, id.lastInitial)) {
    if (host) host.innerHTML = `<p class="lb-submit">Your name can’t be posted to the leaderboard — change it on <a href="stats.html">Leaderboard &amp; Stats</a>.</p>`;
    return Promise.resolve(false);
  }

  return lbClientMetricsThisWeek(gameId).then(have => {
    const rows = [];
    if (rec.t != null && !have.time) rows.push.apply(rows, lbRowsForMetric(gameId, id, "time", rec.t));
    const hasStreakBoard = g.boards.some(b => b.metric === "streak");
    if (hasStreakBoard && !have.streak && typeof computeStreak === "function") {
      const st = computeStreak(gameId);
      if (typeof st === "number" && st > 0) rows.push.apply(rows, lbRowsForMetric(gameId, id, "streak", st));
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
    const id = loadIdentity();
    const shown = val.metric === "time" ? formatTime(val.value) : Number(val.value).toLocaleString();

    if (!id.name) {
      host.innerHTML = `<p class="lb-submit">Set a name on <a href="stats.html">Leaderboard &amp; Stats</a> to post this (${escapeHtml(shown)}).</p>`;
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

  // solved earlier this week, just now got a name / just came back?
  lbPostPuzzleSolve(gameId);

  // first completion of the current puzzle, live
  document.addEventListener("roundup:puzzlesolved", (e) => {
    if (!e.detail || e.detail.category !== gameId) return;
    if (!e.detail.firstTime) return;
    if (e.detail.winId !== lbCurrentWinId(gameId)) return; // ignore archive solves
    lbPostPuzzleSolve(gameId);
  });
}
