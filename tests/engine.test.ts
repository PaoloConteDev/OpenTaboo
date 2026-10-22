import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, DECKS } from '../src/data/cards';
import {
  DEFAULT_SETTINGS,
  Game,
  activeTeam,
  commitTurn,
  createGame,
  currentRound,
  normalizeSettings,
  recordAnswer,
  restoreGame,
  shuffle,
  skipsLeft,
  turnPoints,
} from '../src/game/engine';
const playing = (overrides = {}) => ({
  ...createGame({ ...DEFAULT_SETTINGS, ...overrides }),
  phase: 'playing' as const,
});
test('1800 unique Italian cards, 300 per deck, each with five distinct forbidden words', () => {
  assert.equal(CARDS.length, 1800);
  assert.equal(new Set(CARDS.map((c) => c.id)).size, 1800);
  assert.equal(
    new Set(CARDS.map((c) => c.word.toLocaleLowerCase('it').normalize('NFKC').trim())).size,
    1800,
  );
  for (const card of CARDS) {
    assert.equal(card.forbidden.length, 5, card.word);
    assert.equal(new Set(card.forbidden.map((w) => w.toLocaleLowerCase('it'))).size, 5);
    assert.ok(
      card.forbidden.every(
        (w) =>
          w.trim().length > 0 && w.toLocaleLowerCase('it') !== card.word.toLocaleLowerCase('it'),
      ),
      card.word,
    );
  }
  for (const deck of DECKS) assert.equal(CARDS.filter((c) => c.deck === deck.id).length, 300);
});
test('selected decks only and no repeats before exhaustion', () => {
  let game = playing({ decks: ['natura', 'extra'], maxSkips: -1 });
  const seen = new Set();
  for (let i = 0; i < 600; i++) {
    const cardId = game.queue[game.cursor];
    assert.ok(cardId?.startsWith('natura') || cardId?.startsWith('extra'));
    assert.ok(!seen.has(cardId));
    seen.add(cardId);
    game = recordAnswer(game, 'correct') as typeof game;
  }
  assert.equal(seen.size, 600);
  assert.equal(game.cursor, 0);
});
test('shuffle does not mutate the source and preserves all values', () => {
  const source = [1, 2, 3, 4];
  const result = shuffle(source, () => 0.5);
  assert.deepEqual(source, [1, 2, 3, 4]);
  assert.deepEqual([...result].sort(), source);
});

