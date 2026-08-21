# The Roundup Games

Games and puzzles from **The Roundup**, the student-led newspaper of Brophy College Preparatory. Built as a lightweight static site — no build step, no dependencies — so new puzzles can be published just by editing one file.

Live features:

- **Weekly Crossword** — a bigger, themed puzzle posted every Monday
- **Mini Crossword** — a fresh grid every school day
- **Guess the Teacher** — three clues (hardest to easiest), three guesses, name the faculty member
- **Special Edition** — a themed, one-off game slot for school breaks and special occasions (any embed type — crossword, spelling bee, etc.), live only for its own configured date range
- **Archive** — every past edition, auto-populated as new puzzles go live
- **Stats** — how many times you've won each game, tracked in your own browser
- More games planned — see the homepage's "Coming Soon" card

## How it works

Everything content-related lives in [`config.js`](config.js). There is no separate "archive" file to manage — every puzzle (past, present, or future) sits in one list, and the site figures out on its own what to show as "today" vs. what belongs in the archive, based on each entry's `isoDate` compared to the visitor's own device clock.

This means you can:

- **Schedule days (or weeks) in advance.** Add an entry with a future `isoDate` and it stays completely invisible — not shown as current, not in the archive — until that date actually arrives.
- **Fix a past puzzle** by editing its entry directly, no hunting through a separate archive file.
- **Add embed links** for crosswords (`crossword.embedUrl`) and they show up automatically wherever that entry is displayed — today's page, the homepage card, or the archive.

See the comments at the top of `config.js` for the full breakdown of `DAILY_PUZZLES`, `WEEKLY_PUZZLES`, and `GAMES`.

## Project structure

```
index.html               Homepage — game cards, pulled from GAMES in config.js
mini-crossword.html       Today's Mini Crossword
weekly-crossword.html     This week's Weekly Crossword
guess-the-teacher.html    Today's Guess the Teacher
special-edition.html      The current Special Edition game (or a "nothing today" message)
archive.html              Past editions of every game
stats.html                Per-browser win counts for each game
config.js                 All puzzle content + shared rendering logic
styles.css                Shared styling for every page
logo.png / favicon.png / apple-touch-icon.png   Site branding
```

## Editing content

1. Open `config.js`.
2. Add a new entry to `DAILY_PUZZLES` (for a Mini Crossword / Guess the Teacher day) or `WEEKLY_PUZZLES` (for a Weekly Crossword), following the example templates in the comments.
3. Save. That's it — no rebuild, no redeploy step beyond pushing the file.

The footer's version number (`SITE_VERSION` in `config.js`) is a manual label for tracking releases — it's bumped deliberately, not automatically.

---

## Version history

Newest at the top. Add an entry here whenever a change is significant enough to be worth noting (new game, notable feature, structural change, etc.) — small content updates (just adding a day's puzzle) don't need an entry.

### Unreleased


### Version 1.2 — August 2026
- Added a **Stats** page (`stats.html`) showing how many times you've won each game, stored per-browser in `localStorage` (not on a server — clearing your browser's site data resets it).
- Crossword-type embeds (Mini Crossword, Weekly Crossword, Special Edition) report puzzle completions to the parent page via the embed's own `postMessage` API; wins there and in Guess the Teacher both feed the same stats, deduplicated so replaying an already-won puzzle never inflates the count.

### Version 1.1.1 — August 2026
- Grouped Mini Crossword, Weekly Crossword, Guess the Teacher, and Special Edition into a "Games" dropdown in the nav bar (hover to reveal — the trigger itself doesn't navigate anywhere), so the top nav stays short as more games get added.
- The Special Edition page now shows a "No Special Edition Today" card instead of just hiding the panel when nothing's live.

### Version 1.1 — August 2026
- Added the **Special Edition** game (`special-edition.html`): a themed, one-off game slot for school breaks and special occasions. Unlike the recurring games, each entry only shows up between its own start and end date (`SPECIAL_PUZZLES` in `config.js`), then automatically moves to a new "Special Edition" section in the Archive. Any embed type works (crossword, spelling bee, etc.) — it's not tied to one game format. When live, it's a large, prominent banner above the regular game cards on the homepage, with the theme front and center; when there's nothing live, it's a normal card at the bottom of the list.
- Special Edition entries include a hand-typed `date` label (same pattern as the other games), so the display text isn't limited to the raw start/end dates.

### Version 1.0 — August 2026
- Initial launch: Weekly Crossword, Mini Crossword, Guess the Teacher, and Archive
- Config-driven publishing system (`config.js`) with automatic past/present/future resolution



<!--
  Add new entries above this line, newest on top:

  ### Version X.X — Month Year
  - What changed
  - Why it matters (if not obvious)
-->
