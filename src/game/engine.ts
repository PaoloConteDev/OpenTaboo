import { CARDS, CARD_MAP, DeckId } from '../data/cards';

export type Outcome = 'correct' | 'taboo' | 'skip';
export type Phase = 'ready' | 'countdown' | 'playing' | 'paused' | 'review' | 'finished';
export type Settings = {
  teamCount: number;
  names: string[];
  seconds: number;
  rounds: number;
  penalty: number;
  skipPenalty: number;
  maxSkips: number;
  decks: DeckId[];
  sound: boolean;
  haptics: boolean;
};
export type Entry = { cardId: string; outcome: Outcome };
export type Turn = { team: number; round: number; entries: Entry[]; points: number };
export type Game = {
  version: 1;
  settings: Settings;
  phase: Phase;
  teams: { name: string; score: number }[];
  turn: number;
  queue: string[];
  cursor: number;
  entries: Entry[];
  history: Turn[];
  remainingMs: number;
};
export const DEFAULT_SETTINGS: Settings = {
  teamCount: 2,
  names: ['I Corallo', 'I Viola', 'I Sole', 'I Menta'],
  seconds: 60,
  rounds: 3,
  penalty: 1,
  skipPenalty: 0,
  maxSkips: 3,
  decks: ['classico'],
  sound: true,
  haptics: true,
};

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
export function normalizeSettings(input: Partial<Settings>): Settings {
  const choose = (value: unknown, options: number[], fallback: number) =>
    options.includes(value as number) ? (value as number) : fallback;
  return {
    teamCount: choose(input.teamCount, [2, 3, 4], 2),
    names: DEFAULT_SETTINGS.names.map((fallback, i) =>
      typeof input.names?.[i] === 'string'
        ? input.names[i]!.trim().slice(0, 20) || fallback
        : fallback,
    ),
    seconds: choose(input.seconds, [30, 45, 60, 90, 120], 60),
    rounds: choose(input.rounds, [1, 3, 5, 7], 3),
    penalty: choose(input.penalty, [0, 1, 2], 1),
    skipPenalty: choose(input.skipPenalty, [0, 1], 0),
    maxSkips: choose(input.maxSkips, [0, 3, 5, -1], 3),
    decks:
      Array.isArray(input.decks) && input.decks.some((id) => CARDS.some((c) => c.deck === id))
        ? [...new Set(input.decks.filter((id) => CARDS.some((c) => c.deck === id)))]
        : ['classico'],
    sound: typeof input.sound === 'boolean' ? input.sound : true,
    haptics: typeof input.haptics === 'boolean' ? input.haptics : true,
  };
}
export function createGame(settings: Settings): Game {
  const safe = normalizeSettings(settings);
  return {
    version: 1,
    settings: safe,
    phase: 'ready',
    teams: safe.names.slice(0, safe.teamCount).map((name) => ({ name, score: 0 })),
    turn: 0,
    queue: shuffle(CARDS.filter((c) => safe.decks.includes(c.deck)).map((c) => c.id)),
    cursor: 0,
    entries: [],
    history: [],
    remainingMs: safe.seconds * 1000,
  };
}
export const activeTeam = (game: Game) => game.turn % game.teams.length;
export const currentRound = (game: Game) => Math.floor(game.turn / game.teams.length) + 1;
export const pointsFor = (outcome: Outcome, settings: Settings) =>
  outcome === 'correct' ? 1 : outcome === 'taboo' ? -settings.penalty : -settings.skipPenalty;
export const turnPoints = (game: Game) =>
  game.entries.reduce((sum, entry) => sum + pointsFor(entry.outcome, game.settings), 0);
export const skipsLeft = (game: Game) =>
  game.settings.maxSkips === -1
    ? Infinity
    : Math.max(0, game.settings.maxSkips - game.entries.filter((e) => e.outcome === 'skip').length);
