# Doji Spearfishing — Agent Instructions

## Read First

Before writing ANY code, read every file in `docs/`:
- `docs/RESEARCH.md` — Company research, job posting details, App Store reviews, honest fit assessment
- `docs/SPEC.md` — The demo spec: foundational phrase, flow beats, screen list, technical decisions. This is the source of truth for what we're building.
- `docs/IDEAS.md` — Beckham's raw ideas scratchpad. Brainstorming space. Ideas that get validated move to SPEC.md.
- `docs/brand-analysis.md` — Doji's design language, visual patterns, interaction style
- `docs/design-reference.md` — Visual reference for the demo: colors, typography, spacing, animation style to match Doji's app
- `docs/ios-capability-reference.md` — iOS technical limits: triangle budgets, animation capabilities, shader support, what to avoid for native portability
- `docs/gotchas.md` — Known pitfalls. Read before debugging. Write when you hit something unexpected.

---

## Project Context

**What this is**: A spearfishing project — a targeted demo built to land a Design Engineer role at Doji (AI virtual try-on fashion app for iOS).

**The goal**: Build a focused, polished prototype that demonstrates design engineering craft — specifically obsessive attention to gestures, transitions, and micro-details. The demo should feel like it belongs in Doji's product.

**Key constraint**: We cannot access the Doji app (invite-only). All knowledge of the current UX comes from App Store reviews, press coverage, marketing screenshots, and video walkthroughs. The demo should be framed as "here's how I'd approach this" not "here's what's broken."

**The audience**: Dorian Dargan (CEO, ex-Apple Vision Pro avatar designer) and Jim Winkens (CTO, ex-DeepMind). The bar is high. Craft over credentials.

---

## Concept Before Code

**DO NOT start building until the concept is clear.** This means:
1. `docs/brand-analysis.md` is filled in (what does Doji look/feel like?)
2. `docs/design-reference.md` is filled in (what visual language is the demo matching?)
3. The demo angle in `docs/IDEAS.md` has been discussed and refined with Beckham
4. There's a clear spec: target user, core interaction, connection to Doji's product, and the "aha moment"

Building before this is done wastes time. We learned this the hard way on the portfolio project (built 6 prototypes before having a concept, all rejected).

---

## How We Work

- **Match Doji's design language.** This demo needs to feel native to their product, not like an external prototype. Every visual decision should reference what we know about their app.
- **Polish matters more than scope.** One beautifully crafted interaction > three half-polished flows. The job posting literally says they care more about interaction quality than shipping speed.
- **Don't over-engineer.** Simplest thing that works and looks incredible. No premature abstractions.
- **Verify before advising.** Training data has a cutoff. For library APIs, framework versions, or anything that changes fast — check official docs before giving guidance.

---

## Gotchas Protocol

When you encounter something unexpected — a bug, library quirk, CSS gotcha, config issue — **add it to `docs/gotchas.md` immediately** before moving on.

Use this format:
```markdown
### [Short title]
**Symptom:** What you observed
**Cause:** Root cause
**Fix:** What solved it
**Avoid:** How to not hit this again
```

---

## Communication

- Concise. No preamble.
- When blocked, say what's blocking you and what you need.
- Don't add features that weren't asked for.
- Don't summarize what you just did — the diff speaks for itself.

---

## Rules

### 2-Strike Rule
If an approach doesn't work after 2 iterations, **stop and propose an alternative**. Don't keep polishing a fundamentally constrained setup. Suggest the pivot — don't wait for the user to make the call.

### Investigate Before Coding
- Before attempting to animate or modify anything, ALWAYS understand the structure first.
- Log dimensions, inspect components, verify assumptions BEFORE writing code.
- One investigation round saves five guess-and-check rounds.

### CSS Debugging Rule
When a CSS/style fix has no effect, grep ALL stylesheets for the selector before re-editing. Build tools (Vite, CRA) often generate duplicate global files (`index.css` + `App.css`). More generally: when any fix "doesn't work," verify you're editing the right file first.

---

## Agent Incident Log

