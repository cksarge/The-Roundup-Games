/* ================================================================
   THE ROUNDUP GAMES — ACCOUNTS (Supabase Auth)
   ----------------------------------------------------------------
   Loaded AFTER config.js and the supabase-js UMD bundle, BEFORE
   leaderboard.js. Builds one Supabase client (window.sbClient) and
   exposes a tiny auth surface the rest of the site uses:

     authReady           — promise, resolves once the first session
                            check + profile load has settled
     currentUser()       — the Supabase auth user, or null
     currentProfile()    — { first_name, last_initial, grad_year }, or null
     authIdentity()      — that profile as { name, lastInitial, grade }
                            (the shape config.js / leaderboard.js expect)
     signUpAccount(...)  — create an account (+ Turnstile token)
     signIn(...)         — email + password (+ Turnstile token)
     signOutAccount()    — sign out (keeps local stats untouched)
     updateProfile(...)  — edit first name / last initial / grad year

   What it does automatically on sign-in:
     • loads the player's profile and mirrors it to localStorage
       (roundup:profile) for an instant next-visit paint
     • copies it into roundup:identity (via saveIdentity) so the
       leaderboard display + challenge links match the account
     • merges the account's saved stats with whatever is in this
       browser and writes the result both places (syncStatsOnLogin)
     • from then on, pushes stat changes up to the account, debounced
     • fires a roundup:authchange DOM event so pages can re-render

   Everything is a no-op if the Supabase keys are blank or the
   supabase-js bundle didn't load — accounts and the leaderboard are
   simply off, and playing is unaffected.
   ================================================================ */