function nextCard(game: Game) {
  let queue = game.queue,
    cursor = game.cursor + 1;
  if (cursor >= queue.length) {
    queue = shuffle(queue);
    if (queue.length > 1 && queue[0] === game.queue[game.cursor])
      [queue[0], queue[1]] = [queue[1]!, queue[0]!];
    cursor = 0;
  }
  return { queue, cursor };
}
export function recordAnswer(game: Game, outcome: Outcome): Game {
  if (
    game.phase !== 'playing' ||
    game.remainingMs <= 0 ||
    (outcome === 'skip' && skipsLeft(game) === 0)
  )
    return game;
  const cardId = game.queue[game.cursor];
  if (!cardId) return game;
  const { queue, cursor } = nextCard(game);
  return { ...game, queue, cursor, entries: [...game.entries, { cardId, outcome }] };
}
export function commitTurn(game: Game): Game {
  if (game.phase !== 'review') return game;
  const team = activeTeam(game),
    points = turnPoints(game);
  const teams = game.teams.map((t, i) => (i === team ? { ...t, score: t.score + points } : t));
  const turn = game.turn + 1;
  // The unresolved card was visible to the opponents: discard it before the next team.
  return {
    ...game,
    ...nextCard(game),
    teams,
    turn,
    phase: turn >= teams.length * game.settings.rounds ? 'finished' : 'ready',
    entries: [],
    remainingMs: game.settings.seconds * 1000,
    history: [...game.history, { team, round: currentRound(game), entries: game.entries, points }],
  };
}
export function restoreGame(value: unknown): Game | null {
  if (!value || typeof value !== 'object') return null;
  const g = value as Game;
  if (
    g.version !== 1 ||
    !g.settings ||
    !['ready', 'countdown', 'playing', 'paused', 'review', 'finished'].includes(g.phase)
  )
    return null;
  if (
    !Array.isArray(g.teams) ||
    g.teams.length < 2 ||
    g.teams.length > 4 ||
    !g.teams.every((t) => typeof t.name === 'string' && Number.isFinite(t.score))
  )
    return null;
  if (
    !Array.isArray(g.queue) ||
    !g.queue.length ||
    !g.queue.every((id) => CARD_MAP.has(id)) ||
    !Number.isInteger(g.cursor) ||
    g.cursor < 0 ||
    g.cursor >= g.queue.length
  )
    return null;
  const validEntry = (e: Entry) =>
    e && CARD_MAP.has(e.cardId) && ['correct', 'taboo', 'skip'].includes(e.outcome);
  if (
    !Array.isArray(g.entries) ||
    !g.entries.every(validEntry) ||
    !Array.isArray(g.history) ||
    !g.history.every(
      (t) =>
        t &&
        Number.isInteger(t.team) &&
        t.team >= 0 &&
        t.team < g.teams.length &&
        Number.isFinite(t.points) &&
        Array.isArray(t.entries) &&
        t.entries.every(validEntry),
    )
  )
    return null;
  if (
    !Number.isFinite(g.remainingMs) ||
    g.remainingMs < 0 ||
    !Number.isInteger(g.turn) ||
    g.turn < 0
  )
    return null;
  const settings = normalizeSettings(g.settings);
  if (
    settings.teamCount !== g.teams.length ||
    g.turn > g.teams.length * settings.rounds ||
    g.history.length !== g.turn ||
    (g.phase === 'finished') !== (g.turn === g.teams.length * settings.rounds)
  )
    return null;
  const phase =
    g.phase === 'playing'
      ? g.remainingMs > 0
        ? 'paused'
        : 'review'
      : g.phase === 'countdown'
        ? 'ready'
        : g.phase;
  // Extend a legacy saved deck without moving its cursor or changing its visible card.
  const queuedIds = new Set(g.queue);
  const addedIds = CARDS.filter(
    (card) => settings.decks.includes(card.deck) && !queuedIds.has(card.id),
  ).map((card) => card.id);
  const queue = addedIds.length ? [...g.queue, ...shuffle(addedIds)] : g.queue;
  return {
    ...g,
    settings,
    queue,
    phase,
    remainingMs: Math.min(g.remainingMs, settings.seconds * 1000),
  };
}