test('legacy 40-card decks expand on restore without losing the current card or progress', () => {
  const game = playing({ decks: ['classico', 'extra'] });
  const legacyQueue = game.queue.filter((id) => Number(id.split('-').at(-1)) <= 40);
  const saved: Game = {
    ...game,
    queue: legacyQueue,
    cursor: 7,
    remainingMs: 12345,
    entries: [{ cardId: legacyQueue[0]!, outcome: 'correct' }],
  };
  const restored = restoreGame(saved)!;
  assert.equal(legacyQueue.length, 80);
  assert.equal(restored.phase, 'paused');
  assert.equal(restored.remainingMs, 12345);
  assert.equal(restored.cursor, 7);
  assert.equal(restored.queue[restored.cursor], saved.queue[saved.cursor]);
  assert.deepEqual(restored.queue.slice(0, 80), legacyQueue);
  assert.deepEqual(restored.entries, saved.entries);
  assert.equal(restored.queue.length, 600);
  assert.equal(new Set(restored.queue).size, 600);
  assert.ok(restored.queue.every((id) => id.startsWith('classico-') || id.startsWith('extra-')));
  assert.equal(turnPoints(restored), 1);
  assert.deepEqual(restoreGame(restored)!.queue, restored.queue);
});
test('correct answers, taboo and skip use configured penalties', () => {
  let game: Game = playing({ penalty: 2, skipPenalty: 1 });
  game = recordAnswer(game, 'correct');
  game = recordAnswer(game, 'correct');
  game = recordAnswer(game, 'taboo');
  game = recordAnswer(game, 'skip');
  assert.equal(turnPoints(game), -1);
  assert.equal(game.teams[0]!.score, 0);
  game = commitTurn({ ...game, phase: 'review' });
  assert.equal(game.teams[0]!.score, -1);
  assert.equal(game.history[0]!.points, -1);
});
test('skip limit blocks extra skips, correct answers remain possible', () => {
  let game: Game = playing({ maxSkips: 3 });
  for (let i = 0; i < 3; i++) game = recordAnswer(game, 'skip');
  assert.equal(skipsLeft(game), 0);
  assert.equal(recordAnswer(game, 'skip'), game);
  assert.equal(recordAnswer(game, 'correct').entries.length, 4);
});
test('unlimited and zero skip modes', () => {
  assert.equal(skipsLeft(playing({ maxSkips: -1 })), Infinity);
  const game = playing({ maxSkips: 0 });
  assert.equal(recordAnswer(game, 'skip'), game);
});
test('answers cannot be recorded outside a live turn or after expiry', () => {
  const g = playing();
  for (const phase of ['ready', 'paused', 'review', 'finished', 'countdown'] as const) {
    const next = { ...g, phase };
    assert.equal(recordAnswer(next, 'correct'), next);
  }
  const expired = { ...g, remainingMs: 0 };
  assert.equal(recordAnswer(expired, 'correct'), expired);
});
test('equal turn counts and final scores for 2, 3 and 4 teams', () => {
  for (const teamCount of [2, 3, 4]) {
    let game: Game = createGame({ ...DEFAULT_SETTINGS, teamCount, rounds: 3 });
    for (let turn = 0; turn < teamCount * 3; turn++) {
      assert.equal(activeTeam(game), turn % teamCount);
      assert.equal(currentRound(game), Math.floor(turn / teamCount) + 1);
      game = recordAnswer({ ...game, phase: 'playing' }, 'correct');
      game = commitTurn({ ...game, phase: 'review' });
    }
    assert.equal(game.phase, 'finished');
    assert.ok(game.teams.every((t) => t.score === 3));
    assert.equal(game.history.length, teamCount * 3);
  }
});
test('commit is idempotent outside review and resets turn state', () => {
  let g: Game = playing();
  assert.equal(commitTurn(g), g);
  g = commitTurn({ ...recordAnswer(g, 'correct'), phase: 'review' });
  assert.equal(g.entries.length, 0);
  assert.equal(g.remainingMs, DEFAULT_SETTINGS.seconds * 1000);
  assert.equal(commitTurn(g), g);
});
test('the unfinished visible card is discarded before the next team', () => {
  const g = playing();
  const visible = g.queue[g.cursor];
  const next = commitTurn({ ...g, phase: 'review' });
  assert.notEqual(next.queue[next.cursor], visible);
  assert.equal(next.entries.length, 0);
  assert.equal(next.teams[0]!.score, 0);
});
test('review correction changes score before committing', () => {
  let g: Game = recordAnswer(playing(), 'taboo');
  g = { ...g, phase: 'review', entries: g.entries.map((e) => ({ ...e, outcome: 'correct' })) };
  assert.equal(commitTurn(g).teams[0]!.score, 1);
});
test('restoring an active game pauses timer and hides card', () => {
  const saved = { ...playing(), remainingMs: 12345 };
  const restored = restoreGame(JSON.parse(JSON.stringify(saved)));
  assert.equal(restored?.phase, 'paused');
  assert.equal(restored?.remainingMs, 12345);
  assert.equal(restoreGame({ ...saved, phase: 'countdown' })?.phase, 'ready');
  assert.equal(restoreGame({ ...saved, remainingMs: 0 })?.phase, 'review');
});
test('corrupt saved games are rejected', () => {
  const game = playing();
  for (const corrupt of [
    null,
    {},
    { ...game, queue: ['missing'] },
    { ...game, cursor: -1 },
    { ...game, teams: [] },
    { ...game, remainingMs: NaN },
    { ...game, history: [{ team: 40, entries: [], points: 0 }] },
    { ...game, entries: [{ cardId: game.queue[0], outcome: 'oops' }] },
  ])
    assert.equal(restoreGame(corrupt), null);
});
test('unsafe settings are normalized to supported values', () => {
  const settings = normalizeSettings({
    teamCount: 8,
    names: ['', '   ', 'A'.repeat(90)],
    seconds: -30,
    decks: [],
  });
  assert.equal(settings.teamCount, 2);
  assert.equal(settings.seconds, 60);
  assert.deepEqual(settings.decks, ['classico']);
  assert.equal(settings.names[0], DEFAULT_SETTINGS.names[0]);
  assert.equal(settings.names[2]!.length, 20);
});
