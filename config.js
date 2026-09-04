/* ================================================================
   THE ROUNDUP GAMES — CONFIG
   ----------------------------------------------------------------
   This file is shared by every page (index.html, games.html,
   weekly-crossword.html, weekly-word-search.html,
   special-edition.html, bronco-dash.html, bronco-splash.html,
   bronco-blitz.html, archive.html, stats.html, about.html,
   report-bug.html) — so you only ever edit game content in ONE
   place.

   RETIRED GAMES
   -----------------------------------------------------------------
   Daily Crossword and Guess the Teacher are no longer published.
   Their pages, homepage cards, and nav links are gone as of v1.5.
   DAILY_PUZZLES is kept only so every past entry stays playable in
   the Archive (bottom of archive.html). Nothing needs to be added
   to it anymore.

   HOW THIS WORKS NOW
   -----------------------------------------------------------------
   Every Weekly Crossword + Weekly Word Search lives in ONE list:
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

   PERSISTENT_GAME_QUESTIONS works differently from everything above
   — it feeds the "persistent" games (Bronco Dash, Bronco Splash, and
   any added later): there's no date logic at all, no current/archive
   split. It's the same game every time, just answered from a large
   question pool in a random order each playthrough. All persistent
   games share this ONE pool — see its own section below for the
   entry format.

   • TODAY_DATE — auto-generated from today's real date, shown in
     the header. No need to edit this.
   • DAILY_PUZZLES — retired Daily Crossword + Guess the Teacher
     entries, kept so they stay playable in the Archive only.
   • WEEKLY_PUZZLES — every Weekly Crossword + Weekly Word Search:
     one shared weekly schedule, but the two games stay fully
     separate (own difficulty, own theme, own archive, own streak
     each).
   • SPECIAL_PUZZLES — every Special Edition game, one entry per
     occasion, each with its own start/end date. See its own section
     below for details.
   • PERSISTENT_GAME_QUESTIONS — the shared question pool for every
     persistent game. See its own section below.
   • GAMES — controls the cards on the Games page (games.html).
     The homepage itself just links to Games / Stats / Archive
     (plus the Special Edition banner when one is live).
   • SITE_VERSION — shown in the footer. Bump it whenever you want.
   ================================================================ */

/* TODAY'S DATE
   -----------------------------------------------------------------
   Auto-generated from the visitor's own clock, so this always
   shows the real current date — no manual updating needed. */
const TODAY_DATE = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

/* SITE VERSION
   -----------------------------------------------------------------
   Shown in the footer, e.g. "Version 1.3". Purely a label for your
   own tracking — change it to whatever you want, whenever you want. */
const SITE_VERSION = "2.0.2";

/* BUG REPORT / CONTACT FORM
   -----------------------------------------------------------------
   The embed link for the Google Form on report-bug.html (the "Bug
   Report / Contact" page — it's used both for bug reports and for
   contacting the editors). Create the
   form at forms.google.com, then Send → the embed icon (< >) → copy
   the URL inside that code's src="...". Paste it here between the
   quotes. Leave it as "" and the page will show a "not set up yet"
   message instead of a broken embed. */
const BUG_REPORT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd06QWeyW1mz8oQe6ePfB4d1G1raWePiSZIiBOhZq-YZXC2Gg/viewform?embedded=true";

/* The plain shareable link to the same form (e.g. the "Send" button's
   forms.gle short link, NOT the embed URL above) — shown below the
   embed as a fallback in case the embed itself isn't loading for
   someone. Leave it as "" to hide that fallback line entirely. */
const BUG_REPORT_FORM_LINK = "https://forms.gle/X4fS7ke7pyWbm3Nu7";

/* LEADERBOARD (Supabase) — see the "Leaderboard (Supabase)" section
   of the README for the table/RLS/trigger SQL.
   -----------------------------------------------------------------
   These point at the project's REST API. The anon key is meant to
   ship in client-side code — Row Level Security + a name-check
   trigger on the `scores` table are what actually guard the data.
   Blank BOTH of these to instantly switch every leaderboard feature
   back off (it drops to a quiet "not set up yet" line; the per-game
   stats cards and challenge/same-set links don't depend on it). */
const SUPABASE_URL = "https://wscjrgimchvfvmzaimhd.supabase.co/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzY2pyZ2ltY2h2ZnZtemFpbWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NzEwMTYsImV4cCI6MjEwNDA0NzAxNn0.CAQyR62LxFD4vSrjGDPxkShYEEcGQM1WfVF2ZC-qFtU";
function leaderboardEnabled(){ return !!(SUPABASE_URL && SUPABASE_ANON_KEY); }

/* ISO-week bucket like "2026-W36" — what the weekly boards group on.
   Monday-based, matches the site's "new games every school week"
   cadence. Pass a Date (or nothing for "this week"). */
