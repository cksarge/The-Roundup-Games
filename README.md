# The Roundup Games

Games and puzzles from **The Roundup**, the student-led newspaper of Brophy College Preparatory. Built as a lightweight static site — no build step, no dependencies — so new puzzles can be published just by editing one file.

Live features:

- **Weekly Crossword** — a bigger, themed puzzle posted every Monday
- **Weekly Word Search** — a themed word search posted every Monday, a fully separate game from Weekly Crossword with its own difficulty
- **Special Edition** — a themed, one-off game slot for school breaks and special occasions (any embed type — crossword, spelling bee, etc.), live only for its own configured date range
- **Bronco Dash** — a persistent (always-available, never-changing) side-scrolling track game. Answer trivia to sprint ahead; ticks drain on their own over time, so speed matters
- **Bronco Splash** — a persistent swim-a-lap game. Answer trivia to refill your air and pick up speed before it runs out
- **Bronco Blitz** — a persistent 30-second trivia speed round. Answer A/B/C/D questions for 100 points each, times a streak multiplier that grows the longer your correct-answer streak runs, plus a speed bonus for fast answers; a wrong answer breaks the streak and locks you out for 3 seconds while the clock keeps running
- **Archive** — every past edition, auto-populated as new puzzles go live
- **Stats** — how many times you've won each game, tracked in your own browser
- More games planned — see the "Coming Soon" card on the Games page

**Retired (v1.5):** Daily Crossword and Guess the Teacher are no longer published. Their pages, homepage cards, and nav links are gone, but every past edition stays playable at the bottom of the Archive.

## How it works

Everything content-related lives in [`config.js`](config.js). There is no separate "archive" file to manage — every puzzle (past, present, or future) sits in one list, and the site figures out on its own what to show as "today" vs. what belongs in the archive, based on each entry's `isoDate` compared to the visitor's own device clock.

This means you can:

- **Schedule days (or weeks) in advance.** Add an entry with a future `isoDate` and it stays completely invisible — not shown as current, not in the archive — until that date actually arrives.
- **Fix a past puzzle** by editing its entry directly, no hunting through a separate archive file.
- **Add embed links** for crosswords (`crossword.embedUrl`) and they show up automatically wherever that entry is displayed — today's page, the homepage card, or the archive.

Weekly Crossword and Weekly Word Search share one list (`WEEKLY_PUZZLES`) and one weekly schedule. Each week's entry has a `crossword` sub-object and a `wordSearch` sub-object, and the two stay fully separate games otherwise: their own difficulty, own embed, own Archive/Stats entry each. Both also support an optional `theme` field (`crossword.theme` / `wordSearch.theme`, independent of each other): unlike Special Edition, whose theme is the whole point of its prominent homepage banner, this one is deliberately low-key — it's never shown on the homepage card, only as a small line on that game's own page (and its Archive detail).

Bronco Dash, Bronco Splash, and Bronco Blitz work differently — they're **persistent** games with no date logic at all (same game every time). All three draw from one shared question pool (`PERSISTENT_GAME_QUESTIONS` in `config.js`) in a random order every playthrough — add a question once and it's in the mix for every persistent game, current or future, no dates involved.

