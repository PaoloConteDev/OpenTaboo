import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CustomDeck,
  availableDecks,
  deckCards,
  normalizeCustomDecks,
  validCardWords,
} from '../src/data/customDecks';
import {
  DEFAULT_SETTINGS,
  Game,
  commitTurn,
  createGame,
  normalizeSettings,
  recordAnswer,
  restoreGame,
} from '../src/game/engine';

const deck = (id = 'custom-first', language: CustomDeck['language'] = 'it'): CustomDeck => ({
  id: id as CustomDeck['id'],
  name: 'Il mio mazzo',
  color: '#8CCEE1',
  language,
  cards: [1, 2].map((n) => ({
    id: `${id}/${n}`,
    deck: id as CustomDeck['id'],
    word: `Parola ${n}`,
    forbidden: ['Uno', 'Due', 'Tre', 'Quattro', 'Cinque'],
  })),
});

test('multiple custom decks are scoped to their language and empty decks cannot enter a game', () => {
  const italian = deck(),
    second = deck('custom-second'),
    english = deck('custom-english', 'en');
  const empty = { ...deck('custom-empty'), cards: [] };
  const customDecks = [italian, second, english, empty];
  assert.deepEqual(
    availableDecks(customDecks, 'it')
      .filter((item) => item.custom)
      .map((item) => item.id),
    [italian.id, second.id, empty.id],
  );
  assert.equal(deckCards(customDecks, 'en').length, 1802);
  const settings = { ...DEFAULT_SETTINGS, decks: [italian.id, second.id, english.id, empty.id] };
  assert.deepEqual(normalizeSettings(settings, customDecks, 'it').decks, [italian.id, second.id]);
  assert.deepEqual(createGame(settings, customDecks, 'en').settings.decks, [english.id]);
  assert.deepEqual(normalizeSettings({ ...settings, decks: [empty.id] }, customDecks, 'it').decks, [
    'classico',
  ]);
});

test('built-in and multiple custom decks mix without repeats before exhaustion', () => {
  const customDecks = [deck(), deck('custom-second')];
  let game = {
    ...createGame(
      { ...DEFAULT_SETTINGS, decks: ['natura', ...customDecks.map((item) => item.id)] },
      customDecks,
      'it',
    ),
    phase: 'playing' as const,
  };
  const expected = new Set(
    deckCards(customDecks)
      .filter((card) => game.settings.decks.includes(card.deck))
      .map((card) => card.id),
  );
  const seen = new Set<string>();
  for (let i = 0; i < 304; i++) {
    const id = game.queue[game.cursor]!;
    assert.ok(!seen.has(id));
    seen.add(id);
    game = recordAnswer(game, 'correct') as typeof game;
  }
  assert.deepEqual(seen, expected);
  assert.equal(game.cursor, 0);
});

test('custom-only matches score, advance turns and restore from a self-contained snapshot', () => {
  const original = deck();
  let game: Game = createGame(
    { ...DEFAULT_SETTINGS, decks: [original.id], rounds: 1 },
    [original],
    'it',
  );
  original.cards[0]!.word = 'Modificata';
  original.cards.length = 0;
  assert.equal(game.customDecks![0]!.cards[0]!.word, 'Parola 1');
  assert.equal(game.customDecks![0]!.cards.length, 2);
  game = recordAnswer({ ...game, phase: 'playing' }, 'correct');
  const restored = restoreGame(JSON.parse(JSON.stringify(game)))!;
  assert.equal(restored.phase, 'paused');
  assert.deepEqual(restored.queue, game.queue);
  assert.deepEqual(restored.customDecks, game.customDecks);
  assert.deepEqual(restored.entries, game.entries);
  game = commitTurn({ ...restored, phase: 'review' });
  game = recordAnswer({ ...game, phase: 'playing' }, 'taboo');
  game = commitTurn({ ...game, phase: 'review' });
  assert.equal(game.phase, 'finished');
  assert.deepEqual(
    game.teams.map((team) => team.score),
    [1, -1],
  );
  assert.ok(restoreGame(JSON.parse(JSON.stringify(game))));
  assert.equal(createGame(game.settings, game.customDecks).queue.length, 2);
});

test('malformed custom data is rejected and valid persisted fields are normalized', () => {
  const valid = deck();
  assert.deepEqual(normalizeCustomDecks(null), []);
  assert.deepEqual(
    normalizeCustomDecks([
      { ...valid, language: 'xx' },
      { ...valid, color: 'red' },
      { ...valid, id: 'classico' },
    ]),
    [],
  );
  const normalized = normalizeCustomDecks([
    {
      ...valid,
      name: '  My deck  ',
      cards: [
        ...valid.cards,
        valid.cards[0],
        { ...valid.cards[0], id: `${valid.id}/invalid`, forbidden: [''] },
        { ...valid.cards[0], id: 'classico-1' },
      ],
    },
    valid,
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0]!.name, 'My deck');
  assert.equal(normalized[0]!.cards.length, 2);
  assert.equal(
    restoreGame({
      ...createGame({ ...DEFAULT_SETTINGS, decks: [valid.id] }, [valid]),
      customDecks: [],
    }),
    null,
  );
});

test('custom cards require exactly five distinct nonempty forbidden words and a different target', () => {
  assert.equal(
    validCardWords('Pizza', ['Forno', 'Impasto', 'Pomodoro', 'Napoli', 'Mozzarella']),
    true,
  );
  assert.equal(
    validCardWords('  PIZZA ', ['pizza', 'Impasto', 'Pomodoro', 'Napoli', 'Mozzarella']),
    false,
  );
  assert.equal(
    validCardWords('Pizza', ['Forno', 'forno', 'Pomodoro', 'Napoli', 'Mozzarella']),
    false,
  );
  assert.equal(validCardWords('Pizza', ['Forno', '', 'Pomodoro', 'Napoli', 'Mozzarella']), false);
  assert.equal(validCardWords('', ['Forno', 'Impasto', 'Pomodoro', 'Napoli', 'Mozzarella']), false);
  assert.equal(validCardWords('Pizza', ['Forno']), false);
  assert.equal(
    validCardWords('X'.repeat(61), ['Forno', 'Impasto', 'Pomodoro', 'Napoli', 'Mozzarella']),
    false,
  );
});