(function () {
  "use strict";

  const OFF = !(typeof leaderboardEnabled === "function" && leaderboardEnabled())
    || !(window.supabase && typeof window.supabase.createClient === "function");

  const PROFILE_KEY = "roundup:profile";

  let _user = null;
  let _profile = null;
  let _resolveReady;
  const authReady = new Promise((res) => { _resolveReady = res; });

  window.sbClient = null;
  window.authReady = authReady;
  window.currentUser = () => _user;
  window.currentProfile = () => _profile;
  window.authIdentity = function () {
    if (!_profile) return null;
    return {
      name: _profile.first_name || "",
      lastInitial: _profile.last_initial || "",
      grade: _profile.grad_year || ""
    };
  };

  if (OFF) {
    // Still resolve so callers that `await authReady` don't hang.
    _resolveReady();
    window.signUpAccount = window.signIn = window.signOutAccount =
      window.updateProfile = () => Promise.resolve({ error: { message: "Accounts are not set up." } });
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "roundup:auth" }
  });
  window.sbClient = sb;

  /* ---------- localStorage mirror of the profile ---------- */
  function readProfileMirror() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeProfileMirror(p) {
    try {
      if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      else localStorage.removeItem(PROFILE_KEY);
    } catch (e) { /* private mode — fine */ }
  }
  // Paint from the mirror immediately; the network load below corrects it.
  _profile = readProfileMirror();

  /* ---------- profile load ---------- */
  async function loadProfile(uid) {
    // The signup trigger creates the row in the same transaction as the
    // auth user, so it's normally there instantly — but retry once just
    // in case of replica lag right after signup.
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await sb
        .from("profiles")
        .select("first_name,last_initial,grad_year")
        .eq("id", uid)
        .maybeSingle();
      if (data) return data;
      if (error && error.code !== "PGRST116") break; // real error, not "no rows"
      await new Promise((r) => setTimeout(r, 600));
    }
    return null;
  }

  /* ---------- stats sync ---------- */
  function uniqUnion(a, b) {
    const out = [];
    const seen = {};
    [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []).forEach((v) => {
      const k = String(v);
      if (!seen[k]) { seen[k] = true; out.push(v); }
    });
    return out;
  }
  function minNonNull(a, b) {
    const xs = [a, b].filter((v) => typeof v === "number" && isFinite(v));
    return xs.length ? Math.min.apply(null, xs) : null;
  }
  function maxNonNull(a, b) {
    const xs = [a, b].filter((v) => typeof v === "number" && isFinite(v));
    return xs.length ? Math.max.apply(null, xs) : null;
  }
  /* Merge two loadStats()-shaped blobs field by field. Win-id lists
     union; fastest time takes the min; high score + lifetime points
     take the max (so pre-signup points seed the account, and a second
     device never loses ground). */
  function mergeStats(local, remote) {
    local = local || {};
    remote = remote || {};
    const merged = { streakWins: {}, bestTimes: {}, points: {}, bestScores: {} };
    const games = (typeof STAT_GAMES !== "undefined" && Array.isArray(STAT_GAMES)) ? STAT_GAMES : [];
    games.forEach((g) => {
      merged[g.id] = uniqUnion(local[g.id], remote[g.id]);
      if (g.streak) {
        merged.streakWins[g.id] = uniqUnion(
          (local.streakWins || {})[g.id],
          (remote.streakWins || {})[g.id]
        );
      }
      if (g.trackBestTime) {
        merged.bestTimes[g.id] = minNonNull(
          (local.bestTimes || {})[g.id],
          (remote.bestTimes || {})[g.id]
        );
      }
      if (g.trackPoints) {
        merged.points[g.id] = maxNonNull(
          (local.points || {})[g.id],
          (remote.points || {})[g.id]
        ) || 0;
      }
      if (g.trackBestScore) {
        merged.bestScores[g.id] = maxNonNull(
          (local.bestScores || {})[g.id],
          (remote.bestScores || {})[g.id]
        );
      }
    });
    return merged;
  }

  async function fetchRemoteStats(uid) {
    const { data } = await sb.from("user_stats").select("data").eq("user_id", uid).maybeSingle();
    return (data && data.data && typeof data.data === "object") ? data.data : {};
  }
  async function pushStats(uid) {
    if (!uid) return;
    const blob = (typeof loadStats === "function") ? loadStats() : null;
    if (!blob) return;
    await sb.from("user_stats").upsert(
      { user_id: uid, data: blob, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  }

  let _syncing = false;
  async function syncStatsOnLogin(uid) {
    if (!uid || typeof loadStats !== "function") return;
    _syncing = true;
    try {
      const local = loadStats();
      const remote = await fetchRemoteStats(uid);
      const merged = mergeStats(local, remote);
      if (typeof saveGameState === "function" && typeof STATS_STORAGE_KEY !== "undefined") {
        saveGameState(STATS_STORAGE_KEY, merged);
      }
      await pushStats(uid);
      // nudge every stats surface to repaint with the merged numbers
      if (typeof emitStatsChange === "function") {
        (typeof STAT_GAMES !== "undefined" ? STAT_GAMES : []).forEach((g) => {
          emitStatsChange(g.id, ["wins", "streak", "bestTime", "bestScore", "points"]);
        });
      }
    } finally {
      _syncing = false;
    }
  }

  /* debounced write-through of later stat changes */
  let _pushTimer = null;
  document.addEventListener("roundup:statschange", () => {
    if (!_user || _syncing) return;
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(() => { pushStats(_user.id); }, 2000);
  });

  /* ---------- nav label ---------- */
  function whenDOMReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }
  function paintNav() {
    whenDOMReady(() => {
      document.querySelectorAll('.dateline__nav a[href="profile.html"]').forEach((a) => {
        if (_profile && _profile.first_name) {
          if (!a.dataset.label) a.dataset.label = a.textContent;
          a.textContent = _profile.first_name;
        } else if (a.dataset.label) {
          a.textContent = a.dataset.label;
        }
      });
    });
  }

  /* ---------- broadcast ---------- */
  function emitAuthChange() {
    try {
      document.dispatchEvent(new CustomEvent("roundup:authchange", {
        detail: { user: _user, profile: _profile }
      }));
    } catch (e) { /* no-op */ }
  }

  /* ---------- react to session changes ---------- */
  let _ready = false;
  let _lastToken = " "; // sentinel: nothing applied yet
  async function applySession(session) {
    const token = session ? (session.access_token || "session") : "";
    // supabase-js fires INITIAL_SESSION on subscribe AND getSession()
    // resolves — same session twice. Apply each distinct one once.
    if (token === _lastToken) {
      if (!_ready) { _ready = true; _resolveReady(); }
      return;
    }
    _lastToken = token;

    const nextUser = session ? session.user : null;
    const changedUser = (nextUser && nextUser.id) !== (_user && _user.id);
    _user = nextUser;

    if (!_user) {
      _profile = null;
      writeProfileMirror(null);
      paintNav();
      emitAuthChange();
      if (!_ready) { _ready = true; _resolveReady(); }
      return;
    }

    _profile = await loadProfile(_user.id);
    writeProfileMirror(_profile);
    if (_profile && typeof saveIdentity === "function") {
      saveIdentity({
        name: _profile.first_name || "",
        lastInitial: _profile.last_initial || "",
        grade: _profile.grad_year || ""
      });
    }
    paintNav();
    emitAuthChange();

    if (changedUser) {
      try { await syncStatsOnLogin(_user.id); } catch (e) { /* offline — retry next change */ }
    }
    if (!_ready) { _ready = true; _resolveReady(); }
  }

  sb.auth.onAuthStateChange((_event, session) => { applySession(session); });
  sb.auth.getSession().then(({ data }) => { applySession(data ? data.session : null); });

  /* ---------- public actions ---------- */
  window.signUpAccount = async function (opts) {
    opts = opts || {};
    const options = {
      data: {
        first_name: (opts.firstName || "").trim().slice(0, 20),
        last_initial: (opts.lastInitial || "").trim().slice(0, 1).toUpperCase(),
        grad_year: String(opts.gradYear || "").replace(/[^0-9]/g, "").slice(-2)
      }
    };
    if (opts.captchaToken) options.captchaToken = opts.captchaToken;
    const { data, error } = await sb.auth.signUp({
      email: (opts.email || "").trim(),
      password: opts.password || "",
      options: options
    });
    return { data, error };
  };

  window.signIn = async function (opts) {
    opts = opts || {};
    const options = {};
    if (opts.captchaToken) options.captchaToken = opts.captchaToken;
    const { data, error } = await sb.auth.signInWithPassword({
      email: (opts.email || "").trim(),
      password: opts.password || "",
      options: options
    });
    return { data, error };
  };

  window.signOutAccount = async function () {
    const { error } = await sb.auth.signOut();
    return { error };
  };

  window.updateProfile = async function (fields) {
    if (!_user) return { error: { message: "Not signed in." } };
    const patch = {};
    if (typeof fields.firstName === "string") patch.first_name = fields.firstName.trim().slice(0, 20);
    if (typeof fields.lastInitial === "string") patch.last_initial = fields.lastInitial.trim().slice(0, 1).toUpperCase();
    if (typeof fields.gradYear === "string") patch.grad_year = fields.gradYear.replace(/[^0-9]/g, "").slice(-2);
    const { data, error } = await sb
      .from("profiles")
      .update(patch)
      .eq("id", _user.id)
      .select("first_name,last_initial,grad_year")
      .maybeSingle();
    if (!error && data) {
      _profile = data;
      writeProfileMirror(_profile);
      if (typeof saveIdentity === "function") {
        saveIdentity({ name: data.first_name || "", lastInitial: data.last_initial || "", grade: data.grad_year || "" });
      }
      paintNav();
      emitAuthChange();
    }
    return { data, error };
  };
})();
