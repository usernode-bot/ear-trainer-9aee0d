# Ear Trainer

Learn to hear relative notes, chords and chord progressions. Sounds are
synthesized in the browser from a fixed key of C, so every question trains
your ear rather than absolute pitch.

## What the app does

- **Intervals** - two notes played one after the other; identify the gap
  between them (perfect 5th, major 3rd, tritone and more).
- **Notes** - a home note, then a second note; identify where the second note
  sits in the major scale. The home note changes every question, so you
  practise scale degrees in any key.
- **Chords** - one chord played all at once; identify its quality (major,
  minor, diminished, dominant 7th and more).
- **Progressions** - a short chord sequence played one after another;
  identify it by its roman numerals. Each progression comes from a well-known
  song or hymn, named in the feedback.

Each type has four lessons, ordered from a few contrasting sounds up to the
full set. The first lesson is open from the start; passing any run at 80% or
better unlocks the next lesson. Inside a lesson you pick a size (small, medium
or large) that controls how many different sounds you are quizzed on. Each run
is ten questions, and your best score per lesson and size is saved
automatically.

## How it works

- Sign-in comes from the platform: the server verifies the Homeroom-issued
  user token (an RS256 JWT) on every request. No accounts to build.
- Attempt results live in the app's own Postgres database in an `attempts`
  table; `/api/progress` aggregates each user's best score per lesson and
  size.
- All sounds are synthesized with the Web Audio API. No audio files, no
  dependencies beyond the starter's Express / Postgres / JWT stack.
- Styling is Tailwind CSS, precompiled by `npm run build` during image
  creation with either Kubernetes/Paketo or standalone Docker.

## Replacing the template (historical note)

This app started from the Homeroom starter template; the demo press/
leaderboard screen and endpoints were replaced by the lessons and quiz you
see now. The `usernode-dev-console` forwarder and platform bridge tags are
platform infrastructure and stay.
