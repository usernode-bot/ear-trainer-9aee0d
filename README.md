# Ear Trainer

Learn to recognise intervals, chords and chord progressions by ear.

- **Three lesson types** — Intervals, Chords and Progressions, each with
  five levels of growing set size (2 → 3 → 4 → 6 → 8 sounds).
- **Ordered by difficulty** — early levels train a small set of very
  distinct sounds; later levels quiz you on the full set of the most
  similar ones (closer intervals, more complex chords, progressions that
  resemble each other).
- **How a lesson works** — 10 questions. Each one plays a sound
  (synthesized in the browser with the Web Audio API, at a random pitch or
  key) and you tap its name from the answer buttons. Immediate
  right/wrong feedback, and a piano keyboard lights up the notes you
  heard.
- **Progress** — your best score per lesson level is saved and shown on
  the lesson list. Progress is per user; nothing is shared between users.

Progressions are drawn from well-known songs and hymns (I–IV–V–I,
I–V–vi–IV, the hymn amen cadence, and others), taught from the most
distinct to the most similar.

## Building and running

- `npm ci --include=dev && npm run build` compiles the Tailwind
  stylesheet (`public/tailwind.css`); the Docker/Paketo image build does
  this automatically on every deploy.
- `node server.js` serves the app on port 3000 with its own Postgres
  (`DATABASE_URL`).

App-specific notes for Claude Code live in `CLAUDE.md`; the platform
rules are at https://app.onhomeroom.com/claude.md.