See the comments at the top of `config.js` for the full breakdown of `WEEKLY_PUZZLES`, `SPECIAL_PUZZLES`, `PERSISTENT_GAME_QUESTIONS`, and `GAMES`. (`DAILY_PUZZLES` is still there but frozen — it only feeds the retired games' Archive section now.)

## Project structure

```
index.html               Homepage — a hub linking to Games, Stats, and Archive (plus the Special Edition banner when one is live)
games.html                The full games list — cards for every game, pulled from GAMES in config.js (what the homepage used to be)
weekly-crossword.html     This week's Weekly Crossword
weekly-word-search.html  This week's Weekly Word Search
special-edition.html      The current Special Edition game (or a "nothing today" message)
bronco-dash.html          Bronco Dash (persistent track game)
bronco-splash.html        Bronco Splash (persistent swimming game)
bronco-blitz.html         Bronco Blitz (persistent trivia speed round)
archive.html              Past editions of every game
stats.html                Per-browser win counts for each game
404.html                  Shown for any URL that doesn't match a real page
config.js                 All puzzle content + shared rendering logic
embed.js                  Iframe auto-resize helper (only does anything when the site is framed)
styles.css                Shared styling for every page
logo.png / favicon.png / apple-touch-icon.png   Site branding
```

## Editing content

1. Open `config.js`.
2. Add a new entry to `WEEKLY_PUZZLES` (for a Weekly Crossword / Weekly Word Search week) or `SPECIAL_PUZZLES` (for a one-off Special Edition), following the example templates in the comments.
3. Save. That's it — no rebuild, no redeploy step beyond pushing the file.

The footer's version number (`SITE_VERSION` in `config.js`) is a manual label for tracking releases — it's bumped deliberately, not automatically.

## Embedding the whole site in another page

The site is designed to also run inside an `<iframe>` on another page (e.g. the Roundup's Student Newspaper Online / WordPress site). Every internal link is relative and opens in the same window, so all pages — home, games, each game, archive, stats — work normally inside the frame, and per-browser stats keep working (they're scoped to wherever this site is hosted, not the parent page).

A cross-origin iframe can't resize itself to fit its content, so `embed.js` (loaded on every page) posts the page's height to the parent window whenever it changes. The parent page listens for that message and sets the iframe height. When the site is loaded directly, `embed.js` sees there's no parent frame and does nothing.

### Adding it to a WordPress / SNO page

1. In WordPress, create a **Page** (not a post). A full-width page template looks best.
2. Add one **Custom HTML block** and paste the snippet below.
3. Replace `GAMES_URL` with the live site URL and `GAMES_ORIGIN` with just its scheme + domain (no path).
4. Publish, then add the page to the site menu.

```html
<iframe id="roundup-games"
  src="GAMES_URL/index.html"
  title="The Roundup Games"
  style="width:100%;border:0;display:block"
  scrolling="no"
  allow="fullscreen"></iframe>
<script>
(function () {
  var GAMES_ORIGIN = "GAMES_ORIGIN"; // e.g. https://cksarge.github.io
  var frame = document.getElementById("roundup-games");
  frame.style.height = "1200px"; // fallback until the first height message
  window.addEventListener("message", function (e) {
    if (e.origin !== GAMES_ORIGIN) return;
    var d = e.data || {};
    if (d.roundupGamesHeight) frame.style.height = d.roundupGamesHeight + "px";
    // Optional: scroll the frame into view when the user navigates between games
    if (d.roundupGamesNavigated !== undefined) {
      frame.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  });
})();
</script>
```

Notes:
- SNO's Custom HTML block allows the `<iframe>` and `<script>` above — same mechanism used for Google Forms / Spotify embeds.
- GitHub Pages doesn't send a restrictive `X-Frame-Options` / `frame-ancestors`, so framing works with no change to this repo.
- Drop the `roundupGamesNavigated` block if you don't want the page to scroll on in-frame navigation.

---

## Version history

Newest at the top. Add an entry here whenever a change is significant enough to be worth noting (new game, notable feature, structural change, etc.) — small content updates (just adding a day's puzzle) don't need an entry.

### Version 1.6.1 — September 2026
- Homepage hero eyebrow changed from "Brophy Roundup Games" to "Welcome to" (now reads "Welcome to" / "The Roundup Games").

### Version 1.6 — September 2026
- **Split the homepage into a hub + a dedicated Games page.** The old homepage (game cards for every game, split into "Today & This Week" and "Persistent Games" grids, with the Special Edition banner on top) now lives at **`games.html`**. `index.html` became a small hub: three `.game-card`s linking to **Games**, **Stats**, and **Archive**, rendered by a new `renderHomeCards()`. The only game content the homepage shows is the Special Edition banner, and only while one is live — when nothing is live the homepage shows no game content at all (`renderSpecialHomepageCard` already no-ops there, since the homepage has no persistent-games grid for its "nothing live" fallback card).
- The nav "Games" dropdown trigger is now a real link to `games.html` (was an inert `<button>`), so clicking it navigates there from any page while hover/focus still opens the dropdown of individual games. `.dateline__dropdown-trigger` changed to `cursor:pointer` + `text-decoration:none` to match.
- `renderGameCards()` (the per-game cards) is unchanged and now runs on `games.html` instead of `index.html`.

### Version 1.5.1 — August 2026
- Moved the retired `DAILY_PUZZLES` block — its documentation, the entry example, the array itself, and its dependent `DAILY_RESOLVED` / `DAILY_ARCHIVE` bindings plus the `migrateCrosswordWinIds()` / `backfillGuessTheTeacherWins()` run calls — to the **bottom** of `config.js`, so the top of the file is just the live games (Weekly, Special, persistent). No behavior change: the Archive still shows every past Daily Crossword / Guess the Teacher edition.

### Version 1.5 — August 2026
- **Retired Daily Crossword and Guess the Teacher.** Deleted `mini-crossword.html` and `guess-the-teacher.html`, removed their homepage cards (`GAMES` entries) and every nav-menu link to them. `DAILY_PUZZLES` is frozen but kept: `renderArchive` now shows *every* past entry (not just those older than the latest), and the "Daily Crossword & Guess the Teacher" section moved to the **bottom** of `archive.html` with a "retired — still playable here" note, so all old editions stay playable. Stats cards for both games are unchanged (archive wins still count). Removed the now-unused `TODAY` / `ARCHIVE` / `FALLBACK_DAILY` bindings.
- Added `embed.js`, loaded on every page: when the site is running inside an `<iframe>` it posts its content height (and a navigation ping) to the parent window so the parent can size the frame to fit. Inert when the site is loaded directly. See "Embedding the whole site in another page" above for the parent-side snippet.

### Version 1.4.1 — August 2026
- Fixed Weekly Word Search wins never being credited (and potentially the same for any other non-crossword embed, like Special Edition's Word Flower puzzles) — AmuseLabs sends some puzzle-player messages (`PUZZLE_LOAD`, `PUZZLE_COMPLETE`, `PUZZLE_PROGRESS`, ...) as a JSON *string* rather than an object, unlike its other messages (e.g. the AMP `embed-size` ping), and `initPuzzleCompletionListener` was reading `.id` straight off whatever arrived — silently returning early every time, since a string has no `.id` property. It now parses `event.data` first when it's a string. Found using a new on-page debug panel (`?debug=puzzle` on any puzzle-embed page) that logs every raw message AmuseLabs sends, built specifically to track this down and kept in the codebase for next time.
- Also fixed a related timing gap: the message listener was only registered once `DOMContentLoaded` fired, but a puzzle that's already been solved can replay its entire message sequence — including the completion message — within the same instant the iframe loads on a revisit. The listener now registers immediately instead of waiting.

### Version 1.4 — August 2026
- Added **Weekly Word Search** (`weekly-word-search.html`), a new weekly game sharing `WEEKLY_PUZZLES`' schedule with Weekly Crossword — each week's entry now has a `crossword` sub-object and a `wordSearch` sub-object (same pattern as `DAILY_PUZZLES` bundling Daily Crossword + Guess the Teacher), each with its own difficulty, own embed, own Archive section, own Stats streak. Also added an optional `theme` field to both (`crossword.theme` / `wordSearch.theme`, set independently): unlike Special Edition, where the theme is the whole point of its prominent homepage banner, this one is intentionally low-key — never shown on the homepage card, only as a small line on that game's own page (and its Archive detail).
- Hardened `GAMES`/`initPuzzleCompletionListener` against a `WEEKLY_PUZZLES`/`DAILY_PUZZLES` entry that only fills in one of its two sub-objects for a given day/week (e.g. a week with a crossword but no word search yet) — previously this could throw and break the entire site (the homepage card list reads both unconditionally, on every page). Now it degrades gracefully to "No ... embed URL has been set for this edition yet." on just that game.
- Added a "Brophy Home" link (to brophyprep.org) in the top nav bar, right after "Roundup Home," on every page.

### Version 1.3.2 — August 2026
- Fixed Special Edition wins not being credited for Word Flower–type embeds (`embedUrl` path `/pmm/wordf`). The win-detection listener only recognized AmuseLabs' `PUZZLE_COMPLETE` message, but Word Flower puzzles never send one — they only send `PUZZLE_PROGRESS` as each word is found, with no separate "done" event. It now also treats a Word Flower puzzle as won once `wordsFound` reaches `totalWords`. Crossword-type embeds (Mini/Weekly Crossword, Special Edition crosswords) are unaffected — they still use `PUZZLE_COMPLETE` as before.
- Renamed **Mini Crossword** to **Daily Crossword** everywhere it's displayed (nav, homepage card, page title/headings, Archive, Stats, README) — the filename (`mini-crossword.html`) and internal identifiers are unchanged, so existing win/streak history keeps working.
- The date shown in the nav bar now includes the day of the week, e.g. "Saturday, August 22, 2026" instead of just "August 22, 2026".


### Version 1.3.1 — August 2026
- Added a `404.html` page (matching the rest of the site's look, with a link back to the homepage) for any URL that doesn't match a real page. On GitHub Pages this is served automatically for unmatched routes with no extra configuration — other static hosts (Netlify, Vercel, Cloudflare Pages, etc.) typically need a one-line config pointing their "not found" setting at this file.
- Stats page now shows one ticket-stub card per game (matching the homepage's game-card style) instead of one shared list, with each stat (Wins, Streak, Fastest, High Score, Lifetime Total) as its own labeled line rather than mashed into one string. The per-browser privacy note at the bottom is now centered and shorter: "Tracked in your browser on only this device • Clearing browser history will clear this data."

### Version 1.3 — August 2026
- Replaced the persistent games' generic trivia pool with a set of ~70 Brophy-specific questions covering the school's history and founding, campus and traditions, academics, general facts, and athletics (including specific championship years) — so Bronco Dash, Bronco Splash, and Bronco Blitz now quiz players on Brophy itself rather than general trivia.
- All three persistent games (Bronco Dash, Bronco Splash, Bronco Blitz) can now be answered from the keyboard — press 1/2/3/4 or A/B/C/D to pick a choice, no mouse/tap required. Dash and Splash's answer buttons now show an A–D letter too (previously only Bronco Blitz did), so it's clear which key maps to which choice.
- Fixed the persistent games' answer choices always appearing in the same on-screen order (correct answer always in the same A/B/C/D slot every time a given question came up) — each question's choices are now shuffled fresh every time it's shown, so the correct answer's position is random.

### Version 1.3-pre.2 — August 2026
- Added **Bronco Blitz (BETA)**, a third persistent game: a 30-second A/B/C/D trivia speed round drawing from the same shared `PERSISTENT_GAME_QUESTIONS` pool as Bronco Dash and Bronco Splash. Each correct answer is worth a base 100 points, multiplied by a streak bonus that grows with consecutive correct answers (capped at 3x), plus a speed bonus that tapers off the longer you take to answer. A wrong answer breaks the streak and locks out answering for 3 seconds — the clock keeps running through the lockout, so it costs real time.
- Generalized the Stats page's `STAT_GAMES` model with `trackPoints` and `trackBestScore` options (alongside the existing `trackWins`/`trackBestTime`) for games that track points — Bronco Blitz is the first to use them, showing its lifetime point total (every round played adds to it) and its single-round high score as two separate stats, since they answer different questions ("how much have I played" vs. "what's my best round").
- Homepage now splits the game cards into two grids with a matching labeled divider above each — "Today & This Week" (Daily Crossword, Weekly Crossword, Guess the Teacher, and the "More Games Coming Soon" placeholder) and "Persistent Games — Always Available" (Bronco Dash, Bronco Splash, Bronco Blitz) — so it's unambiguous which games change day-to-day and which don't. Controlled by a new `category` field on each `GAMES` entry in `config.js`.
- Special Edition's homepage card, when nothing is currently live, now sits at the bottom of the persistent games grid (right under Bronco Blitz) instead of the daily grid — it's neither a daily nor a scheduled-recurring slot in the way Mini/Weekly/Guess the Teacher are, so it reads better grouped with the other "check in any time" cards.

### Version 1.3-pre.1 — August 2026
- Added the site's first **persistent games** — Bronco Dash and Bronco Splash — built from scratch (no embed), each running the same game every time from a large question pool answered in a random order. Both track a fastest time; Bronco Dash also tracks a win count (Bronco Splash doesn't, per design — every swim eventually finishes, so only the time matters). Neither has an Archive entry or a streak, since there's no "edition" or schedule to either of them — it's always the same game.
- **Bronco Dash**: the player stays centered on screen and starts exactly on the start line. Rather than the player's own position ever slipping backward, a separate red pace line steadily advances on its own — a correct answer pushes the player ahead and widens the gap, a wrong answer costs a 3-second wait while the line keeps closing in. If it catches the player, that's a loss (question input stops, a "Try Again" screen shows) — previously there was no way to actually lose.
- **Bronco Splash**: air depletes noticeably faster and the lap is a good deal longer, so pacing your answers actually matters instead of coasting to the end.
- Rebuilt the stick-figure animation for both games with two-segment limbs (thigh+shin, upper arm+forearm) and more keyframes for a much smoother run/swim cycle, plus a proper environment for each — Bronco Dash gets a sky, treeline, and a real running-track surface with lane lines; Bronco Splash gets pool decking, lane ropes, and deeper water.
- Generalized the Stats page's underlying data model (`STAT_GAMES`) to support win-count-only, best-time-only, or both together, so future game types aren't boxed into the win/streak shape the daily games use.
- Labeled both persistent games "(BETA)" everywhere their names appear (nav, homepage cards, page titles, Stats) — they're new and still being tuned, and the site version itself is marked as a prerelease for the same reason.
- Reworked the run cycle with brief holds at each stride's extremes (instead of a smooth back-and-forth swing) and a subtle torso twist, for a snappier, less floaty gait.
- Fixed a real bug where the swim animation's bob was silently canceling the -90deg rotation that lays the swimmer horizontal (both were animating the same element's `transform`) — the rotation now lives on a separate wrapper so the two no longer fight each other. Swimming also has its own bob and stroke timing now instead of reusing running's.
- Bronco Splash: the swimmer and the start/finish lines now sit in the vertical middle of the lane, between the lane ropes, instead of at the bottom edge.
- Bronco Dash: the treeline now sits flush on top of the track surface instead of floating above it with a gap.
- Marker movement (start/finish/pace lines) now eases between positions instead of snapping instantly, so a correct answer's forward jump reads as a smooth glide rather than a jump cut.
- Doubled the O2 refill from a correct answer in Bronco Splash.
- Fixed both figures running/swimming backward: the direction a limb swings when rotated is the opposite of what you'd guess, and the swimmer's orientation had the same issue — swapped both so the runner's legs/arms drive forward correctly and the swimmer leads with its head toward the finish instead of the start.
- Fixed the "waiting" (wrong answer) and "gasping" (out of air) poses — the waiting pose previously rotated the torso, but the legs are a separate sibling element that doesn't rotate with it, so the body looked disconnected from them; torso now stays upright and only the arms droop. The gasping pose was a perfectly rigid, symmetric zero-rotation on every limb, which read as lifeless — now a relaxed, asymmetric "barely staying afloat" droop.
- Replaced the CSS-animation-based scrolling background (used for both the track/water motion and the "boost" speed-up on a correct answer) with a JS-driven one — changing `animation-duration` on a running CSS animation causes a visible jump, which is why the boost looked like an abrupt snap. The new version eases the speed up and back down smoothly, and the boost itself is a more modest 1.8x instead of 3-4x, so it no longer looks wildly disproportionate to the actual point gained.
- The runner now actually stops (freezes, doesn't keep running in place) once it crosses the finish line, instead of still animating behind the finish screen.
- Fixed the arms still looking inverted after the previous direction fix — the legs were fixed correctly, but the arms got flipped the wrong way in that same pass (arm and leg share the same animation phase on one side of the body, so they need the same sign convention, not opposite ones).
- Bronco Splash: the pool's scrolling lines now track the swimmer's actual speed instead of a constant rate, so they ease to a stop when out of air (not moving) and ease back up once air is restored, instead of drifting on regardless of whether the swimmer is actually going anywhere.
- Merged Bronco Dash's and Bronco Splash's separate question pools into one shared `PERSISTENT_GAME_QUESTIONS` list that every persistent game (current or future) draws from, instead of each game keeping its own.

### Version 1.2.2 — August 2026
- Removed the manual "Add a past win" self-report control from the Stats page — there's no way to verify a self-reported win is genuine on a static site with no accounts or server, and the honest answer was that it shouldn't exist. Guess the Teacher's automatic recovery of past wins (from state it already stored locally) stays, since that's real data, not a claim.
- Win count and streak are now tracked separately: completing an archived edition still adds to your total win count, but no longer extends (or repairs) a streak — only winning an edition while it's still current does that, since a streak can't be patched retroactively.

### Version 1.2.1 — August 2026
- Fixed the Archive: clicking "View" now expands that edition's content directly below the row you clicked, instead of always in one shared panel below the entire list.
- Added win streaks for Daily Crossword, Weekly Crossword, and Guess the Teacher (not Special Edition, since it's a one-off rather than a recurring schedule), shown on the Stats page. A streak counts consecutive published editions won, and doesn't break just because today's/this week's hasn't been played yet — only an actually-missed edition breaks it.
- Added a way to recount wins from before the Stats page existed: Guess the Teacher wins are recovered automatically (that game already stored win/lose state locally), and each crossword-type game on the Stats page now has an "Add a past win" control to manually credit an edition you'd already solved, since there's no reliable way to detect that automatically for embedded crosswords.

### Version 1.2 — August 2026
- Added a **Stats** page (`stats.html`) showing how many times you've won each game, stored per-browser in `localStorage` (not on a server — clearing your browser's site data resets it).
- Crossword-type embeds (Daily Crossword, Weekly Crossword, Special Edition) report puzzle completions to the parent page via the embed's own `postMessage` API; wins there and in Guess the Teacher both feed the same stats, deduplicated so replaying an already-won puzzle never inflates the count.

### Version 1.1.1 — August 2026
- Grouped Daily Crossword, Weekly Crossword, Guess the Teacher, and Special Edition into a "Games" dropdown in the nav bar (hover to reveal — the trigger itself doesn't navigate anywhere), so the top nav stays short as more games get added.
- The Special Edition page now shows a "No Special Edition Today" card instead of just hiding the panel when nothing's live.

### Version 1.1 — August 2026
- Added the **Special Edition** game (`special-edition.html`): a themed, one-off game slot for school breaks and special occasions. Unlike the recurring games, each entry only shows up between its own start and end date (`SPECIAL_PUZZLES` in `config.js`), then automatically moves to a new "Special Edition" section in the Archive. Any embed type works (crossword, spelling bee, etc.) — it's not tied to one game format. When live, it's a large, prominent banner above the regular game cards on the homepage, with the theme front and center; when there's nothing live, it's a normal card at the bottom of the list.
- Special Edition entries include a hand-typed `date` label (same pattern as the other games), so the display text isn't limited to the raw start/end dates.

### Version 1.0 — August 2026
- Initial launch: Weekly Crossword, Daily Crossword, Guess the Teacher, and Archive
- Config-driven publishing system (`config.js`) with automatic past/present/future resolution



<!--
  Add new entries above this line, newest on top:

  ### Version X.X — Month Year
  - What changed
  - Why it matters (if not obvious)
-->