Log mistakes here so future agents don't repeat them. Format:

```
### [Date] — Short description
**What happened**: What went wrong
**Root cause**: Why it happened
**Fix**: How to avoid it
```

### 2026-03-31 — Cited stale info as fact, dismissed user's firsthand knowledge
**What happened**: Told user Midjourney can't generate video. User was literally looking at the video feature in the Midjourney UI. Doubled down with "research" from outdated sources.
**Root cause**: Sub-agent research returned pre-June-2025 info. Presented it as current fact instead of flagging uncertainty.
**Fix**: When the user says something exists and you can't verify it, say "I couldn't find docs for this — what does the interface look like?" Never contradict the user's direct observation with stale search results. No guessing. Every claim needs a source.

### 2026-03-31 — AnimatePresence unmount timing broke merge transition
**What happened**: MergeTransition queried DOM for shape elements that AnimatePresence had already removed. The entire animation silently skipped (shapes.length === 0 → onComplete()).
**Root cause**: Assumed sibling components would coexist in the DOM during transitions. AnimatePresence removes exiting components before or during the entering component's mount.
**Fix**: Snapshot getBoundingClientRect data in the click handler BEFORE any state changes. Pass as props. Move MergeTransition outside AnimatePresence.

### 2026-03-31 — Multiple rounds of "fix one bug, create another" on z-index layering
**What happened**: Added a white background div to MergeTransition (z-23) that blocked the loading screen (z-10) from being visible during iris retraction. Took 3 iterations to diagnose.
**Root cause**: Built layers incrementally without mapping the full z-index stack. Each fix introduced a new layering conflict.
**Fix**: Before building multi-layer transitions, write out the complete z-index map and what each layer should show/hide at each phase. Document it in the plan. Verify with Playwright screenshots at each phase boundary.

### 2026-03-31 — Built loading screen with wrong approach, had to rebuild multiple times
**What happened**: First built with blurred photo ring, then face morph with crossfade, then with StyleGAN (impossible without ML), then scan bar wipe. Each pivot required significant rework.
**Root cause**: Started building before the concept was fully locked. Concept evolved through conversation but code was already written for earlier versions.
**Fix**: Lock the concept in a wireframe/prototype FIRST. Get explicit user approval on the prototype. Only then build in React. The HTML prototype at `docs/wireframes/transition_merge_prototype/` is the source of truth — match it exactly.

### 2026-04-03 — Sub-agent copied duplicate images due to off-by-one in source folder mapping
**What happened**: Delegated image copying to a sub-agent. It was told "skip first image (reference), copy the rest." The _2 file was identical to the primary for every product. The last image in each folder was missed entirely.
**Root cause**: Two compounding errors: (1) Sub-agent didn't verify its work — no hash comparison or visual check. (2) When I re-did it myself, zsh 1-based array indexing caused the same off-by-one (started at index 2 thinking it was 0-based, but in zsh index 2 = the primary, not the third file).
**Fix**: When copying files from source to destination with a skip pattern: (1) ALWAYS verify with `md5` that copied files differ from originals. (2) Remember zsh arrays are 1-indexed — `arr[1]` is first element. (3) Don't delegate file operations with skip logic to sub-agents without explicit verification steps. Do it in one script you can debug directly.

---

## Skills & Tools

### Mermaid Diagrams (`/mermaid-diagram`)
Skill: `.claude/skills/mermaid-diagram/SKILL.md`
Script: `scripts/mermaid-diagram.ts`
Output: `scripts/output/diagrams/` (SVG + TXT) and `scripts/output/markdown/` (MD source)

Invoke with `/mermaid-diagram` or ask for a diagram. Requires `beautiful-mermaid` (installed). Use for architecture diagrams, pipeline flows, sequence diagrams.

### Playwright Screenshots
For visual QA, write one-off scripts inline — don't persist them in the repo. Take screenshot, compare to reference, delete script.

---

## Persistence Rules

All persistent information goes in **this file (CLAUDE.md)** or in the `docs/` folder. Those are the only places future agents will look.