function isoWeekKey(input){
  const d = input ? new Date(input) : new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/* ----------------------------------------------------------------
   WEEKLY PUZZLES — Weekly Crossword + Weekly Word Search
   ----------------------------------------------------------------
   Same idea as DAILY_PUZZLES (now retired, moved to the bottom of
   this file): one object per week, any order,
   past/present/future all mixed together. isoDate should be the
   Monday that week's puzzles go live. Each entry:

     isoDate  — "yyyy-mm-dd", same rules as DAILY_PUZZLES' isoDate.
     date     — the display label shown to visitors, e.g.
                "Week of August 17, 2026". Typed by hand, doesn't
                have to match isoDate's format.
     crossword.difficulty / .theme / .embedUrl
     wordSearch.difficulty / .theme / .embedUrl

   Weekly Crossword and Weekly Word Search are two fully separate
   games sharing one weekly schedule — own difficulty, own theme,
   own embed, own Archive/Stats entry each. `theme` is optional
   (leave "" to skip it) on either one, independently: unlike Special
   Edition's theme, which is the whole point of its prominent
   homepage banner, these are deliberately low-key — never shown on
   the homepage card, only as a small line on that game's own page
   (and its Archive detail).

   If only one of the two is ready for a given week, the safest way
   is to still include BOTH `crossword` and `wordSearch` on the
   entry — just leave the one that isn't ready with empty strings
   (`difficulty: ""`, `theme: ""`, `embedUrl: ""`), exactly like the
   example below. That game's own page will then just show "No ...
   embed URL has been set for this edition yet." Leaving a key out
   entirely is also handled gracefully (same result), but sticking to
   the empty-object pattern keeps every entry's shape consistent and
   easy to scan. Same idea applies to DAILY_PUZZLES (retired, at the
   bottom of this file), for `crossword` and `guessTheTeacher`.
   ---------------------------------------------------------------- */

/* EXAMPLE FOR WEEKLY PUZZLES

  {
    isoDate: "",
    date: "",
    crossword: {
      difficulty: "",
      theme: "",
      embedUrl: ""
    },
    wordSearch: {
      difficulty: "",
      theme: "",
      embedUrl: ""
    }
  },

*/

const WEEKLY_PUZZLES = [
  {
    isoDate: "2026-08-31",
    date: "Week of August 31, 2026",
    crossword: {
      difficulty: "3/5",
      theme: "OFJ",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupweekaug31&set=carter"
    },
    wordSearch: {
      difficulty: "4/5",
      theme: "Enemy Team Mascots for Varsity Football Games",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/wordsearch?id=roundupsearchweekaug31&set=carter"
    }
  },
  {
    isoDate: "2026-08-24",
    date: "Week of August 24, 2026",
    crossword: {
      difficulty: "3/5",
      theme: "Brophy Athletics",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupweekaug24&set=carter"
    },
    wordSearch: {
      difficulty: "5/5",
      theme: "Graduation Requirements",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/wordsearch?id=roundupsearchweekaug24&set=carter"
    }
  },
  {
    isoDate: "2026-08-17",
    date: "Week of August 17, 2026",
    crossword: {
      difficulty: "4/5",
      theme: "General Knowledge",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupweekaug17&set=carter"
    },
    wordSearch: {
      difficulty: "3/5",
      theme: "Building Names",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/wordsearch?id=roundupsearchweekaug17&set=carter"
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
    startIsoDate: "2026-08-31",
    endIsoDate: "2026-09-04",
    date: "First Week of Roundup Games",
    theme: "Welcome to The Roundup Games",
    difficulty: "3/5",
    embedUrl: "https://puzzleme.amuselabs.com/pmm/wordf?id=roundupspecial1&set=carter"
  }
];

/* ----------------------------------------------------------------
   PRINT EDITION CROSSWORD — the crossword from the paper's print run
   ----------------------------------------------------------------
   The Roundup prints roughly five times a school year, and each
   print issue carries a crossword. This list is that crossword,
   put online. It works exactly like WEEKLY_PUZZLES above (rolling
   forward — the entry with the LATEST isoDate that isn't in the
   future is "current," everything older slides into the Archive,
   anything future stays invisible until its date arrives) — just on
   a much slower, ~5x-a-year cadence instead of weekly. There's no
   streak on it (see STAT_GAMES below): the print issues don't come
   out on a regular enough schedule for "consecutive" to mean much,
   same reasoning as Special Edition.

   To publish a new print edition's crossword, add ONE entry here
   with that issue's isoDate. It'll sit hidden until that date
   arrives, then automatically become the current one (and whatever
   was showing slides into the Archive). To fix a past one, edit its
   entry in place.

   Each entry:
     isoDate  — "yyyy-mm-dd". The day this print edition's crossword
                goes live online (usually the print issue's date).
     date     — the display label shown to visitors, e.g.
                "Fall Print Edition — October 2026". Typed by hand,
                doesn't have to match isoDate's format.
     crossword.difficulty — e.g. "3/5". Optional — leave "" to skip.
     crossword.theme      — optional; leave "" to skip. Shown only as
                            a small line on the Print Edition page
                            and its Archive detail (same low-key
                            treatment as the Weekly puzzles' themes,
                            never on a homepage-style banner).
     crossword.embedUrl   — the embed link. Create the puzzle at
                            puzzleme.amuselabs.com, then copy the
                            player URL here. Leave "" and the page
                            shows a "no embed set yet" message.
   ---------------------------------------------------------------- */

/* EXAMPLE FOR PRINT EDITION

  {
    isoDate: "",
    date: "",
    crossword: {
      difficulty: "",
      theme: "",
      embedUrl: ""
    }
  },

*/

const PRINT_PUZZLES = [

];

/* ----------------------------------------------------------------
   PERSISTENT GAMES — Bronco Dash, Bronco Splash, and any future ones
   ----------------------------------------------------------------
   Unlike everything above, these games have no date logic at all —
   no isoDate, no current/archive split. It's the same game every
   time; each playthrough just draws from a large pool of questions
   in a fresh random order (the pool reshuffles and keeps going if a
   run somehow outlasts it, so it never runs dry).

   One shared pool (PERSISTENT_GAME_QUESTIONS) feeds every persistent
   game — Bronco Dash, Bronco Splash, Bronco Blitz, and any added
   later — rather than each game keeping its own separate list. Add a
   question once here and it's in the mix for all of them; each game
   still shuffles its own independent run order, they just draw from
   the same well.

   Each entry:
     question     — the question text.
     choices      — exactly 4 answer options, in the order they'll
                    be shown as buttons.
     correctIndex — which entry in `choices` (0-3) is correct.

   Add as many as you want, in any order — there's no such thing as
   a "used up" question, so a bigger pool just means more variety.
   ---------------------------------------------------------------- */

/* EXAMPLE FOR PERSISTENT GAME QUESTIONS

  {
    question: "",
    choices: ["", "", "", ""],
    correctIndex: 0
  },

*/

const PERSISTENT_GAME_QUESTIONS = [
  // ===== HISTORY & FOUNDING =====
  { question: "In what year was Brophy College Preparatory founded?", choices: ["1918", "1928", "1938", "1948"], correctIndex: 1 },
  { question: "Who founded Brophy in memory of her late husband?", choices: ["Ellen A. Brophy", "Mary Xavier", "Frances Keating", "Dorothy Steele"], correctIndex: 0 },
  { question: "Brophy was founded in memory of which man?", choices: ["William Henry Brophy", "Frank Cullen Brophy", "John Patrick Brophy", "Robert E. Ryan"], correctIndex: 0 },
  { question: "The Great Depression forced Brophy to close its doors in what year?", choices: ["1930", "1932", "1935", "1940"], correctIndex: 2 },
  { question: "How many years did Brophy remain closed before reopening?", choices: ["10", "12", "17", "20"], correctIndex: 2 },
  { question: "In what year did Brophy reopen, this time exclusively as a high school?", choices: ["1945", "1950", "1952", "1955"], correctIndex: 2 },
  { question: "When it first opened in 1928, Brophy offered high school classes plus what other level of coursework?", choices: ["Trade school courses", "First-year college courses", "Seminary courses", "Military academy courses"], correctIndex: 1 },
  { question: "Brophy's 1928 opening marked the return of which Catholic religious order to Arizona after more than 160 years?", choices: ["Franciscans", "Dominicans", "Jesuits", "Benedictines"], correctIndex: 2 },
  { question: "What is Brophy's Latin motto?", choices: ["Ad Astra Per Aspera", "Ad Majorem Dei Gloriam", "Veritas Vos Liberabit", "Fides et Ratio"], correctIndex: 1 },
  { question: "What does Brophy's motto, 'Ad Majorem Dei Gloriam,' translate to in English?", choices: ["For God and Country", "For the Greater Glory of God", "Faith Above All", "Onward and Upward"], correctIndex: 1 },
  { question: "Approximately how many students enrolled when Brophy first opened in September 1928?", choices: ["26", "42", "56", "70"], correctIndex: 2 },
  { question: "In what year was Brophy's chapel added to the National Register of Historic Places?", choices: ["1983", "1993", "2003", "2013"], correctIndex: 1 },
  { question: "What was the original name of the building now known as Brophy Hall, before it was renamed in 2006?", choices: ["Regis Hall", "Loyola Hall", "Founders Hall", "Xavier Hall"], correctIndex: 0 },
  { question: "In 2006, Regis Hall was renamed in honor of which member of the Brophy family?", choices: ["Frank C. Brophy Jr.", "William Henry Brophy", "Ellen A. Brophy", "Michael Brophy"], correctIndex: 0 },
  { question: "Brophy added an on-campus middle school in 2011 to serve underserved young men with strong academic potential. What is it called?", choices: ["Loyola Academy", "Xavier Middle School", "Ignatius Prep", "Ricci Academy"], correctIndex: 0 },
 
  // ===== CAMPUS, TRADITIONS & IDENTITY =====
  { question: "What are Brophy's official school colors?", choices: ["Blue and gold", "Red and white", "Green and white", "Maroon and gray"], correctIndex: 1 },
  { question: "What is Brophy's mascot?", choices: ["Wildcat", "Bronco", "Bulldog", "Falcon"], correctIndex: 1 },
  { question: "Brophy adopted its Bronco mascot in 1952 after purchasing used equipment from which university?", choices: ["Santa Clara University", "Georgetown University", "Loyola Marymount University", "Boston College"], correctIndex: 0 },
  { question: "What is the name of Brophy's all-girls sister school on an adjacent campus?", choices: ["Xavier College Preparatory", "St. Mary's High School", "Notre Dame Prep", "Our Lady of Sorrows"], correctIndex: 0 },
  { question: "Brophy's football rivalry with which school dates back to 1959?", choices: ["St. Mary's", "Xavier College Prep", "Central High School", "Corona del Sol"], correctIndex: 0 },
  { question: "What is the name of Brophy's student newspaper?", choices: ["The Bronco Beat", "The Roundup", "The Stampede Times", "The Wrangler Weekly"], correctIndex: 1 },
  { question: "What is Brophy's yearbook called?", choices: ["The Tower", "The Bronco", "The Legacy", "The Stampede"], correctIndex: 0 },
  { question: "How tall is the bell tower atop Brophy's historic chapel?", choices: ["95 feet", "115 feet", "135 feet", "155 feet"], correctIndex: 2 },
  { question: "Brophy's campus architecture is built in which style?", choices: ["Gothic Revival", "Spanish Colonial", "Art Deco", "Modernist"], correctIndex: 1 },
  { question: "Brophy's system of dividing students into eight houses named after saints was inspired by the residential college system at which university?", choices: ["Harvard", "Yale", "Princeton", "Stanford"], correctIndex: 1 },
  { question: "Which of these is one of Brophy's eight student houses?", choices: ["Gonzaga", "Ravenclaw", "Hufflepuff", "Slytherin"], correctIndex: 0 },
  { question: "What is the name of Brophy's retreat center located near Sedona?", choices: ["Manresa", "Loyola Lodge", "Xavier Ranch", "Ignatius Retreat"], correctIndex: 0 },
  { question: "Brophy's basketball student section, known for its energy, has been compared to Duke's 'Cameron Crazies.' What is it called?", choices: ["The 6th Man", "The Bronco Brigade", "The Red Sea", "The Stampede"], correctIndex: 0 },
  { question: "The phrase 'Men for Others,' central to Brophy's mission, was first articulated in 1974 by which Jesuit leader?", choices: ["Fr. Pedro Arrupe", "St. Ignatius of Loyola", "Pope John Paul II", "Fr. James Martin"], correctIndex: 0 },
  { question: "Brophy is the only school of what type in the entire state of Arizona?", choices: ["Jesuit high school", "All-boys military academy", "Montessori high school", "Boarding school"], correctIndex: 0 },
  { question: "What is the nickname of Brophy's multi-functional gymnasium, completed in 2016?", choices: ["The Vault", "The Dutch", "The Hangar", "The Bunker"], correctIndex: 1 },
 
  // ===== ACADEMICS & CURRICULUM =====
  { question: "Brophy's senior capstone program, which pairs graduate-level theology discussion with a year-long internship, is named after which figure?", choices: ["Romero", "Loyola", "Xavier", "Aquinas"], correctIndex: 0 },
  { question: "Through which community college does Brophy offer students a dual-enrollment program for college credit?", choices: ["Phoenix College", "Rio Salado College", "Scottsdale Community College", "Glendale Community College"], correctIndex: 1 },
  { question: "Brophy was among the first schools in the country to implement which College Board program?", choices: ["AP Capstone Diploma", "International Baccalaureate", "Cambridge AICE", "Early College Program"], correctIndex: 0 },
  { question: "As part of the 'Frosh Experience,' incoming freshmen are paired with a senior mentor known as their what?", choices: ["Big Brother", "Guardian Angel", "Sponsor", "Wingman"], correctIndex: 0 },
  { question: "The 'Frosh Experience' culminates each spring with a day of volunteering at what event?", choices: ["Special Olympics Game Day", "Habitat for Humanity Build", "The Turkey Drive", "Founders Day"], correctIndex: 0 },
  { question: "Which subjects made up Brophy's very first course of study in 1928, alongside religion?", choices: ["Latin, English, math/science, and history/civics", "Spanish, chemistry, art, and PE", "Greek, philosophy, music, and drama", "Computer science, biology, French, and speech"], correctIndex: 0 },
  { question: "Approximately how many Advanced Placement classes does Brophy offer?", choices: ["15", "24", "33", "42"], correctIndex: 2 },
  { question: "What annual charity event has students compete for donations as part of the inter-house points competition?", choices: ["The Book Drive", "The Turkey Drive", "The Coat Drive", "The Can Drive"], correctIndex: 1 },
  { question: "What replaced the Steele Library as Brophy's central information and technology hub?", choices: ["Innovation Commons", "McCain Colonnade", "Harper Great Hall", "Piper Center"], correctIndex: 0 },
  { question: "Which Brophy alumnus and entrepreneur founded 'Not Impossible Labs,' whose work is used as an example in Brophy's technology courses?", choices: ["Mick Ebeling", "David Griffin", "Richard Mahoney", "Glen Keane"], correctIndex: 0 },
 
  // ===== GENERAL SCHOOL FACTS =====
  { question: "In which U.S. state is Brophy College Preparatory located?", choices: ["California", "Arizona", "Nevada", "New Mexico"], correctIndex: 1 },
  { question: "In which city is Brophy College Preparatory located?", choices: ["Tucson", "Scottsdale", "Phoenix", "Mesa"], correctIndex: 2 },
  { question: "Brophy College Preparatory enrolls students of which gender?", choices: ["All-male", "All-female", "Co-ed", "Varies by grade"], correctIndex: 0 },
  { question: "What grade levels does Brophy's high school serve?", choices: ["6-8", "7-12", "9-12", "K-12"], correctIndex: 2 },
  { question: "Approximately how many students currently attend Brophy?", choices: ["900", "1,100", "1,400", "1,700"], correctIndex: 2 },
  { question: "Approximately what percentage of Brophy's student body identifies as Catholic?", choices: ["45%", "55%", "65%", "75%"], correctIndex: 2 },
  { question: "Brophy College Preparatory is what type of school?", choices: ["Public school", "Private Catholic school", "Charter school", "Military academy"], correctIndex: 1 },
 
  // ===== ATHLETICS — GENERAL =====
  { question: "How many total state championships has Brophy won across all sports, according to the school's own count?", choices: ["About 75", "About 95", "About 119", "About 150"], correctIndex: 2 },
  { question: "Sports Illustrated has ranked Brophy's athletic program among the top how many in the nation?", choices: ["Top 10", "Top 25", "Top 50", "Top 100"], correctIndex: 1 },
  { question: "Brophy is one of only two Arizona high schools that field a rowing/crew team. What is the other school?", choices: ["Xavier College Preparatory", "Saint Mary's", "Notre Dame Prep", "Corona del Sol"], correctIndex: 0 },
  { question: "Which of the following is one of Brophy's club sports (not sanctioned by the AIA)?", choices: ["Archery", "Football", "Basketball", "Baseball"], correctIndex: 0 },
  { question: "What Arizona high school athletic association do Brophy's teams compete in?", choices: ["AIA", "CIF", "UIL", "OHSAA"], correctIndex: 0 },
  { question: "Brophy's esports program has been ranked where nationally?", choices: ["Unranked", "Top 50", "Top 10", "No. 1"], correctIndex: 3 },
 
  // ===== ATHLETICS — SPECIFIC CHAMPIONSHIPS =====
  { question: "As of 2020, how many state titles had Brophy's storied swim program won?", choices: ["22", "32", "42", "52"], correctIndex: 2 },
  { question: "How many of Brophy's swim state titles were won in a row, consecutively?", choices: ["12", "22", "32", "42"], correctIndex: 2 },
  { question: "In what year did the Brophy swim team win the national high school championship?", choices: ["2001", "2003", "2005", "2008"], correctIndex: 2 },
  { question: "Brophy football won 5A-I state championships in 2005 and which other year?", choices: ["2006", "2007", "2008", "2009"], correctIndex: 1 },
  { question: "Brophy's baseball and volleyball teams both won state championships in the same year. Which year was it?", choices: ["2004", "2005", "2006", "2007"], correctIndex: 2 },
  { question: "Brophy's boys soccer team won back-to-back Division 1 state titles in which two years?", choices: ["2012 and 2013", "2014 and 2015", "2016 and 2017", "2018 and 2019"], correctIndex: 1 },
  { question: "In 2025, Brophy's boys basketball team won the school's first-ever state championship in that sport. How many times had the team previously finished as runner-up?", choices: ["Two", "Three", "Four", "Five"], correctIndex: 2 },
  { question: "Who is the head coach who led Brophy's basketball team to its historic first state title in 2025?", choices: ["Matt Hooten", "Jason Jewell", "Paul Allen", "Robert Ryan"], correctIndex: 0 },
  { question: "In 2025, Brophy's golf team won the state championship by how many strokes?", choices: ["11", "16", "21", "26"], correctIndex: 2 },
  { question: "The 2025 golf title marked how many state championships all-time for that program?", choices: ["7th", "8th", "9th", "10th"], correctIndex: 3 },
  { question: "Brophy's lacrosse team won three straight Division I state championships from 2022 through which year?", choices: ["2023", "2024", "2025", "2026"], correctIndex: 1 },
  { question: "Brophy's tennis program won a remarkable streak of state championships from 1996 through what year?", choices: ["1999", "2001", "2003", "2005"], correctIndex: 2 },
  { question: "In what year did Brophy win its first-ever varsity hockey state championship?", choices: ["2010", "2012", "2014", "2016"], correctIndex: 1 },
  { question: "Brophy's soccer program is one of the most successful in the state, having won how many total state titles?", choices: ["Four", "Six", "Eight", "Ten"], correctIndex: 2 },
  { question: "Brophy took home the 5A-1 soccer state title in the 2019-2020 season and finished the year ranked where nationally?", choices: ["No. 3", "No. 8", "No. 13", "No. 20"], correctIndex: 2 },
  { question: "Brophy's rowing/crew team won Arizona State Junior Rowing Championships in 2011, 2012, and which other year?", choices: ["2013", "2014", "2015", "2016"], correctIndex: 0 },
  { question: "Brophy volleyball won state championships in 1998, 2006, and which other year?", choices: ["2000", "2001", "2003", "2004"], correctIndex: 1 },
  { question: "Brophy's track and field program produced Arizona state champions in 2011 and which other year?", choices: ["2012", "2013", "2014", "2015"], correctIndex: 1 }
];

/* ================================================================
   RESOLUTION LOGIC — figures out present/past/future from the
   lists above using the visitor's own device clock. You shouldn't
   need to touch this.
   ================================================================ */

/* Internal preview switch. With "ignoresort=true" in the page URL's
   query string, the date gates in the two resolvers below are
   loosened so a puzzle scheduled for a future date (next week's
   Weekly puzzle, an upcoming Special Edition) resolves as the
   current one instead of staying hidden until its date arrives.
   It's a spot-check aid for whoever is scheduling puzzles — off by
   default, changes nothing about what a normal visitor sees, and
   nothing on the site links to or mentions it. Streak/stat logic is
   deliberately NOT affected (see getPublishedEntries), so a preview
   visit can't credit a win for a puzzle that isn't really out yet. */
const PREVIEW_UNRELEASED = location.search.indexOf("ignoresort=true") !== -1;

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
    if (PREVIEW_UNRELEASED || entry.isoDate <= todayIso) {
      if (current) archive.push(current);
      current = entry;
    }
    // entry.isoDate > todayIso: a future puzzle — skip it entirely
    // (unless PREVIEW_UNRELEASED is on, which lets the latest
    //  scheduled entry surface as current for a spot-check)
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
    if (!PREVIEW_UNRELEASED && entry.startIsoDate > todayIso) continue; // hasn't started yet — invisible
    if (entry.endIsoDate < todayIso) {
      archive.push(entry); // already over
    } else {
      current = entry; // live today (or, with PREVIEW_UNRELEASED, an upcoming one)
    }
  }

  return { current, archive };
}

/* Shown when WEEKLY_PUZZLES has no entry dated today or earlier yet
   (e.g. brand new site, or every entry added so far is a future one).
   Keeps the rest of the page from breaking. */
const FALLBACK_WEEKLY = {
  isoDate: null,
  date: "No puzzle published yet",
  crossword: { difficulty: null, theme: "", embedUrl: "" },
  wordSearch: { difficulty: null, theme: "", embedUrl: "" }
};

/* Same idea as FALLBACK_WEEKLY, for the Print Edition crossword when
   PRINT_PUZZLES has no entry dated today or earlier yet. */
const FALLBACK_PRINT = {
  isoDate: null,
  date: "No print edition published yet",
  crossword: { difficulty: null, theme: "", embedUrl: "" }
};

const WEEKLY_RESOLVED = resolvePuzzleSet(WEEKLY_PUZZLES);
const THIS_WEEK = WEEKLY_RESOLVED.current || FALLBACK_WEEKLY;
const WEEKLY_ARCHIVE = WEEKLY_RESOLVED.archive;

const SPECIAL_RESOLVED = resolveSpecialPuzzle(SPECIAL_PUZZLES);
const SPECIAL_EDITION = SPECIAL_RESOLVED.current; // null when nothing is live today
const SPECIAL_ARCHIVE = SPECIAL_RESOLVED.archive;

/* Print Edition crossword — rolls forward exactly like WEEKLY above,
   just on the paper's ~5x-a-year print cadence. */
const PRINT_RESOLVED = resolvePuzzleSet(PRINT_PUZZLES);
const THIS_PRINT = PRINT_RESOLVED.current || FALLBACK_PRINT;
const PRINT_ARCHIVE = PRINT_RESOLVED.archive;

