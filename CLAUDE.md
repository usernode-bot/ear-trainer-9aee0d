# Ear Trainer — notes for Claude Code

This app runs on **Homeroom**. If you're Claude Code
editing this repo, read the platform conventions before making
changes:

**Platform conventions (authoritative, always current):**
https://app.onhomeroom.com/claude.md

Fetch that URL at the start of each session — it's the single source
of truth for platform-wide behavior (auth model, `USERNODE_ENV`,
public/private tables, "don't `git push`", etc.). The hosted copy is
updated in place when platform rules change, so fetching it gives you
today's rules, not a stale snapshot.

When running inside Homeroom's dev-chat, those same conventions are
already injected into your system prompt, so the fetch is a no-op in
that path — but it's the right reflex when someone runs Claude Code
against this repo locally or from another harness.

## Connector permission prompts

This repo ships `.claude/settings.json`, which allows the **read-only**
Homeroom connector calls (`mcp__homeroom__get_*`,
`…__list_*`, `…__whoami`) so they stop prompting one at a time. Everything
that acts — filing a request, opening or advancing a proposal — still asks.
Claude Code applies those rules only after you accept the
workspace trust dialog, which lists them for review. See `.claude/README.md`
for the whole story, including what to do if you are still being prompted
(usually: your connector is registered under a different name than the rules
assume).

## Check that this checkout is current

You may be working in a fork of this app whose `main` is behind the app's
canonical repository, and nothing in the checkout says so: `git fetch origin`
compares the fork with itself. This matters before you **read** code to answer
a question about how the app behaves now, not only before you edit it.

The canonical repository is named in `.claude/homeroom-canonical-repo`. Check against
it, not against `origin`:

```sh
git fetch "$(cat .claude/homeroom-canonical-repo)" main
git merge-base --is-ancestor FETCH_HEAD HEAD && echo current || echo behind
```

`behind` means this checkout does not contain the canonical `main`. To answer
a question, read the canonical code instead (`git show FETCH_HEAD:<path>`,
`git grep <pattern> FETCH_HEAD`). To change code, start from the exact base
commit your Homeroom work order gives, and never merge or rebase onto the
canonical `main` yourself: which commit a change is diffed against decides
what the group votes on. With the Homeroom connector, `get_checkout_status`
answers the same question.

A session-start hook (`.claude/hooks/homeroom-freshness.sh`, see `.claude/README.md`) runs
this check for you and tells you when you are behind. It is silent offline, so
its silence is not proof the checkout is current. Inside Homeroom's dev-chat
the platform fixes the base commit, and none of this applies.

## Starter template

The screen this app currently ships — the hero, the "What's already
working" card, and the Press! example (the demo markup in
`public/index.html`, the `/api/press` and `/api/leaderboard` routes, and
the `presses` table bootstrap in `server.js`) — is placeholder content
from the Homeroom starter template, not product intent.

When the user asks for their first real feature, REPLACE the template
screen rather than building alongside it:

- remove the `usernode-starter-notice@1` block in `public/index.html`
  (both sentinel comments and everything between them),
- remove or repurpose the "Try the example" card, its demo endpoints and
  the `presses` table as appropriate,
- rewrite `README.md` to describe the actual app.

Keep the `usernode-dev-console@1` forwarder `<script>` when rewriting the
HTML — that block is platform infrastructure, not template content. So is
the bridge `<script>`.

The screen has a light and a dark look and follows the viewer's Homeroom
theme, switching live when they change it: the theme `<script>` right after
the bridge tag sets a `dark` class on `<html>`. Keep that script, and give
everything you build both looks (Tailwind's `dark:` variants), unless one
fixed look is the point of this app, like a game's own scene; then say so
under "App-specific conventions" below. Unless a request asks for one, add
no theme picker: the viewer's Homeroom setting is the control. "The
platform's light/dark theme inside the app frame" in the platform
conventions has the details.

If a rule below this line conflicts with the hosted conventions, the
hosted conventions win. This file is **app-specific** — write down
things about *this* app that belong in the repo: product intent,
data-model quirks, style preferences, opt-in policies (e.g. which
tables you've marked private), etc.

---

## About Ear Trainer

Ear Trainer teaches people to recognise intervals, chords and chord
progressions by ear. The screen has one job at a time: pick a lesson
(three types × five levels of growing set size), or hear a sound and tap
its name over 10 questions. Sounds are synthesized in the browser with
the Web Audio API at a random pitch/key so users learn the shape of a
sound, not one absolute pitch; after answering, an SVG piano keyboard
lights up the notes that were played. Best scores per lesson level are
saved per user in `lesson_progress` (with append-only history in
`quiz_attempts`); both tables are `staging:private`.

## App-specific conventions

Design:
- Accent: warm **amber** (`amber-500` primary, `amber-400` hover) on
  **slate** neutrals (light: `slate-50` bg / `slate-900` text; dark:
  `slate-950` bg / `slate-100` text). Emerald = correct, rose = wrong —
  reserved for feedback, never decoration. No other colours.
- Signature element: the inline SVG piano keyboard (C3–C5) at the bottom
  of the lesson screen; the played notes light up in amber after an
  answer. New sound-related screens should build on it.
- Both looks always (Tailwind `dark:` variants; the viewer's Homeroom
  theme is the control — no theme picker). Light and dark built with the
  same slate card idiom: `rounded-xl border` cards, `divide-y` rows.
- Vocabulary: *Lesson*, *Level*, *sound*, *Play*, *answers*, *Next*,
  *Finish*, *Score*, *best*, *Session complete*. Never "quiz", "test" or
  "exercise" on screen.
- One primary action per view (Play before answering, Next after); one
  amber filled button per screen.
- Curriculum ordering rule: within a lesson type, sounds are added from
  most distinct to most similar across the five levels (sizes 2, 3, 4,
  6, 8). New sounds should follow that order.
- The lesson catalog is static frontend data in `public/index.html`; the
  server only stores results. `quiz_attempts` is append-only; never
  delete or aggregate rows away.
