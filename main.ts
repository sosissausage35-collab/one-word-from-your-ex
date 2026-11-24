// One Word From Your Ex — entry for the make.fun bounty
// "u-brave-eagle-12-one-word-from-your-ex-cfd97ba2".
//
// The program picks exactly ONE word that describes "your ex" and writes it
// to $MAKEFUN_OUTPUT_DIR/entry.txt (falling back to /output/entry.txt).
//
// How the word is chosen
// -----------------------
// A good answer has to do five things at once, in this priority order:
//
//   1. realness     — a word people genuinely use, not a coined term
//   2. humour       — funny standing completely alone, with no setup
//   3. truth        — true to one recognisable ex habit, not a generic insult
//   4. freshness    — not the first cliché that comes to mind
//   5. universality — understood with zero explanation, by anyone
//
// Each candidate below is scored 0-10 on each criterion and combined with
// the weights { realness: 0.30, humour: 0.25, truth: 0.25,
// freshness: 0.10, universality: 0.10 }. The highest scorer wins; ties are
// broken deterministically by shorter word, then alphabetically.
//
// The shortlist deliberately avoids the first clichés ("toxic", "crazy",
// "liar", "cheater", "ghost", "narcissist"): those are the words everyone
// reaches for first, so they lose on freshness and say nothing specific
// about any one ex. The candidates below are all built around one concrete,
// recognisable ex behaviour instead — the ex who keeps coming back, the ex
// who reads your message and never replies, the ex who unblocks you at 2am.
//
// The selection is fully deterministic: no randomness, no clock, no
// environment dependence. The same run always writes the same word.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Scores = {
  realness: number;
  humour: number;
  truth: number;
  freshness: number;
  universality: number;
};

type Candidate = {
  word: string;
  scores: Scores;
  // One line on why this word scores the way it does.
  note: string;
};

const WEIGHTS: Scores = {
  realness: 0.3,
  humour: 0.25,
  truth: 0.25,
  freshness: 0.1,
  universality: 0.1,
};

const CANDIDATES: Candidate[] = [
  {
    word: "boomerang",
    scores: { realness: 10, humour: 9, truth: 9, freshness: 7, universality: 9 },
    // No matter how far you throw them, they always come back.
    note: "The ex who always comes back: throw them away and they return on their own. Visual, funny, and instantly understood.",
  },
  {
    word: "seen",
    scores: { realness: 10, humour: 9, truth: 8, freshness: 6, universality: 10 },
    // The read receipt: they saw it, and that was the whole reply.
    note: "One word for the read receipt — they saw the message and answered with silence. Punchy, but 'seen' is a familiar joke by now.",
  },
  {
    word: "callback",
    scores: { realness: 10, humour: 8, truth: 8, freshness: 8, universality: 8 },
    // The ex who rings months later as if no time passed at all.
    note: "The late-night 'hey, u up?' call, months after the breakup. Fresh angle on the returning ex, slightly less visual than the winner.",
  },
  {
    word: "unblocked",
    scores: { realness: 10, humour: 8, truth: 7, freshness: 8, universality: 9 },
    // Blocked on Monday, unblocked on Friday, texting by Saturday.
    note: "The 2am unblock: they lift the block just to start talking again. True and modern, but it describes an action, not the person.",
  },
  {
    word: "archived",
    scores: { realness: 10, humour: 8, truth: 7, freshness: 8, universality: 8 },
    // Filed away with the old chats, pulled out whenever they feel lonely.
    note: "You got archived, not deleted — kept on a shelf and dusted off when convenient. Clever, but needs a beat to land.",
  },
  {
    word: "unread",
    scores: { realness: 10, humour: 7, truth: 8, freshness: 6, universality: 10 },
    // Your messages sit there, delivered, never opened.
    note: "The ex whose replies never arrive. Honest and universal, but flatter than 'seen' — absence is less funny than being ignored on purpose.",
  },
  {
    word: "rerun",
    scores: { realness: 10, humour: 8, truth: 7, freshness: 8, universality: 8 },
    // Same show, same ending, watched again anyway.
    note: "The relationship as a rerun: same plot, same ending, somehow watched twice. Funny, but the TV metaphor is doing most of the work.",
  },
  {
    word: "recurring",
    scores: { realness: 10, humour: 8, truth: 7, freshness: 8, universality: 8 },
    // Like a subscription you forgot to cancel: it just keeps charging you.
    note: "The ex as a subscription that renews itself. Good joke, but 'recurring' alone is abstract until you supply the subscription idea.",
  },
  {
    word: "breadcrumb",
    scores: { realness: 9, humour: 8, truth: 8, freshness: 8, universality: 7 },
    // Just enough attention to keep you following, never a real meal.
    note: "The ex who drops crumbs of attention to keep you around. True to life, but the dating-slang meaning is not universal yet.",
  },
  {
    word: "orbiting",
    scores: { realness: 8, humour: 8, truth: 8, freshness: 9, universality: 6 },
    // Never texts, but watches every story you post.
    note: "The ex who never messages yet watches everything you post. The freshest behaviour on the list, but the term itself still needs explaining.",
  },
  {
    word: "popup",
    scores: { realness: 10, humour: 7, truth: 6, freshness: 8, universality: 8 },
    // Appears out of nowhere, usually when you finally moved on.
    note: "The ex who pops up uninvited, right when you moved on. Fresh and visual, but 'popup' says more about timing than about them.",
  },
  {
    word: "haunting",
    scores: { realness: 10, humour: 6, truth: 7, freshness: 6, universality: 9 },
    // Still there in every song, every street, every notification.
    note: "The ex who lingers like a ghost in ordinary places. Evocative and sad-funny, but closer to melancholy than to a joke.",
  },
];

function weightedScore(scores: Scores): number {
  return (
    scores.realness * WEIGHTS.realness +
    scores.humour * WEIGHTS.humour +
    scores.truth * WEIGHTS.truth +
    scores.freshness * WEIGHTS.freshness +
    scores.universality * WEIGHTS.universality
  );
}

function pickWord(candidates: Candidate[]): string {
  const scored = candidates.map((c) => ({
    word: c.word,
    score: weightedScore(c.scores),
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.word.length !== b.word.length) return a.word.length - b.word.length;
    return a.word < b.word ? -1 : a.word > b.word ? 1 : 0;
  });
  return scored[0].word;
}

function main(): void {
  const word = pickWord(CANDIDATES);

  // Exactly one word: lowercase letters only, no spaces, no punctuation.
  if (!/^[a-z]+$/.test(word)) {
    throw new Error(`selected word is not a single word: ${JSON.stringify(word)}`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), `${word}\n`, "utf8");
}

main();