/* ----------------------------------------------------------------
   GAMES LIST
   Controls the cards shown on the Games page (games.html). The
   homepage (index.html) no longer lists individual games — it just
   links to Games / Stats / Archive. `href` is the page the
   Play button links to — add a new game by adding an entry here
   and building its page the same way weekly-crossword.html is built.
   `date` is what shows on the card. The Weekly cards default to
   THIS_WEEK.date above, and the Print Edition card to THIS_PRINT.date,
   so they stay in sync automatically — you don't need to edit it here
   too. Leave `href` as null for a game that isn't playable yet — it'll
   show as a quiet "coming soon" card with no link (nothing uses that
   right now, but renderGameCards still handles it).
   `category` controls which homepage grid a card lands in —
   "daily" for the recurring/scheduled games (Weekly Crossword,
   Weekly Word Search, Print Edition Crossword), "persistent" for the
   always-available games (Bronco Dash/Splash/Blitz). renderGameCards splits on this field
   and a divider is shown between the two grids so it's clear which
   games change day-to-day and which don't.
   ---------------------------------------------------------------- */
const GAMES = [
  {
    id: "weekly-crossword",
    title: "Weekly Crossword",
    blurb: "A bigger, themed puzzle — posted every Monday.",
    date: THIS_WEEK.date,
    difficulty: THIS_WEEK.crossword ? THIS_WEEK.crossword.difficulty : null,
    href: "weekly-crossword.html",
    category: "daily"
  },
  {
    id: "weekly-word-search",
    title: "Weekly Word Search",
    blurb: "A themed word search — posted every Monday.",
    date: THIS_WEEK.date,
    difficulty: THIS_WEEK.wordSearch ? THIS_WEEK.wordSearch.difficulty : null,
    href: "weekly-word-search.html",
    category: "daily"
  },
  {
    id: "bronco-blitz",
    title: "Bronco Blitz",
    blurb: "30 seconds, A/B/C/D trivia — chain correct answers for a growing multiplier and race the clock for a speed bonus.",
    date: "Always Available",
    difficulty: null,
    href: "bronco-blitz.html",
    category: "persistent"
  },
  {
    id: "bronco-dash",
    title: "Bronco Dash",
    blurb: "Race down the track, answering questions to sprint ahead — reach the finish line as fast as you can.",
    date: "Always Available",
    difficulty: null,
    href: "bronco-dash.html",
    category: "persistent"
  },
  {
    id: "bronco-splash",
    title: "Bronco Splash",
    blurb: "Swim a lap before your air runs out — answer questions to catch your breath and pick up speed.",
    date: "Always Available",
    difficulty: null,
    href: "bronco-splash.html",
    category: "persistent"
  },
  {
    id: "print-edition",
    title: "Print Edition Crossword",
    blurb: "The crossword from the latest print issue of The Roundup — a new one about five times a school year.",
    date: THIS_PRINT.date,
    difficulty: THIS_PRINT.crossword ? THIS_PRINT.crossword.difficulty : null,
    href: "print-edition.html",
    category: "daily"
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

/* ---------- homepage hub cards (index.html only) ----------
   The homepage isn't a games list anymore — it's a small hub with
   cards pointing at the Games, Stats, Archive, and About pages. The
   full games lineup lives on games.html (renderGameCards below).
   The only game content the homepage ever shows is the Special
   Edition banner, and only while one is live — see
   renderSpecialHomepageCard. */
function renderHomeCards(){
  const mount = document.getElementById("homeCards");
  if (!mount) return;
  const cards = [
    {
      title: "Games",
      blurb: "The full lineup — this week's Weekly Crossword and Word Search, the always-available Bronco games, and any Special Edition that's live right now.",
      href: "games.html",
      cta: "Browse games →"
    },
    {
      title: "Leaderboard & Stats",
      blurb: "This week's top players on the shared leaderboard, plus your own win counts and streaks tracked in your browser.",
      href: "stats.html",
      cta: "Open Leaderboard & Stats →"
    },
    {
      title: "Archive",
      blurb: "Every past edition of the Roundup's games, in one place — going back to the start of the year.",
      href: "archive.html",
      cta: "Open the archive →"
    },
    {
      title: "About",
      blurb: "Who makes The Roundup Games, how the puzzles and questions come together, and how to get in touch.",
      href: "about.html",
      cta: "Read about us →"
    }
  ];
  mount.innerHTML = "";
  cards.forEach(c => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.innerHTML = `
      <h2>${c.title}</h2>
      <p>${c.blurb}</p>
      <a class="btn" href="${c.href}">${c.cta}</a>
    `;
    mount.appendChild(card);
  });
}

/* ---------- games page cards (games.html only) ----------
   Two separate grids — one for the recurring/scheduled games
   ("dailyGameCards"), one for the always-available persistent games
   ("persistentGameCards") — split by each GAMES entry's `category`,
   with a divider between them in the markup so it's unambiguous
   which games change day-to-day and which are the same every time. */
function renderGameCards(){
  const dailyMount = document.getElementById("dailyGameCards");
  const persistentMount = document.getElementById("persistentGameCards");
  if (!dailyMount && !persistentMount) return;
  if (dailyMount) dailyMount.innerHTML = "";
  if (persistentMount) persistentMount.innerHTML = "";

  GAMES.forEach(game => {
    const mount = game.category === "persistent" ? persistentMount : dailyMount;
    if (!mount) return;
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
  wrap.dataset.statsStreakEligible = "true"; // this always renders the CURRENT edition, never archive
  if (!data.crossword || !data.crossword.embedUrl || data.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL has been set for this edition yet.</div>`;
    return;
  }
  wrap.innerHTML = `<iframe src="${data.crossword.embedUrl}" title="Daily crossword — ${dateLabel || ""}" loading="lazy"></iframe>`;
}

/* ---------- word search embed ----------
   Same shape as renderCrossword above, just for Weekly Word Search's
   own `data.wordSearch.embedUrl` field instead of `data.crossword` —
   kept as its own function (rather than a shared/parameterized one)
   so each stays simple to read on its own. */
function renderWordSearch(mountId, dateId, data, dateLabel){
  const dateEl = document.getElementById(dateId);
  if (dateEl) dateEl.textContent = dateLabel || "";
  const wrap = document.getElementById(mountId);
  if (!wrap) return;
  if (data.isoDate) wrap.dataset.statsWinId = data.isoDate;
  wrap.dataset.statsStreakEligible = "true"; // this always renders the CURRENT edition, never archive
  if (!data.wordSearch || !data.wordSearch.embedUrl || data.wordSearch.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No word search embed URL has been set for this edition yet.</div>`;
    return;
  }
  wrap.innerHTML = `<iframe src="${data.wordSearch.embedUrl}" title="Weekly word search — ${dateLabel || ""}" loading="lazy"></iframe>`;
}

/* ---------- bug report / contact form embed (report-bug.html only) --
   Reads BUG_REPORT_FORM_URL/BUG_REPORT_FORM_LINK above rather than
   taking them as arguments — unlike the puzzle embeds, there's only
   ever one of these, so there's no per-call data to pass in. The
   same form doubles as the general contact form for the editors. */
function renderBugReportForm(){
  const wrap = document.getElementById("bugReportFrameWrap");
  const noteEl = document.getElementById("bugReportFallbackNote");
  if (wrap) {
    if (!BUG_REPORT_FORM_URL) {
      wrap.innerHTML = `<div class="crossword-fallback">The bug report / contact form hasn't been set up yet.</div>`;
    } else {
      wrap.innerHTML = `<iframe src="${BUG_REPORT_FORM_URL}" title="Bug report / contact form" loading="lazy">Loading…</iframe>`;
    }
  }
  if (noteEl) {
    noteEl.innerHTML = BUG_REPORT_FORM_LINK
      ? `If the embed above isn't working, you can also visit the form at <a href="${BUG_REPORT_FORM_LINK}" target="_blank" rel="noopener">${BUG_REPORT_FORM_LINK}</a>`
      : "";
  }
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
   streak calculations regardless of AmuseLabs' internal id.

   Not every puzzle type sends the same completion signal, though —
   confirmed against AmuseLabs' own iframe-communication docs after a
   Word Flower Special Edition win wasn't getting credited:
     - Crosswords (and, per AmuseLabs' docs, puzzle types generally)
       send one PUZZLE_COMPLETE message with completedCorrectly: true.
     - Word Flower (embedUrl path /pmm/wordf, as used by at least one
       Special Edition entry) never sends PUZZLE_COMPLETE at all — it
       only sends PUZZLE_PROGRESS as each word is found, with
       wordsFound/totalWords counts and no separate "done" event. For
       that type, finding every word (wordsFound >= totalWords) IS
       the completion signal.
   Any future embed type that also turns out not to send
   PUZZLE_COMPLETE would need its own condition added here the same
   way. */
const AMUSELABS_ORIGIN = "https://puzzleme.amuselabs.com";

/* ---------- puzzle solve records (anti-cheese) ----------
   A crossword / word search / spelling-bee solve should only ever
   count ONCE per puzzle per browser — otherwise someone finishes,
   reads the answers, restarts, blitzes through, and posts a fake
   "fast" time. So the FIRST completion we see for a given puzzle is
   frozen in localStorage (its time included) and never touched
   again; later completions of the same puzzle are ignored for
   leaderboard purposes.

   Timing is measured on our side: the clock starts on the first
   PUZZLE_PROGRESS message for that puzzle (≈ when the solver starts
   working) and stops at completion. If a completion arrives with no
   prior progress in this page view (a replay of an already-solved
   puzzle), there's no fresh clock, so no time is recorded — but the
   freeze/solve still stands. */
const PUZZLE_SOLVE_KEY_PREFIX = "roundup:solved:";
const puzzleClocks = {};    // "category::winId" -> { startedAt } — set on first PUZZLE_PROGRESS (preferred)
const puzzleFirstSeen = {}; // "category::winId" -> ts of the first message of any kind — fallback start

function puzzleSolveRecord(category, winId){
  if (!category || !winId) return null;
  return loadGameState(PUZZLE_SOLVE_KEY_PREFIX + category + ":" + winId);
}
/* Writes the first-completion record once. Never overwrites an
   existing one (that's the whole anti-cheese point). Returns the
   record that now stands. */
function freezePuzzleSolve(category, winId, timeSeconds){
  const key = PUZZLE_SOLVE_KEY_PREFIX + category + ":" + winId;
  const existing = loadGameState(key);
  if (existing) return existing;
  const t = (typeof timeSeconds === "number" && isFinite(timeSeconds) && timeSeconds > 0)
    ? Math.round(timeSeconds * 100) / 100
    : null;
  const rec = { at: Date.now(), t: t };
  saveGameState(key, rec);
  return rec;
}
/* Best-effort: some AmuseLabs payloads carry an elapsed time. Prefer
   that over our own wall-clock when it's present and sane. */
function amuselabsPayloadSeconds(data){
  const candidates = [data.elapsedTime, data.secondsElapsed, data.solveTime, data.timeElapsed, data.time, data.timer];
  for (let i = 0; i < candidates.length; i++) {
    let v = candidates[i];
    if (typeof v !== "number" || !isFinite(v) || v <= 0) continue;
    if (v > 36000) v = v / 1000;          // looks like milliseconds
    if (v >= 1 && v <= 36000) return Math.round(v * 100) / 100;
  }
  return null;
}
function emitPuzzleSolved(category, winId, timeSeconds, streakEligible, firstTime){
  try {
    document.dispatchEvent(new CustomEvent("roundup:puzzlesolved", {
      detail: { category: category, winId: winId, timeSeconds: timeSeconds, streakEligible: streakEligible, firstTime: firstTime }
    }));
  } catch (e) { /* no-op */ }
}

function initPuzzleCompletionListener(){
  // Registers window.addEventListener immediately when this runs
  // (see the call site below, right after this function's own
  // definition — not gated behind DOMContentLoaded like the rest of
  // the site's init calls). window.addEventListener doesn't need the
  // DOM to be ready; only the querySelectorAll below does, and that
  // only ever runs once a message has actually arrived, by which
  // point the sending iframe is guaranteed to already exist. This
  // matters because a puzzle that's already been solved can replay
  // its entire message sequence (including the completion message)
  // within milliseconds of the iframe loading — waiting for
  // DOMContentLoaded to register the listener risked missing that
  // window entirely on a revisit.
  window.addEventListener("message", (event) => {
    if (event.origin !== AMUSELABS_ORIGIN) return;
    // AmuseLabs doesn't send event.data consistently — some messages
    // (e.g. the AMP "embed-size" ping) are a real object, but the
    // actual puzzle-player messages (PUZZLE_LOAD, PUZZLE_COMPLETE,
    // PUZZLE_PROGRESS, ...) arrive as a JSON *string* instead. Parse
    // it if so; this was silently swallowing every puzzle-player
    // message before (data.id on a string is always undefined, so
    // the guard below returned early every single time).
    let data = event.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (e) { return; }
    }
    if (!data || !data.id) return;

    // which puzzle on this page sent it (matches the AmuseLabs id
    // against each embed's iframe src, same as before)
    let category = null, winId = null, streakEligible = false, matched = false;
    document.querySelectorAll(".crossword-frame-wrap iframe").forEach(iframe => {
      if (iframe.src.indexOf(data.id) === -1) return;
      const wrap = iframe.closest(".crossword-frame-wrap");
      category = wrap && wrap.dataset.statsCategory;
      winId = wrap && wrap.dataset.statsWinId;
      streakEligible = !!(wrap && wrap.dataset.statsStreakEligible === "true");
      matched = true;
    });
    if (!matched || !category || !winId) return;

    const clockKey = category + "::" + winId;
    const alreadySolved = !!puzzleSolveRecord(category, winId);

    // remember the first time we hear ANYTHING about this puzzle in
    // this page view — the fallback solve-clock start if no
    // PUZZLE_PROGRESS ever arrives (some embed types are quiet until
    // completion)
    if (!alreadySolved && !puzzleFirstSeen[clockKey]) puzzleFirstSeen[clockKey] = Date.now();

    // the good clock: starts on the first sign of actual solving
    if (data.type === "PUZZLE_PROGRESS" && !alreadySolved && !puzzleClocks[clockKey]) {
      puzzleClocks[clockKey] = { startedAt: Date.now() };
    }

    const isCrosswordStyleComplete = data.type === "PUZZLE_COMPLETE" && data.completedCorrectly;
    const isWordFlowerComplete = data.type === "PUZZLE_PROGRESS"
      && typeof data.wordsFound === "number" && typeof data.totalWords === "number"
      && data.totalWords > 0 && data.wordsFound >= data.totalWords;
    if (!isCrosswordStyleComplete && !isWordFlowerComplete) return;

    recordWin(category, winId, streakEligible);

    // anti-cheese: only the FIRST completion is recorded/announced
    if (alreadySolved) return;
    const clk = puzzleClocks[clockKey];
    const payloadT = amuselabsPayloadSeconds(data);
    let wallT = null;
    if (clk) wallT = (Date.now() - clk.startedAt) / 1000;
    else if (puzzleFirstSeen[clockKey]) wallT = (Date.now() - puzzleFirstSeen[clockKey]) / 1000;
    const rec = freezePuzzleSolve(category, winId, payloadT != null ? payloadT : wallT);
    emitPuzzleSolved(category, winId, rec.t, streakEligible, true);
  });
}
initPuzzleCompletionListener();

/* ---------- puzzle message debugger ----------
   Built to track down why Weekly Word Search's win wasn't being
   credited (AmuseLabs doesn't publicly document what each puzzle
   type actually sends on completion — that debugging session is
   what found both the missing PUZZLE_PROGRESS/PUZZLE_COMPLETE
   handling for non-crossword types and the bigger issue: some
   AmuseLabs messages arrive as a JSON string instead of an object,
   see initPuzzleCompletionListener above). Kept around rather than
   deleted, since any future puzzle type (or AmuseLabs behavior
   change) could need the same kind of live inspection again.

   To use: open any page with a puzzle embed with ?debug=puzzle added
   to the URL (e.g. weekly-word-search.html?debug=puzzle), then play
   through it. A log panel appears at the bottom of the screen
   showing the raw contents of every message from AmuseLabs as it
   arrives. Does nothing on a normal visit — only activates with that
   query param present. */
if (location.search.indexOf("debug=puzzle") !== -1) {
  const puzzleDebugLog = [];
  window.addEventListener("message", (event) => {
    if (event.origin !== AMUSELABS_ORIGIN) return;
    puzzleDebugLog.push(`${new Date().toLocaleTimeString()}  ${JSON.stringify(event.data)}`);
    const panel = document.getElementById("puzzleDebugPanel");
    if (panel) panel.textContent = puzzleDebugLog.join("\n\n");
  });
  document.addEventListener("DOMContentLoaded", () => {
    const panel = document.createElement("pre");
    panel.id = "puzzleDebugPanel";
    panel.style.cssText = "position:fixed;bottom:0;left:0;right:0;max-height:40vh;overflow:auto;background:#111;color:#7CFC7C;font:11px/1.4 monospace;padding:10px;margin:0;white-space:pre-wrap;z-index:99999;border-top:2px solid #7CFC7C;";
    panel.textContent = "Listening for messages from " + AMUSELABS_ORIGIN + "... (play the puzzle)";
    document.body.appendChild(panel);
  });
}

/* ---------- special edition card (index.html + games.html) ----------
   Live: a large, prominent banner above the games grid. On the
   homepage this banner is the ONLY game shown; when nothing is live
   the homepage shows no game content at all.
   Not live: on games.html only, a normal card at the very bottom of
   the persistent games grid (right under Bronco Blitz), still
   linking to special-edition.html (which explains there's nothing
   live right now). The homepage has no such grid, so it simply
   shows nothing. */
function renderSpecialHomepageCard(){
  const bannerMount = document.getElementById("specialBanner");
  const gridMount = document.getElementById("persistentGameCards");

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
    clearGamePageCards();
    return;
  }

  if (titleEl) titleEl.textContent = SPECIAL_EDITION.theme;
  if (descEl) descEl.textContent = "A special one-off game, live for a limited time — enjoy it while it lasts.";
  if (headingEl) headingEl.textContent = "Play";
  if (dateEl) dateEl.textContent = withDifficulty(SPECIAL_EDITION.date, SPECIAL_EDITION.difficulty);
  renderSpecialEmbed("specialFrameWrap", SPECIAL_EDITION.embedUrl, `Special Edition — ${SPECIAL_EDITION.theme}`, SPECIAL_EDITION.startIsoDate);
  mountGamePageCards("specialEdition");
  if (typeof lbAttachPuzzlePage === "function") lbAttachPuzzlePage("specialEdition");
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
   (an embed re-firing its completion message, or the backfill below)
   never double counts.

   Win count and streak are tracked separately, because a win from
   the archive shouldn't retroactively patch a broken streak — you
   can't go back and un-miss a day. `stats[category]` holds every
   win (used for the total count); `stats.streakWins[category]` only
   holds wins that happened while that puzzle was still the current
   one (used for computeStreak). recordWin's `streakEligible` flag
   decides which puzzles count as "still current" when they were won
   — see initPuzzleCompletionListener and mountTeacherGame's callers.

   `streak` marks which categories get a streak at all — the daily/weekly
   games only, not the Print Edition Crossword, Special Edition, or the
   persistent games (none of those run on a regular enough recurring
   schedule for "consecutive" to mean anything).

   `trackWins` / `trackBestTime` / `trackPoints` / `trackBestScore`
   control what actually shows up on the Stats page for a category —
   most games track wins only, the persistent track/swim games
   (Bronco Dash, Bronco Splash) also (or only) track a fastest time,
   stored separately in stats.bestTimes, and the trivia game (Bronco
   Blitz) tracks both a lifetime point total (stats.points — every
   round played adds to this, see addPoints) and a single-round high
   score (stats.bestScores — only the best round ever, see
   recordBestScore), shown as two separate stats rather than one.

   `retired` marks the two retired games (Daily Crossword, Guess the
   Teacher). They stay in this list so archive play still records
   their wins / streaks through the same plumbing, but renderStatsPage
   filters them out so they no longer get a card on the Stats page. */
const STATS_STORAGE_KEY = "roundup:stats";
/* `blurb` / `challengeMetric` (live games only) feed the two cards
   that now sit under each game — see "PER-GAME SIDE CARDS" below.
   challengeMetric decides what a challenge link dares a friend to do:
     "score"  — beat a high score   (higher is better)  — Bronco Blitz
     "time"   — beat a fastest time  (lower is better)   — Dash / Splash
     "finish" — just "I solved it, your turn"            — the crosswords */
const STAT_GAMES = [
  { id: "miniCrossword", label: "Daily Crossword", retired: true, streak: true, streakUnit: "day", trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false },
  { id: "weeklyCrossword", label: "Weekly Crossword", streak: true, streakUnit: "week", trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false, blurb: "A bigger, themed crossword posted every school Monday.", challengeMetric: "finish" },
  { id: "weeklyWordSearch", label: "Weekly Word Search", streak: true, streakUnit: "week", trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false, blurb: "A themed word search posted every school Monday.", challengeMetric: "finish" },
  { id: "printCrossword", label: "Print Edition Crossword", streak: false, streakUnit: null, trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false, blurb: "The crossword from The Roundup's latest print issue.", challengeMetric: "finish" },
  { id: "guessTheTeacher", label: "Guess the Teacher", retired: true, streak: true, streakUnit: "day", trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false },
  { id: "specialEdition", label: "Special Edition", streak: false, streakUnit: null, trackWins: true, trackBestTime: false, trackPoints: false, trackBestScore: false, blurb: "A one-off puzzle for school breaks and special occasions.", challengeMetric: "finish" },
  { id: "broncoDash", label: "Bronco Dash", streak: false, streakUnit: null, trackWins: true, trackBestTime: true, trackPoints: false, trackBestScore: false, blurb: "Answer trivia to sprint down the track before the pace line catches you.", challengeMetric: "time" },
  { id: "broncoSplash", label: "Bronco Splash", streak: false, streakUnit: null, trackWins: false, trackBestTime: true, trackPoints: false, trackBestScore: false, blurb: "Answer trivia to catch your breath and swim a full lap.", challengeMetric: "time" },
  { id: "broncoBlitz", label: "Bronco Blitz", streak: false, streakUnit: null, trackWins: false, trackBestTime: false, trackPoints: true, trackBestScore: true, blurb: "Thirty seconds of A/B/C/D trivia — chain answers for a bigger multiplier.", challengeMetric: "score" }
];

function loadStats(){
  const raw = loadGameState(STATS_STORAGE_KEY);
  const stats = { streakWins: {}, bestTimes: {}, points: {}, bestScores: {} };
  STAT_GAMES.forEach(game => {
    stats[game.id] = (raw && Array.isArray(raw[game.id])) ? raw[game.id] : [];
    if (game.streak) {
      stats.streakWins[game.id] = (raw && raw.streakWins && Array.isArray(raw.streakWins[game.id])) ? raw.streakWins[game.id] : [];
    }
    if (game.trackBestTime) {
      stats.bestTimes[game.id] = (raw && raw.bestTimes && typeof raw.bestTimes[game.id] === "number") ? raw.bestTimes[game.id] : null;
    }
    if (game.trackPoints) {
      stats.points[game.id] = (raw && raw.points && typeof raw.points[game.id] === "number") ? raw.points[game.id] : 0;
    }
    if (game.trackBestScore) {
      stats.bestScores[game.id] = (raw && raw.bestScores && typeof raw.bestScores[game.id] === "number") ? raw.bestScores[game.id] : null;
    }
  });
  return stats;
}

/* ---------- stat-change / round-complete events ----------
   The per-game stats card and the incoming-challenge banner (see
   "PER-GAME SIDE CARDS" below) react to these instead of polling.
     roundup:statschange  { category, changes: ["wins","streak",...] }
       — a stored number for `category` just went up; `changes` lists
         which stat keys (matches statRowsFor's keys) so the card can
         pop just those rows.
     roundup:roundcomplete { category, result: { won, score, timeSeconds } }
       — a single playthrough just ended. Fired by the Bronco engines
         and by recordWin (first win only). This is also the seam the
         leaderboard hooks onto to offer "submit this run." */
function emitStatsChange(category, changes){
  if (!changes || !changes.length) return;
  try {
    document.dispatchEvent(new CustomEvent("roundup:statschange", { detail: { category, changes } }));
  } catch (e) { /* CustomEvent unsupported — cards just won't animate */ }
}
function emitRoundComplete(category, result){
  try {
    document.dispatchEvent(new CustomEvent("roundup:roundcomplete", { detail: { category, result: result || {} } }));
  } catch (e) { /* no-op */ }
}

/* Records a new time (in seconds) for a persistent game, keeping
   only the fastest one ever seen. Returns true if this was a new
   best (so the finish screen can say so), false otherwise. */
function recordBestTime(category, seconds){
  const game = STAT_GAMES.find(g => g.id === category);
  if (!game || !game.trackBestTime || typeof seconds !== "number" || !isFinite(seconds)) return false;

  const stats = loadStats();
  const current = stats.bestTimes[category];
  const isNewBest = current === null || seconds < current;
  if (isNewBest) {
    stats.bestTimes[category] = seconds;
    saveGameState(STATS_STORAGE_KEY, stats);
    emitStatsChange(category, ["bestTime"]);
  }
  return isNewBest;
}

function getBestTime(category){
  return loadStats().bestTimes[category];
}

/* Adds `amount` to a category's lifetime point total (every round
   played adds to the running total, unlike recordBestTime above
   which only keeps the single best value) and returns the new
   total. */
function addPoints(category, amount){
  const game = STAT_GAMES.find(g => g.id === category);
  if (!game || !game.trackPoints || typeof amount !== "number" || !isFinite(amount)) return null;

  const stats = loadStats();
  const added = Math.max(0, Math.round(amount));
  stats.points[category] = (stats.points[category] || 0) + added;
  saveGameState(STATS_STORAGE_KEY, stats);
  if (added > 0) emitStatsChange(category, ["points"]);
  return stats.points[category];
}

function getPoints(category){
  return loadStats().points[category] || 0;
}

/* Records a single round's score for a category, keeping only the
   highest one ever seen (unlike addPoints above, which accumulates
   every round instead of just the best). Returns true if this was a
   new best (so the finish screen can say so), false otherwise. */
function recordBestScore(category, score){
  const game = STAT_GAMES.find(g => g.id === category);
  if (!game || !game.trackBestScore || typeof score !== "number" || !isFinite(score)) return false;

  const stats = loadStats();
  const current = stats.bestScores[category];
  const isNewBest = current === null || score > current;
  if (isNewBest) {
    stats.bestScores[category] = score;
    saveGameState(STATS_STORAGE_KEY, stats);
    emitStatsChange(category, ["bestScore"]);
  }
  return isNewBest;
}

function getBestScore(category){
  return loadStats().bestScores[category];
}

/* 83.4 -> "1:23.4" */
function formatTime(seconds){
  if (typeof seconds !== "number" || !isFinite(seconds)) return null;
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  return `${m}:${s.padStart(4, "0")}`;
}

function recordWin(category, winId, streakEligible){
  if (!winId || !STAT_GAMES.some(game => game.id === category)) return;
  const stats = loadStats();
  let changed = false;
  const changes = [];

  if (!stats[category].includes(winId)) {
    stats[category].push(winId);
    changed = true;
    changes.push("wins");
  }
  if (streakEligible && stats.streakWins[category] && !stats.streakWins[category].includes(winId)) {
    stats.streakWins[category].push(winId);
    changed = true;
    changes.push("streak");
  }

  if (changed) {
    saveGameState(STATS_STORAGE_KEY, stats);
    emitStatsChange(category, changes);
    emitRoundComplete(category, { won: true });
  }
}

function getWinCount(category){
  return loadStats()[category].length;
}

/* the published-puzzle list a category's streak is checked against,
   each as { isoDate, label } and already limited to puzzles whose
   date has actually arrived (no crediting the future) */
function getPublishedEntries(category){
  const todayIso = getTodayIsoDate();
  // weeklyCrossword and weeklyWordSearch both run off the same
  // WEEKLY_PUZZLES schedule (they're two separate games, but always
  // published together per week), so they share this branch.
  if (category === "weeklyCrossword" || category === "weeklyWordSearch") {
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

  const wins = loadStats().streakWins[category];
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

/* ---------- recovering wins recorded before this feature existed ----------
   Guess the Teacher already stored win/lose state per puzzle in
   localStorage long before stats existed (see mountTeacherGame), so
   any past win is still sitting there and can be recovered
   automatically — no self-reporting involved. This runs once on
   every page load; it's cheap and recordWin's de-dup makes it safe
   to repeat.

   (Crossword-type embeds — Mini/Weekly/Special — have no equivalent:
   they only tell us about a completion at the moment it happens via
   postMessage, with no record of a solve from before this feature
   shipped, and no documented way to ask AmuseLabs "was this already
   solved previously." There's deliberately no self-report option for
   those — see the conversation that removed it.)

   Eligibility for streaks follows the same today-vs-archive rule as
   live completions: a "today::" key means it was won while it was
   still the current puzzle, so it counts toward the streak; an
   "archive::" key means it was won after the fact, so it only counts
   toward the total. */
function backfillGuessTheTeacherWins(){
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key.indexOf("roundup:teacher:") !== 0) continue;
      const state = loadGameState(key);
      if (!state || !state.won) continue;

      const suffix = key.slice("roundup:teacher:".length);
      let isoDate = null;
      let streakEligible = false;
      if (suffix.indexOf("archive::") === 0) {
        isoDate = suffix.slice("archive::".length);
      } else if (suffix.indexOf("today::") === 0) {
        const dateLabel = suffix.slice("today::".length);
        const match = DAILY_PUZZLES.find(entry => entry.date === dateLabel);
        if (match) isoDate = match.isoDate;
        streakEligible = true;
      }
      if (isoDate) recordWin("guessTheTeacher", isoDate, streakEligible);
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

/* ---------- Guess the Teacher widget factory ----------
   `storageKey` should be a short unique string for this specific
   puzzle (e.g. today's date, or an archive entry's date) — it's
   what remembers a player's guesses across a reload, and what
   makes a *new* puzzle (a new storageKey) start fresh. `winId`
   should be that same puzzle's isoDate — kept separate from
   storageKey since it's what stats/streaks are recorded against,
   and needs to stay stable and isoDate-shaped regardless of how
   storageKey is formatted. `streakEligible` should be true only when
   this is today's puzzle (not an archived one) — winning it counts
   toward the total either way, but only a same-day win extends the
   streak; going back and solving an old one can't retroactively fix
   a day you missed. */
function mountTeacherGame(container, data, storageKey, winId, streakEligible){
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
      if (state.won && winId) recordWin("guessTheTeacher", winId, streakEligible);
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

/* Small optional "Theme: X" line for Weekly Crossword / Weekly Word
   Search — shown only on that game's own page (live or Archive
   detail), never on the homepage card, unlike Special Edition where
   the theme IS the homepage banner. Returns "" (renders nothing)
   when no theme is set for that week. */
function themeLineHtml(theme){
  return theme ? `<p class="hero__theme">Theme: <strong>${escapeHtml(theme)}</strong></p>` : "";
}

function renderMiniCrosswordArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Daily Crossword</h2>
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
    wrap.innerHTML = `<iframe src="${entry.crossword.embedUrl}" title="Daily Crossword — ${entry.date}" loading="lazy"></iframe>`;
  }

  mountTeacherGame(document.getElementById("archiveTeacherMount"), entry, `archive::${entry.isoDate}`, entry.isoDate, false);
}

function renderWeeklyCrosswordArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Weekly Crossword</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.crossword && entry.crossword.difficulty)}</span>
      </div>
      <div class="panel__body">
        ${themeLineHtml(entry.crossword && entry.crossword.theme)}
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

function renderWeeklyWordSearchArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Weekly Word Search</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.wordSearch && entry.wordSearch.difficulty)}</span>
      </div>
      <div class="panel__body">
        ${themeLineHtml(entry.wordSearch && entry.wordSearch.theme)}
        <div class="crossword-frame-wrap" id="weeklyWordSearchArchiveWrap" data-stats-category="weeklyWordSearch" data-stats-win-id="${entry.isoDate}"></div>
      </div>
    </div>
  `;

  const wrap = document.getElementById("weeklyWordSearchArchiveWrap");
  if (!entry.wordSearch || !entry.wordSearch.embedUrl || entry.wordSearch.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No word search embed URL was saved for this edition.</div>`;
  } else {
    wrap.innerHTML = `<iframe src="${entry.wordSearch.embedUrl}" title="Weekly Word Search — ${entry.date}" loading="lazy"></iframe>`;
  }
}

function renderPrintEditionArchiveDetail(entry, detailEl){
  detailEl.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <h2>Print Edition Crossword</h2>
        <span class="panel__date">${withDifficulty(entry.date, entry.crossword && entry.crossword.difficulty)}</span>
      </div>
      <div class="panel__body">
        ${themeLineHtml(entry.crossword && entry.crossword.theme)}
        <div class="crossword-frame-wrap" id="printArchiveCrosswordWrap" data-stats-category="printCrossword" data-stats-win-id="${entry.isoDate}"></div>
      </div>
    </div>
  `;

  const wrap = document.getElementById("printArchiveCrosswordWrap");
  if (!entry.crossword || !entry.crossword.embedUrl || entry.crossword.embedUrl.includes("REPLACE")) {
    wrap.innerHTML = `<div class="crossword-fallback">No crossword embed URL was saved for this edition.</div>`;
  } else {
    wrap.innerHTML = `<iframe src="${entry.crossword.embedUrl}" title="Print Edition Crossword — ${entry.date}" loading="lazy"></iframe>`;
  }
}

function renderArchive(){
  renderArchiveSection(
    "archiveList", DAILY_ARCHIVE, renderMiniCrosswordArchiveDetail,
    entry => entry.date
  );
}

function renderPrintArchive(){
  renderArchiveSection(
    "printArchiveList", PRINT_ARCHIVE, renderPrintEditionArchiveDetail,
    entry => entry.date
  );
}

function renderWeeklyArchive(){
  renderArchiveSection(
    "weeklyArchiveList", WEEKLY_ARCHIVE, renderWeeklyCrosswordArchiveDetail,
    entry => entry.date
  );
}

function renderWeeklyWordSearchArchive(){
  renderArchiveSection(
    "weeklyWordSearchArchiveList", WEEKLY_ARCHIVE, renderWeeklyWordSearchArchiveDetail,
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

/* The stat rows that apply to one game, in display order, as
   { key, label, value }. `key` matches the strings emitStatsChange
   uses ("wins" / "streak" / "bestTime" / "bestScore" / "points") so
   a card can pop just the row that changed. Shared by the Stats page
   and by the per-game "Your Stats" card under each game. */
function statRowsFor(gameId){
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) return [];
  const rows = [];

  if (game.trackWins) {
    rows.push({ key: "wins", label: "Wins", value: `${getWinCount(game.id)}` });
  }

  const streak = computeStreak(game.id);
  if (streak !== null) {
    rows.push({ key: "streak", label: "Streak", value: `${streak} ${game.streakUnit}${streak === 1 ? "" : "s"}` });
  }

  if (game.trackBestTime) {
    const best = getBestTime(game.id);
    rows.push({ key: "bestTime", label: "Fastest", value: best === null ? "—" : formatTime(best) });
  }

  if (game.trackBestScore) {
    const best = getBestScore(game.id);
    rows.push({ key: "bestScore", label: "High Score", value: best === null ? "—" : best.toLocaleString() });
  }

  if (game.trackPoints) {
    rows.push({ key: "points", label: "Lifetime Total", value: `${getPoints(game.id).toLocaleString()} pts` });
  }

  return rows;
}

/* ---------- stats page (stats.html only) ----------
   One card per non-retired game (STAT_GAMES entry without `retired`),
   each listing only the stats that apply to it (see statRowsFor) —
   a crossword-type game shows Wins/Streak, a persistent race/swim
   game shows Wins (if tracked) and Fastest time, and Bronco Blitz
   shows High Score and Lifetime Total as two separate lines. */
function renderStatsPage(){
  const mount = document.getElementById("statsList");
  if (!mount) return;

  mount.innerHTML = STAT_GAMES.filter(game => !game.retired).map(game => {
    const rows = statRowsFor(game.id);
    return `
      <article class="stat-card">
        <h2>${game.label}</h2>
        <ul class="stat-card__list">
          ${rows.map(s => `
            <li>
              <span class="stat-card__label">${s.label}</span>
              <span class="stat-card__value">${s.value}</span>
            </li>
          `).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

/* ================================================================
   PER-GAME SIDE CARDS + CHALLENGE LINKS
   ----------------------------------------------------------------
   Every game page (weekly-crossword / weekly-word-search /
   print-edition / special-edition / bronco-dash / bronco-splash /
   bronco-blitz) drops two cards in under the game, side by side:

     • "Your Stats"        — the same numbers as that game's card on
                             stats.html, but right here, and each row
                             pops when it goes up mid-visit (fed by
                             the roundup:statschange event).
     • "Challenge a Friend" — a ready-to-paste blurb + a link that
                             drops a friend straight into this game
                             with your score to beat (?ch=1&…).

   A page opts in with one call: mountGamePageCards("broncoBlitz").
   It expects three mount points in the markup:
     #challengeBannerMount  (above the game — shows an INCOMING
                             challenge when the page is opened via a
                             ?ch=1 link)
     #gameStatsCardMount / #gameShareCardMount  (the two cards)

   The player's name for the links is stored once in localStorage
   under roundup:identity — the SAME record the leaderboard sign-in
   on stats.html uses, so setting it in either place covers both.
   ================================================================ */

const IDENTITY_STORAGE_KEY = "roundup:identity";

/* { name, lastInitial, grade } — `grade` holds a 2-digit graduation
   year ("27".."33"), shown as "’27"; any field may be "". */
function loadIdentity(){
  const raw = loadGameState(IDENTITY_STORAGE_KEY);
  if (!raw || typeof raw !== "object") return { name: "", lastInitial: "", grade: "" };
  return {
    name: typeof raw.name === "string" ? raw.name : "",
    lastInitial: typeof raw.lastInitial === "string" ? raw.lastInitial : "",
    grade: typeof raw.grade === "string" ? raw.grade : ""
  };
}
function saveIdentity(identity){
  saveGameState(IDENTITY_STORAGE_KEY, {
    name: (identity.name || "").trim().slice(0, 20),
    lastInitial: (identity.lastInitial || "").trim().slice(0, 1).toUpperCase(),
    grade: (function(g){
      const d = String(g || "").replace(/[^0-9]/g, "");   // "'27" / "27" / "2027" -> "27"
      return d.length === 4 ? d.slice(2) : d.slice(0, 2);
    })(identity.grade)
  });
}
/* "Carter K." / "Carter" / "" — name + last initial, no grade
   (kept short since it also goes in the challenge URL's ?by=). */
function formatIdentity(id){
  id = id || loadIdentity();
  if (!id.name) return "";
  return id.lastInitial ? `${id.name} ${id.lastInitial}.` : id.name;
}
/* Three quick prompts. The leaderboard page gets a real form later;
   this is just enough to personalize a challenge link. */
function openIdentityPrompt(onDone){
  const cur = loadIdentity();
  const name = window.prompt("First name — shown on your challenge links (and, later, the leaderboard):", cur.name || "");
  if (name === null) return;
  const lastInitial = window.prompt("Last initial (one letter):", cur.lastInitial || "");
  if (lastInitial === null) return;
  const grade = window.prompt("Grad year — 27 to 33 (optional; e.g. 27 for the class of 2027):", cur.grade || "");
  if (grade === null) return;
  saveIdentity({ name: name, lastInitial: lastInitial, grade: grade });
  if (typeof onDone === "function") onDone();
}

function copyText(text){
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  } catch (e) {
    return Promise.resolve(false);
  }
}
/* Flip a copy button to "Copied!" for 3s, then restore its label. */
function flashCopied(btn){
  if (btn._copyReset) clearTimeout(btn._copyReset);
  else btn.dataset.copyLabel = btn.textContent;
  btn.textContent = "Copied!";
  btn.classList.add("is-copied");
  btn._copyReset = setTimeout(() => {
    btn.textContent = btn.dataset.copyLabel;
    btn.classList.remove("is-copied");
    btn._copyReset = null;
  }, 3000);
}

/* This page's own URL with any existing query/hash stripped — the
   base a challenge link is built on, so links keep working wherever
   the site is hosted (github.io directly, or framed on the SNO site). */
function gameBaseUrl(){
  return location.origin + location.pathname;
}
/* Tiny "?a=1&b=2" reader — avoids depending on URLSearchParams,
   keeping to the same very-plain JS as the rest of the file. */
function readQueryParam(name){
  const q = (location.search || "").replace(/^\?/, "");
  if (!q) return null;
  const parts = q.split("&");
  for (let i = 0; i < parts.length; i++) {
    const eq = parts[i].indexOf("=");
    const key = eq === -1 ? parts[i] : parts[i].slice(0, eq);
    if (decodeURIComponent(key) !== name) continue;
    const val = eq === -1 ? "" : parts[i].slice(eq + 1);
    try { return decodeURIComponent(val.replace(/\+/g, " ")); }
    catch (e) { return val; }
  }
  return null;
}
/* The number a challenge dares a friend to beat: the player's own
   best. null for "finish" games (nothing numeric to beat). */
function currentChallengeBeat(gameId){
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) return null;
  if (game.challengeMetric === "score") return getBestScore(gameId);
  if (game.challengeMetric === "time") return getBestTime(gameId);
  return null;
}
function buildChallengeUrl(gameId){
  const game = STAT_GAMES.find(g => g.id === gameId);
  const metric = game ? (game.challengeMetric || "finish") : "finish";
  const pairs = [["ch", "1"], ["kind", metric]];
  const by = formatIdentity();
  if (by) pairs.push(["by", by]);
  const beat = currentChallengeBeat(gameId);
  if (typeof beat === "number" && isFinite(beat)) {
    pairs.push(["beat", metric === "time" ? beat.toFixed(2) : String(Math.round(beat))]);
  }
  const query = pairs.map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`).join("&");
  return `${gameBaseUrl()}?${query}`;
}

/* ---------- "play the exact same set" links ----------
   Separate from the challenge link above: this one carries NO score,
   NO taunt — it just drops a friend into the identical game so you
   two can compare fairly.

   For the Bronco games (a random draw from the shared question
   pool), "same set" means the same questions in the same order, so
   the link carries a seed (?set=SEED) that the game feeds into its
   seeded RNG. For the crossword / word search / Special Edition
   games everyone already plays the exact same puzzle that week, so
   the link is just the plain game URL. */
function gameUsesSeededSet(gameId){
  return gameId === "broncoDash" || gameId === "broncoSplash" || gameId === "broncoBlitz";
}
/* ONE seed per page view: the ?set= the page was opened with, or —
   on a fresh visit to a seeded game — a random one minted once and
   reused. So the run the player is actually playing (sameSetRng
   below feeds this into createQuestionQueue) and the "same set" link
   in the share card are always the same seed, even the very first
   time on a plain URL. */
let _sessionSetSeed = null;
function currentSetSeed(){
  const fromUrl = readQueryParam("set");
  if (fromUrl) return fromUrl;
  if (!_sessionSetSeed) _sessionSetSeed = randomSetSeed();
  return _sessionSetSeed;
}
function buildSameSetUrl(gameId){
  if (!gameUsesSeededSet(gameId)) return gameBaseUrl();
  return `${gameBaseUrl()}?set=${encodeURIComponent(currentSetSeed())}`;
}

/* The paste-anywhere blurb shown in the Challenge card. Plain text
   on purpose — reads fine in a group chat, no emoji to clash with
   the paper's look. */
function shareBlurbFor(gameId){
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) return "";
  const who = formatIdentity();
  const numbers = statRowsFor(gameId).map(r => `${r.label} ${r.value}`).join(" · ");
  const beat = currentChallengeBeat(gameId);
  const lead = who ? `${who} — ${game.label}, The Roundup Games` : `${game.label} — The Roundup Games`;

  let taunt;
  if (game.challengeMetric === "score") {
    taunt = (typeof beat === "number") ? `Beat my high score of ${beat.toLocaleString()}:` : "Think you can out-score me?";
  } else if (game.challengeMetric === "time") {
    taunt = (typeof beat === "number") ? `Beat my time of ${formatTime(beat)}:` : "Think you're faster?";
  } else {
    taunt = "I finished this one — your turn:";
  }

  return `${lead}\n${numbers}\n${taunt}\n${buildChallengeUrl(gameId)}`;
}

/* "Your Stats" card. Re-renders and pops the changed row(s) whenever
   roundup:statschange fires for this game. */
function renderGameStatsCard(mountId, gameId){
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) { mount.innerHTML = ""; return; }

  function draw(bumpKeys){
    const rows = statRowsFor(gameId);
    mount.innerHTML = `
      <article class="sidecard sidecard--stats">
        <div class="sidecard__eyebrow">Your Stats</div>
        <h2 class="sidecard__title">${escapeHtml(game.label)}</h2>
        <ul class="stat-card__list">
          ${rows.map(s => `
            <li data-stat-key="${s.key}">
              <span class="stat-card__label">${s.label}</span>
              <span class="stat-card__value">${s.value}</span>
            </li>
          `).join("")}
        </ul>
        <a class="sidecard__link" href="stats.html">All your stats &rarr;</a>
      </article>
    `;

    if (bumpKeys && bumpKeys.length) {
      const card = mount.querySelector(".sidecard--stats");
      if (card) {
        card.classList.remove("is-celebrating");
        void card.offsetWidth;             // restart the animation
        card.classList.add("is-celebrating");
        card.addEventListener("animationend", () => card.classList.remove("is-celebrating"), { once: true });
      }
      bumpKeys.forEach(key => {
        const li = mount.querySelector(`[data-stat-key="${key}"]`);
        if (!li) return;
        void li.offsetWidth;
        li.classList.add("is-bumped");
        li.addEventListener("animationend", () => li.classList.remove("is-bumped"), { once: true });
      });
    }
  }

  draw(null);
  document.addEventListener("roundup:statschange", (e) => {
    if (!e.detail || e.detail.category !== gameId) return;
    draw(e.detail.changes || []);
  });
}

/* "Share This Game" card — two clearly separated options:
     1. Play the same set  — identical game, NOTHING about your score
        goes with it. (For Bronco games this is a seeded ?set= link;
        for the puzzles it's just the puzzle link.)
     2. Challenge          — the same link plus your score to beat. */
function renderGameShareCard(mountId, gameId){
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) { mount.innerHTML = ""; return; }

  const seeded = gameUsesSeededSet(gameId);
  const sameSetWhat = seeded ? "same questions, same order" : "the same puzzle";

  function draw(){
    const id = loadIdentity();
    const who = formatIdentity(id);
    const sameSetLink = buildSameSetUrl(gameId);   // bare URL — nothing else
    const challengeText = shareBlurbFor(gameId);
    const challengeUrl = buildChallengeUrl(gameId);

    mount.innerHTML = `
      <article class="sidecard sidecard--share">
        <div class="sidecard__eyebrow">Share This Game</div>
        <h2 class="sidecard__title">${escapeHtml(game.label)}</h2>
        <p class="sidecard__blurb">${escapeHtml(game.blurb || "")}</p>
        <p class="sidecard__who">
          ${
            who
              ? `Playing as <strong>${escapeHtml(who)}</strong>${id.grade ? ` &middot; &rsquo;${escapeHtml(id.grade)}` : ""}`
              : `<em>No name set &mdash; your links will just say &ldquo;a friend.&rdquo;</em>`
          }
          <button type="button" class="sidecard__editname" data-act="edit">${who ? "Edit" : "Set a name"}</button>
        </p>

        <div class="sharegroup">
          <div class="sharegroup__label">Play the same set</div>
          <p class="sharegroup__note">Sends a friend into ${escapeHtml(seeded ? "this exact game" : "this exact puzzle")} — <strong>${escapeHtml(sameSetWhat)}</strong>, with <strong>nothing about your score attached</strong>. Just so you can compare fairly. The copied link is just the URL, nothing else.</p>
          <textarea id="${mountId}SameSet" class="sidecard__text" rows="2" readonly>${escapeHtml(sameSetLink)}</textarea>
          <div class="sidecard__actions">
            <button type="button" class="btn" data-act="copy-sameset">Copy same-set link</button>
            <button type="button" class="btn btn--ghost" data-act="share-sameset"${navigator.share ? "" : " hidden"}>Share&hellip;</button>
          </div>
        </div>

        <div class="sharegroup">
          <div class="sharegroup__label">Challenge them</div>
          <p class="sharegroup__note">${escapeHtml(
            game.challengeMetric === "score" ? "Same link, plus your high score to beat."
            : game.challengeMetric === "time" ? "Same link, plus your best time to beat."
            : "Same link, plus a note that you already finished it."
          )}</p>
          <textarea id="${mountId}Challenge" class="sidecard__text" rows="4" readonly>${escapeHtml(challengeText)}</textarea>
          <div class="sidecard__actions">
            <button type="button" class="btn" data-act="copy-challenge">Copy challenge</button>
            <button type="button" class="btn btn--ghost" data-act="share-challenge"${navigator.share ? "" : " hidden"}>Share&hellip;</button>
          </div>
        </div>

        <p class="sidecard__hint" data-role="hint" hidden></p>
      </article>
    `;

    const hintEl = mount.querySelector('[data-role="hint"]');
    function hint(msg){ if (hintEl) { hintEl.textContent = msg; hintEl.hidden = false; } }

    mount.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "copy-sameset") {
          copyText(sameSetLink).then(ok => ok ? flashCopied(btn) : hint("Couldn’t copy automatically — select the text and copy it."));
        } else if (act === "copy-challenge") {
          copyText(challengeText).then(ok => ok ? flashCopied(btn) : hint("Couldn’t copy automatically — select the text and copy it."));
        } else if (act === "share-sameset" && navigator.share) {
          navigator.share({ url: sameSetLink }).catch(() => {});
        } else if (act === "share-challenge" && navigator.share) {
          navigator.share({ text: challengeText, url: challengeUrl }).catch(() => {});
        } else if (act === "edit") {
          openIdentityPrompt(() => draw());
        }
      });
    });
  }

  draw();
  // a new best changes the "score to beat" baked into the challenge blurb/link
  document.addEventListener("roundup:statschange", (e) => {
    if (!e.detail || e.detail.category !== gameId) return;
    draw();
  });
}

/* Incoming-challenge banner. Only shows when the page was opened via
   a ?ch=1 link; then watches roundup:roundcomplete to tell the
   player whether they answered it. */
function renderChallengeBanner(gameId){
  const mount = document.getElementById("challengeBannerMount");
  if (!mount) return;
  if (readQueryParam("ch") !== "1") { mount.innerHTML = ""; return; }
  const game = STAT_GAMES.find(g => g.id === gameId);
  if (!game) { mount.innerHTML = ""; return; }

  const by = (readQueryParam("by") || "A friend").slice(0, 40);
  const kind = readQueryParam("kind") || game.challengeMetric || "finish";
  const beatRaw = readQueryParam("beat");
  const beat = beatRaw !== null ? parseFloat(beatRaw) : null;
  const haveBeat = beat !== null && isFinite(beat);

  let target;
  if (kind === "score" && haveBeat) target = `Beat their high score: <strong>${Math.round(beat).toLocaleString()}</strong>.`;
  else if (kind === "time" && haveBeat) target = `Beat their time: <strong>${formatTime(beat)}</strong>.`;
  else target = "Finish it to answer the challenge.";

  mount.innerHTML = `
    <div class="challenge-banner" role="status">
      <div class="challenge-banner__body">
        <span class="challenge-banner__tag">Challenge</span>
        <p><strong>${escapeHtml(by)}</strong> challenged you on ${escapeHtml(game.label)}. ${target}</p>
        <p class="challenge-banner__result" data-role="result" hidden></p>
      </div>
      <button type="button" class="challenge-banner__dismiss" aria-label="Dismiss">&times;</button>
    </div>
  `;
  mount.querySelector(".challenge-banner__dismiss").addEventListener("click", () => { mount.innerHTML = ""; });

  const resultEl = mount.querySelector('[data-role="result"]');
  document.addEventListener("roundup:roundcomplete", (e) => {
    if (!e.detail || e.detail.category !== gameId || !resultEl) return;
    const r = e.detail.result || {};
    let msg = null;
    if (kind === "score" && haveBeat && typeof r.score === "number") {
      msg = r.score >= beat
        ? `You scored ${r.score.toLocaleString()} — challenge beaten. Fire one back below.`
        : `You scored ${r.score.toLocaleString()} — ${(Math.round(beat) - r.score).toLocaleString()} short. Run it again?`;
    } else if (kind === "time" && haveBeat && typeof r.timeSeconds === "number") {
      msg = r.timeSeconds <= beat
        ? `You finished in ${formatTime(r.timeSeconds)} — challenge beaten. Fire one back below.`
        : `You finished in ${formatTime(r.timeSeconds)} — their ${formatTime(beat)} still stands. Run it again?`;
    } else if (kind === "finish" && r.won) {
      msg = "You finished it — challenge answered. Fire one back below.";
    }
    if (msg) { resultEl.textContent = msg; resultEl.hidden = false; }
  });
}

/* One call per game page — see the block comment above for the
   markup it expects. */
function mountGamePageCards(gameId){
  renderChallengeBanner(gameId);
  renderGameStatsCard("gameStatsCardMount", gameId);
  renderGameShareCard("gameShareCardMount", gameId);
}
/* special-edition.html calls this in both states so the cards don't
   linger when nothing's live. */
function clearGamePageCards(){
  ["challengeBannerMount", "gameStatsCardMount", "gameShareCardMount", "weeklyTop10Mount", "leaderboardSubmitMount"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

/* ================================================================
   PERSISTENT GAME ENGINE (Bronco Dash / Bronco Splash / Bronco Blitz)
   ----------------------------------------------------------------
   Shared helpers used by the games below — createQuestionQueue and
   escapeHtml are used by all three; the marker/bar/scroll-drift
   helpers are specific to Dash and Splash's track/pool visuals, since
   Blitz has no stage of its own, just a running score and a clock.
   ================================================================ */

/* A seeded pseudo-random function (0..1), same shape as Math.random.
   Same seed string → same stream forever. Used so a "play the same
   set" challenge link (?set=…) hands a friend the EXACT question
   order the sender got. Plain mulberry32 over a cheap string hash —
   not cryptographic, just needs to be stable and well-spread. */
function makeSeededRandom(seedStr){
  let h = 1779033703 ^ String(seedStr).length;
  for (let i = 0; i < String(seedStr).length; i++) {
    h = Math.imul(h ^ String(seedStr).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* A short random seed for a fresh "same set" link. */
function randomSetSeed(){
  return Math.random().toString(36).slice(2, 8);
}

function shuffleArray(arr, rng){
  const rand = typeof rng === "function" ? rng : Math.random;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Returns a shuffled view of a question's answer choices — a new
   array in random order, plus which position in that new order now
   holds the correct answer — without touching the question object
   itself. That object is a shared reference reused every time this
   same question comes up again in the draw queue (and the queue
   reshuffles and repeats indefinitely, see createQuestionQueue
   below), so mutating its `choices`/`correctIndex` in place would
   leak this shuffle into later, unrelated draws of the same
   question instead of staying local to this one render. */
function shuffleQuestionChoices(question){
  const order = shuffleArray([0, 1, 2, 3]);
  return {
    choices: order.map(i => question.choices[i]),
    correctIndex: order.indexOf(question.correctIndex)
  };
}

/* Draws questions from `pool` in a random order with no immediate
   repeats; reshuffles and keeps going once it runs out, so a run
   can never actually exhaust the pool. Pass `rng` (from
   makeSeededRandom) to get a fixed, reproducible order for a "same
   set" challenge link; omit it for a normal random run. */
function createQuestionQueue(pool, rng){
  const rand = typeof rng === "function" ? rng : Math.random;
  let queue = shuffleArray(pool, rand);
  let index = 0;
  return function next(){
    if (index >= queue.length) {
      queue = shuffleArray(pool, rand);
      index = 0;
    }
    return queue[index++];
  };
}

/* Seeded RNG for this page view's set seed (see currentSetSeed) —
   the Bronco engines pass this into createQuestionQueue so the run
   always matches the "same set" link the share card shows. */
function sameSetRng(){
  return makeSeededRandom(currentSetSeed());
}

/* Renders one question into `${prefix}QuestionText` / `${prefix}Choices`
   and wires up its 4 answer buttons (labeled A-D — also the keyboard
   shortcuts enableKeyboardAnswers below wires up), in a freshly
   shuffled order each time (see shuffleQuestionChoices above) so the
   correct answer isn't always in the same position when a question
   repeats. `onAnswer(wasCorrect)` fires once, after briefly
   highlighting the chosen answer (and the correct one, if the choice
   was wrong) so the player sees what they got. */
function renderGameQuestion(prefix, question, onAnswer){
  const textEl = document.getElementById(`${prefix}QuestionText`);
  const choicesEl = document.getElementById(`${prefix}Choices`);
  if (!textEl || !choicesEl) return;

  const shuffled = shuffleQuestionChoices(question);
  const LETTERS = ["A", "B", "C", "D"];
  textEl.textContent = question.question;
  choicesEl.innerHTML = shuffled.choices.map((choice, i) =>
    `<button class="game-question__choice" type="button" data-choice-index="${i}"><span class="choice-letter">${LETTERS[i]}.</span>${escapeHtml(choice)}</button>`
  ).join("");

  choicesEl.querySelectorAll("[data-choice-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const buttons = choicesEl.querySelectorAll("[data-choice-index]");
      buttons.forEach(b => { b.disabled = true; });

      const correct = Number(btn.dataset.choiceIndex) === shuffled.correctIndex;
      btn.classList.add(correct ? "is-correct" : "is-wrong");
      if (!correct) {
        const correctBtn = choicesEl.querySelector(`[data-choice-index="${shuffled.correctIndex}"]`);
        if (correctBtn) correctBtn.classList.add("is-correct");
      }
      onAnswer(correct);
    });
  });
}

/* Lets the keyboard pick an answer choice — 1/2/3/4 or A/B/C/D — for
   any persistent game's question, since every one of them (Dash,
   Splash, Blitz) renders its choices as buttons with a
   `data-choice-index` inside `${choicesElId}`. One listener added
   once per game page rather than one per question: it just looks up
   whichever button is live in the DOM at keypress time, so it needs
   no cleanup and can't double-fire or go stale between questions. */
function enableKeyboardAnswers(choicesElId){
  const KEYS = ["1", "2", "3", "4", "a", "b", "c", "d"];
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    const keyIndex = KEYS.indexOf(key);
    if (keyIndex === -1) return;

    const choicesEl = document.getElementById(choicesElId);
    if (!choicesEl) return;
    const btn = choicesEl.querySelector(`[data-choice-index="${keyIndex % 4}"]`);
    if (btn && !btn.disabled) btn.click();
  });
}

/* Positions one marker (start line, finish line, pace line, ...)
   relative to the player, who stays fixed dead-center on screen the
   whole game — the markers move instead, based on how far `current`
   is from that marker's own fixed `referenceValue`. A marker whose
   referenceValue equals `current` sits exactly on the player — e.g.
   the finish marker reaches the player exactly at the win moment,
   and (for Bronco Dash) the start marker sits exactly on the player
   at the moment the game begins, since it shares the same starting
   value rather than an arbitrary zero. */
function updateGameMarker(elId, current, referenceValue, pxPerUnit){
  const el = document.getElementById(elId);
  if (el) el.style.transform = `translateX(${(referenceValue - current) * pxPerUnit}px)`;
}

function updateGameBar(elId, fraction){
  const fill = document.getElementById(elId);
  if (fill) fill.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
}

function briefBoost(figureEl, drift){
  if (figureEl) figureEl.classList.add("is-boost");
  if (drift) drift.boost(1.8, 500);
  setTimeout(() => {
    if (figureEl) figureEl.classList.remove("is-boost");
  }, 500);
}

/* Drives a decorative scroll layer's background-position-x every
   frame instead of via a CSS animation, so its speed can ease up and
   back down smoothly (a correct answer's "boost") with no jump — see
   the comment on .game-scroll in styles.css for why that matters. */
function createScrollDrift(scrollEl, initialBasePxPerSec){
  const STEP_MS = 40;
  let pos = 0;
  let speed = initialBasePxPerSec;
  let base = initialBasePxPerSec;
  let boostSpeed = null; // non-null while a boost is overriding the base
  let stepTimer = null;
  let resetTimer = null;

  function step(){
    const dt = STEP_MS / 1000;
    const target = boostSpeed !== null ? boostSpeed : base;
    speed += (target - speed) * Math.min(1, dt * 5);
    pos -= speed * dt;
    if (scrollEl) scrollEl.style.backgroundPositionX = `${pos}px`;
  }
  stepTimer = setInterval(step, STEP_MS);

  return {
    /* lets the "resting" speed itself change over time — e.g. Bronco
       Splash ties this to the swimmer's actual current speed, so the
       water stops scrolling when the swimmer stops moving (out of
       air) instead of drifting on regardless. */
    setBase(newBase){ base = newBase; },
    boost(multiplier, durationMs){
      boostSpeed = initialBasePxPerSec * multiplier;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { boostSpeed = null; }, durationMs);
    },
    stop(){
      clearInterval(stepTimer);
      clearTimeout(resetTimer);
    }
  };
}

/* ---------- Bronco Dash ----------
   The player's own tick never decreases — it only ever moves forward,
   via correct answers. Falling behind isn't represented by the
   player (or the start line) moving backward; instead a separate
   "pace line" steadily advances on its own the whole game. Answer
   quickly enough and you pull away from it; answer too slowly (or
   wrong, which costs a 3s wait with no progress) and it closes the
   gap. If it ever catches the player, that's a loss. */
function initBroncoDash(){
  const prefix = "dash";
  const startPanel = document.getElementById(`${prefix}StartPanel`);
  const startBtn = document.getElementById(`${prefix}StartBtn`);
  const playAgainBtn = document.getElementById(`${prefix}PlayAgainBtn`);
  const tryAgainBtn = document.getElementById(`${prefix}TryAgainBtn`);
  const stage = document.getElementById(`${prefix}Stage`);
  const questionPanel = document.getElementById(`${prefix}Question`);
  const finishPanel = document.getElementById(`${prefix}FinishPanel`);
  const losePanel = document.getElementById(`${prefix}LosePanel`);
  const finishTimeEl = document.getElementById(`${prefix}FinishTime`);
  const timerEl = document.getElementById(`${prefix}Timer`);
  const waitEl = document.getElementById(`${prefix}WaitMsg`);
  const figureEl = stage ? stage.querySelector(".stick-figure") : null;
  const scrollEl = stage ? stage.querySelector(".game-scroll") : null;
  if (!startBtn) return;
  enableKeyboardAnswers(`${prefix}Choices`);

  const START = 30, WIN = 60, PX_PER_TICK = 14;
  const PACE_START_GAP = 8, PACE_PER_SEC = 1, STEP_MS = 100;
  const BOOST_MIN = 3, BOOST_MAX = 5, WRONG_WAIT_MS = 3000;
  const SCROLL_BASE_SPEED = 100;

  const nextQuestion = createQuestionQueue(PERSISTENT_GAME_QUESTIONS, sameSetRng());

  let tick = START;
  let pace = START - PACE_START_GAP;
  let startTime = null;
  let stepTimer = null;
  let timerInterval = null;
  let waitInterval = null;
  let finished = false;
  let drift = null;

  function updateVisuals(){
    updateGameMarker(`${prefix}StartMarker`, tick, START, PX_PER_TICK);
    updateGameMarker(`${prefix}FinishMarker`, tick, WIN, PX_PER_TICK);
    updateGameMarker(`${prefix}PaceMarker`, tick, pace, PX_PER_TICK);
    updateGameBar(`${prefix}ProgressFill`, (tick - START) / (WIN - START));
  }

  function askQuestion(){
    if (finished) return;
    renderGameQuestion(prefix, nextQuestion(), handleAnswer);
  }

  function handleAnswer(correct){
    if (finished) return;
    if (correct) {
      const boost = BOOST_MIN + Math.floor(Math.random() * (BOOST_MAX - BOOST_MIN + 1));
      tick = Math.min(WIN, tick + boost);
      updateVisuals();
      briefBoost(figureEl, drift);
      if (tick >= WIN) { finishGame(); return; }
      setTimeout(askQuestion, 400);
    } else {
      if (figureEl) figureEl.classList.add("is-waiting");
      let remaining = Math.round(WRONG_WAIT_MS / 1000);
      if (waitEl) waitEl.textContent = `Wait ${remaining}s…`;
      waitInterval = setInterval(() => {
        if (finished) { clearInterval(waitInterval); return; }
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(waitInterval);
          if (waitEl) waitEl.textContent = "";
          if (figureEl) figureEl.classList.remove("is-waiting");
          askQuestion();
        } else if (waitEl) {
          waitEl.textContent = `Wait ${remaining}s…`;
        }
      }, 1000);
    }
  }

  function step(){
    if (finished) return;
    pace += PACE_PER_SEC * (STEP_MS / 1000);
    updateVisuals();
    if (pace >= tick) loseGame();
  }

  function updateTimerDisplay(){
    if (timerEl && startTime !== null) timerEl.textContent = formatTime((Date.now() - startTime) / 1000);
  }

  function stopTimers(){
    clearInterval(stepTimer);
    clearInterval(timerInterval);
    clearInterval(waitInterval);
  }

  function finishGame(){
    finished = true;
    stopTimers();
    if (drift) drift.stop();
    const elapsed = (Date.now() - startTime) / 1000;
    recordWin("broncoDash", `${Date.now()}-${Math.random()}`);
    const isNewBest = recordBestTime("broncoDash", elapsed);
    emitRoundComplete("broncoDash", { won: true, timeSeconds: elapsed });
    if (questionPanel) questionPanel.hidden = true;
    if (figureEl) figureEl.className = "stick-figure";
    if (finishTimeEl) {
      finishTimeEl.innerHTML = `Time: ${formatTime(elapsed)}` + (isNewBest ? ` <span class="is-new-best">— new best!</span>` : "");
    }
    if (finishPanel) finishPanel.hidden = false;
  }

  function loseGame(){
    finished = true;
    stopTimers();
    if (drift) drift.stop();
    if (questionPanel) questionPanel.hidden = true;
    if (waitEl) waitEl.textContent = "";
    if (figureEl) figureEl.className = "stick-figure is-waiting";
    if (losePanel) losePanel.hidden = false;
    emitRoundComplete("broncoDash", { won: false });
  }

  function startGame(){
    tick = START;
    pace = START - PACE_START_GAP;
    finished = false;
    startTime = Date.now();
    if (startPanel) startPanel.hidden = true;
    if (finishPanel) finishPanel.hidden = true;
    if (losePanel) losePanel.hidden = true;
    if (stage) stage.hidden = false;
    if (questionPanel) questionPanel.hidden = false;
    if (waitEl) waitEl.textContent = "";
    if (figureEl) figureEl.className = "stick-figure is-running";
    updateVisuals();
    if (drift) drift.stop();
    drift = createScrollDrift(scrollEl, SCROLL_BASE_SPEED);
    stepTimer = setInterval(step, STEP_MS);
    timerInterval = setInterval(updateTimerDisplay, 100);
    askQuestion();
  }

  startBtn.addEventListener("click", startGame);
  if (playAgainBtn) playAgainBtn.addEventListener("click", startGame);
  if (tryAgainBtn) tryAgainBtn.addEventListener("click", startGame);
}

/* ---------- Bronco Splash ---------- */
function initBroncoSplash(){
  const prefix = "splash";
  const startPanel = document.getElementById(`${prefix}StartPanel`);
  const startBtn = document.getElementById(`${prefix}StartBtn`);
  const playAgainBtn = document.getElementById(`${prefix}PlayAgainBtn`);
  const stage = document.getElementById(`${prefix}Stage`);
  const questionPanel = document.getElementById(`${prefix}Question`);
  const finishPanel = document.getElementById(`${prefix}FinishPanel`);
  const finishTimeEl = document.getElementById(`${prefix}FinishTime`);
  const timerEl = document.getElementById(`${prefix}Timer`);
  const figureEl = stage ? stage.querySelector(".stick-figure") : null;
  const scrollEl = stage ? stage.querySelector(".game-scroll") : null;
  if (!startBtn) return;
  enableKeyboardAnswers(`${prefix}Choices`);

  const O2_START = 100, PROGRESS_WIN = 100, PX_PER_PERCENT = 22;
  const O2_DEPLETE_PER_SEC = 12, O2_LOW_THRESHOLD = 20;
  const BASE_PROGRESS_PER_SEC = 2;
  const CORRECT_O2_BONUS = 44, CORRECT_PROGRESS_BURST = 4, WRONG_O2_PENALTY = 15;
  const STEP_MS = 100;
  const SCROLL_BASE_SPEED = 45;

  const nextQuestion = createQuestionQueue(PERSISTENT_GAME_QUESTIONS, sameSetRng());

  let o2 = O2_START;
  let progress = 0;
  let startTime = null;
  let stepTimer = null;
  let timerInterval = null;
  let finished = false;
  let drift = null;

  function speedFactor(){
    if (o2 <= 0) return 0;
    if (o2 >= O2_LOW_THRESHOLD) return 1;
    return o2 / O2_LOW_THRESHOLD;
  }

  function updateVisuals(){
    updateGameMarker(`${prefix}StartMarker`, progress, 0, PX_PER_PERCENT);
    updateGameMarker(`${prefix}FinishMarker`, progress, PROGRESS_WIN, PX_PER_PERCENT);
    updateGameBar(`${prefix}ProgressFill`, progress / PROGRESS_WIN);
    updateGameBar(`${prefix}O2Fill`, o2 / O2_START);
    if (figureEl) {
      figureEl.classList.remove("is-swimming", "is-gasping");
      figureEl.classList.add(o2 <= 0 ? "is-gasping" : "is-swimming");
    }
    // pool lines track the swimmer's actual current speed, so they
    // ease to a stop when out of air instead of drifting regardless
    if (drift) drift.setBase(SCROLL_BASE_SPEED * speedFactor());
  }

  function askQuestion(){
    if (finished) return;
    renderGameQuestion(prefix, nextQuestion(), handleAnswer);
  }

  function handleAnswer(correct){
    if (finished) return;
    if (correct) {
      o2 = Math.min(O2_START, o2 + CORRECT_O2_BONUS);
      progress = Math.min(PROGRESS_WIN, progress + CORRECT_PROGRESS_BURST);
      briefBoost(figureEl, drift);
    } else {
      o2 = Math.max(0, o2 - WRONG_O2_PENALTY);
    }
    updateVisuals();
    if (progress >= PROGRESS_WIN) { finishGame(); return; }
    setTimeout(askQuestion, 400);
  }

  function step(){
    if (finished) return;
    o2 = Math.max(0, o2 - (O2_DEPLETE_PER_SEC * STEP_MS / 1000));
    progress = Math.min(PROGRESS_WIN, progress + (BASE_PROGRESS_PER_SEC * speedFactor() * STEP_MS / 1000));
    updateVisuals();
    if (progress >= PROGRESS_WIN) finishGame();
  }

  function updateTimerDisplay(){
    if (timerEl && startTime !== null) timerEl.textContent = formatTime((Date.now() - startTime) / 1000);
  }

  function finishGame(){
    finished = true;
    clearInterval(stepTimer);
    clearInterval(timerInterval);
    if (drift) drift.stop();
    const elapsed = (Date.now() - startTime) / 1000;
    const isNewBest = recordBestTime("broncoSplash", elapsed);
    emitRoundComplete("broncoSplash", { won: true, timeSeconds: elapsed });
    if (questionPanel) questionPanel.hidden = true;
    if (figureEl) figureEl.className = "stick-figure";
    if (finishTimeEl) {
      finishTimeEl.innerHTML = `Time: ${formatTime(elapsed)}` + (isNewBest ? ` <span class="is-new-best">— new best!</span>` : "");
    }
    if (finishPanel) finishPanel.hidden = false;
  }

  function startGame(){
    o2 = O2_START;
    progress = 0;
    finished = false;
    startTime = Date.now();
    if (startPanel) startPanel.hidden = true;
    if (finishPanel) finishPanel.hidden = true;
    if (stage) stage.hidden = false;
    if (questionPanel) questionPanel.hidden = false;
    if (figureEl) figureEl.className = "stick-figure is-swimming";
    updateVisuals();
    if (drift) drift.stop();
    drift = createScrollDrift(scrollEl, SCROLL_BASE_SPEED);
    stepTimer = setInterval(step, STEP_MS);
    timerInterval = setInterval(updateTimerDisplay, 100);
    askQuestion();
  }

  startBtn.addEventListener("click", startGame);
  if (playAgainBtn) playAgainBtn.addEventListener("click", startGame);
}

/* ---------- Bronco Blitz ----------
   A 30-second trivia speed round — no track/pool/figure, just a
   running score built from A/B/C/D questions. Each correct answer
   is worth a base 100 points, multiplied by a streak multiplier
   (grows with consecutive correct answers, capped at 3x) plus a
   flat speed bonus that tapers off the longer you take to answer.
   A wrong answer breaks the streak and locks out answering for 3
   seconds — the 30-second clock keeps running the whole time,
   lockout included, so a wrong answer costs real time. */
function initBroncoBlitz(){
  const prefix = "blitz";
  const startPanel = document.getElementById(`${prefix}StartPanel`);
  const startBtn = document.getElementById(`${prefix}StartBtn`);
  const playAgainBtn = document.getElementById(`${prefix}PlayAgainBtn`);
  const gameEl = document.getElementById(`${prefix}Game`);
  const finishPanel = document.getElementById(`${prefix}FinishPanel`);
  const finishScoreEl = document.getElementById(`${prefix}FinishScore`);
  const timerEl = document.getElementById(`${prefix}Timer`);
  const timerFillEl = document.getElementById(`${prefix}TimerFill`);
  const scoreEl = document.getElementById(`${prefix}Score`);
  const streakEl = document.getElementById(`${prefix}Streak`);
  const streakStatEl = document.getElementById(`${prefix}StreakStat`);
  const timeLeftEl = document.getElementById(`${prefix}TimeLeft`);
  const timeStatEl = document.getElementById(`${prefix}TimeStat`);
  const textEl = document.getElementById(`${prefix}QuestionText`);
  const choicesEl = document.getElementById(`${prefix}Choices`);
  const pointsMsgEl = document.getElementById(`${prefix}PointsMsg`);
  const waitEl = document.getElementById(`${prefix}WaitMsg`);
  if (!startBtn) return;
  enableKeyboardAnswers(`${prefix}Choices`);

  const GAME_MS = 30000, LOW_TIME_MS = 10000;
  const BASE_POINTS = 100;
  const STREAK_STEP = 0.25, STREAK_MULTIPLIER_CAP = 3;
  const WRONG_LOCKOUT_MS = 3000;
  const SPEED_BONUS_MAX = 50, SPEED_BONUS_WINDOW_MS = 5000;
  const STEP_MS = 100;
  const LETTERS = ["A", "B", "C", "D"];

  const nextQuestion = createQuestionQueue(PERSISTENT_GAME_QUESTIONS, sameSetRng());

  let score = 0;
  let streak = 0;
  let remainingMs = GAME_MS;
  let endAt = null;            // wall-clock end time — the accurate source of "time left"
  let questionShownAt = null;
  let finished = false;
  let stepTimer = null;
  let hudTimer = null;         // fast repaint of the HUD "Time left" readout
  let waitTimeout = null;

  /* 0 correct in a row -> 1x. Each additional one in a row adds
     STREAK_STEP, capped at STREAK_MULTIPLIER_CAP. */
  function currentMultiplier(){
    return streak > 0 ? Math.min(1 + (streak - 1) * STREAK_STEP, STREAK_MULTIPLIER_CAP) : 1;
  }

  function updateHud(){
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
    if (streakEl) streakEl.textContent = `${streak} (×${currentMultiplier().toFixed(2)})`;
    if (streakStatEl) streakStatEl.classList.toggle("is-hot", streak >= 3);
  }

  function updateTimerDisplay(){
    const secs = Math.max(0, remainingMs / 1000);
    if (timerEl) timerEl.textContent = `0:${Math.ceil(secs).toString().padStart(2, "0")}`;
    if (timerFillEl) {
      timerFillEl.style.width = `${Math.max(0, remainingMs / GAME_MS) * 100}%`;
      timerFillEl.classList.toggle("is-low", remainingMs <= LOW_TIME_MS);
    }
  }

  /* HUD "Time left" — plain whole seconds ("18") while more than
     LOW_TIME_MS remains; in the final 10s it turns red and switches
     to SS:CC (seconds : hundredths), repainted fast for a live
     countdown feel. */
  function updateHudTime(){
    const left = endAt !== null ? Math.max(0, endAt - Date.now()) : Math.max(0, remainingMs);
    const low = left <= LOW_TIME_MS;
    if (timeStatEl) timeStatEl.classList.toggle("is-low", low);
    if (!timeLeftEl) return;
    if (low) {
      const s = Math.floor(left / 1000);
      const cs = Math.floor((left % 1000) / 10);
      timeLeftEl.textContent = `${String(s).padStart(2, "0")}:${String(cs).padStart(2, "0")}`;
    } else {
      timeLeftEl.textContent = `${Math.ceil(left / 1000)}`;
    }
  }

  function askQuestion(){
    if (finished) return;
    if (waitEl) waitEl.textContent = "";
    if (pointsMsgEl) pointsMsgEl.textContent = "";
    const question = nextQuestion();
    const shuffled = shuffleQuestionChoices(question);
    questionShownAt = Date.now();

    if (textEl) textEl.textContent = question.question;
    if (!choicesEl) return;
    choicesEl.innerHTML = shuffled.choices.map((choice, i) =>
      `<button class="game-question__choice" type="button" data-choice-index="${i}"><span class="choice-letter">${LETTERS[i]}.</span>${escapeHtml(choice)}</button>`
    ).join("");

    choicesEl.querySelectorAll("[data-choice-index]").forEach(btn => {
      btn.addEventListener("click", () => handleAnswer(shuffled.correctIndex, Number(btn.dataset.choiceIndex), btn));
    });
  }

  function handleAnswer(correctIndex, choiceIndex, btn){
    if (finished) return;
    choicesEl.querySelectorAll("[data-choice-index]").forEach(b => { b.disabled = true; });

    const correct = choiceIndex === correctIndex;
    btn.classList.add(correct ? "is-correct" : "is-wrong");
    if (!correct) {
      const correctBtn = choicesEl.querySelector(`[data-choice-index="${correctIndex}"]`);
      if (correctBtn) correctBtn.classList.add("is-correct");
    }

    if (correct) {
      streak += 1;
      const elapsed = questionShownAt !== null ? Date.now() - questionShownAt : SPEED_BONUS_WINDOW_MS;
      const speedBonus = Math.round(SPEED_BONUS_MAX * Math.max(0, (SPEED_BONUS_WINDOW_MS - elapsed) / SPEED_BONUS_WINDOW_MS));
      const earned = Math.round(BASE_POINTS * currentMultiplier()) + speedBonus;
      score += earned;
      updateHud();
      if (pointsMsgEl) pointsMsgEl.textContent = `+${earned} pts` + (speedBonus > 0 ? ` (includes +${speedBonus} speed bonus)` : "");
      setTimeout(askQuestion, 400);
    } else {
      streak = 0;
      updateHud();
      let remaining = Math.round(WRONG_LOCKOUT_MS / 1000);
      const tick = () => {
        if (finished) return;
        if (remaining <= 0) {
          if (waitEl) waitEl.textContent = "";
          askQuestion();
          return;
        }
        if (waitEl) waitEl.textContent = `Wrong — wait ${remaining}s…`;
        remaining -= 1;
        waitTimeout = setTimeout(tick, 1000);
      };
      tick();
    }
  }

  function step(){
    if (finished) return;
    remainingMs = endAt !== null ? (endAt - Date.now()) : (remainingMs - STEP_MS);
    updateTimerDisplay();
    if (remainingMs <= 0) endGame();
  }

  function endGame(){
    finished = true;
    clearInterval(stepTimer);
    clearInterval(hudTimer);
    clearTimeout(waitTimeout);
    remainingMs = 0;
    updateTimerDisplay();
    updateHudTime();
    if (choicesEl) choicesEl.querySelectorAll("[data-choice-index]").forEach(b => { b.disabled = true; });
    if (waitEl) waitEl.textContent = "";
    if (gameEl) gameEl.hidden = true;
    addPoints("broncoBlitz", score);
    const isNewBest = recordBestScore("broncoBlitz", score);
    emitRoundComplete("broncoBlitz", { won: true, score: score });
    if (finishScoreEl) {
      finishScoreEl.innerHTML = `You scored ${score.toLocaleString()} points` + (isNewBest ? ` <span class="is-new-best">— new high score!</span>` : "") + ` — added to your lifetime total on the Stats page.`;
    }
    if (finishPanel) finishPanel.hidden = false;
  }

  function startGame(){
    score = 0;
    streak = 0;
    remainingMs = GAME_MS;
    endAt = Date.now() + GAME_MS;
    finished = false;
    if (startPanel) startPanel.hidden = true;
    if (finishPanel) finishPanel.hidden = true;
    if (gameEl) gameEl.hidden = false;
    updateHud();
    updateTimerDisplay();
    updateHudTime();
    clearInterval(stepTimer);
    clearInterval(hudTimer);
    clearTimeout(waitTimeout);
    stepTimer = setInterval(step, STEP_MS);
    hudTimer = setInterval(updateHudTime, 40);
    askQuestion();
  }

  startBtn.addEventListener("click", startGame);
  if (playAgainBtn) playAgainBtn.addEventListener("click", startGame);
}

/* ================================================================
   RETIRED — DAILY CROSSWORD + GUESS THE TEACHER
   ----------------------------------------------------------------
   These games are no longer published (v1.5). Everything below is
   kept only so past entries stay playable in the Archive. It sits
   at the bottom of the file, out of the way of the live games.
   ================================================================ */

/* ----------------------------------------------------------------
   DAILY PUZZLES — Daily Crossword + Guess the Teacher (RETIRED)
   ----------------------------------------------------------------
   These two games are no longer published (v1.5). This list is
   frozen — every entry still shows in the Archive so old puzzles
   stay playable, but there's no reason to add new ones. The entry
   shape is left documented below for reference only.

   One object per day, any order. Each entry:

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
    isoDate: "2026-08-25",
    date: "August 25, 2026",
    crossword: {
      difficulty: "2.5/5",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupaug25&set=carter"
    },
    guessTheTeacher: {
      difficulty: "2/5",
      answer: "Mr. Ward",
      clues: [
        "This person knows pretty much everybody.",
        "This faculty member deals with a lot of Brophy allumni.",
        "This faculty member in the Admissions and Allumni Relations department."
      ]
    }
  },
  {
    isoDate: "2026-08-24",
    date: "August 24, 2026",
    crossword: {
      difficulty: "2/5",
      embedUrl: "https://puzzleme.amuselabs.com/pmm/crossword?id=roundupaug24&set=carter"
    },
    guessTheTeacher: {
      difficulty: "3/5",
      answer: "Mr. Barton",
      clues: [
        "This teacher went to Brophy as a student not too long ago and was part of the Alumni Service Corps.",
        "This teacher is in the religious studies department.",
        "One of the classes he teaches is Freshman Scripture."
      ]
    }
  },
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
        "This teacher teaches a language class.",
        "This teacher loves making kids now they are a star.",
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

/* Daily Crossword + Guess the Teacher are retired (v1.5) — no "today"
   for them anymore, so every non-future entry belongs in the Archive,
   not just the ones older than the latest. */
const DAILY_RESOLVED = resolvePuzzleSet(DAILY_PUZZLES);
const DAILY_ARCHIVE = DAILY_RESOLVED.current
  ? [...DAILY_RESOLVED.archive, DAILY_RESOLVED.current]
  : [...DAILY_RESOLVED.archive];

/* Run immediately (not gated behind DOMContentLoaded) — these are
   pure localStorage operations with no DOM dependency, and need to
   have already happened before any page-specific inline script
   (e.g. stats.html's renderStatsPage()) reads stats, since that
   script runs before DOMContentLoaded fires. */
migrateCrosswordWinIds();
backfillGuessTheTeacherWins();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
  document.getElementById("siteVersion") && (document.getElementById("siteVersion").textContent = SITE_VERSION);
  initEditionLabel();
});
