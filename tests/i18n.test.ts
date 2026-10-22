import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, normalizeLanguage, resolveInitialLanguage, translate } from '../src/i18n';
import { MESSAGE_ROWS } from '../src/i18n/messages';
import { CARDS, DECKS } from '../src/data/cards';
import { getCards, getLocalizedCard } from '../src/data/localizedCards';
import { DEFAULT_SETTINGS, createGame, recordAnswer, restoreGame } from '../src/game/engine';

test('five complete interface catalogues have matching interpolation parameters', () => {
  assert.deepEqual(
    LANGUAGES.map((item) => item.id),
    ['it', 'en', 'es', 'de', 'fr'],
  );
  assert.equal(new Set(MESSAGE_ROWS.map((row) => row[0])).size, MESSAGE_ROWS.length);
  for (const row of MESSAGE_ROWS) {
    const parameters = (value: string) =>
      [...new Set([...value.matchAll(/\{\{(\d+)(?:\||\}\})/g)].map((match) => match[1]))].sort();
    for (const value of row) {
      assert.ok(value.trim(), row[0]);
      assert.deepEqual(parameters(value), parameters(row[0]), row[0]);
    }
  }
  assert.equal(normalizeLanguage('de'), 'de');
  assert.equal(normalizeLanguage('invalid'), 'en');
  assert.equal(normalizeLanguage(null), 'en');
});

test('initial language uses the device locale, defaults to English and honours a saved choice', () => {
  for (const locale of ['it-IT', 'it-CH', 'IT_it'])
    assert.equal(resolveInitialLanguage(null, locale), 'it');
  assert.equal(resolveInitialLanguage(null, 'en-US'), 'en');
  assert.equal(resolveInitialLanguage(null, 'es-MX'), 'es');
  assert.equal(resolveInitialLanguage(null, 'de-AT'), 'de');
  assert.equal(resolveInitialLanguage(null, 'fr-CA'), 'fr');
  assert.equal(resolveInitialLanguage(null, 'pt-BR'), 'en');
  assert.equal(resolveInitialLanguage(null, undefined), 'en');
  assert.equal(resolveInitialLanguage('fr', 'it-IT'), 'fr');
  assert.equal(resolveInitialLanguage('invalid', 'de-DE'), 'de');
});

test('interpolation and plural forms follow the selected language', () => {
  assert.equal(translate('en', '{{0}} round', 1), '1 round');
  assert.equal(translate('en', '{{0}} round', 3), '3 rounds');
  assert.equal(translate('de', '{{0}} round', 1), '1 Runde');
  assert.equal(translate('de', '{{0}} round', 3), '3 Runden');
  assert.equal(translate('fr', 'Nome squadra {{0}}', 2), 'Nom de l’équipe 2');
  assert.equal(translate('es', 'Bel turno, {{0}}!', 'Gleetch'), '¡Buen turno, Gleetch!');
  assert.equal(translate('en', 'Gleetch'), 'Gleetch');
});

for (const { id: language } of LANGUAGES) {
  test(`${language}: 300 cards per deck, stable IDs and five distinct forbidden words`, () => {
    const localized = getCards(language);
    assert.equal(localized.length, 1800);
    assert.deepEqual(
      localized.map((card) => card.id),
      CARDS.map((card) => card.id),
    );
    for (const deck of DECKS)
      assert.equal(localized.filter((card) => card.deck === deck.id).length, 300);
    for (const card of localized) {
      assert.equal(card.forbidden.length, 5, card.id);
      const words = [card.word, ...card.forbidden].map((word) =>
        word.trim().normalize('NFC').toLocaleLowerCase(),
      );
      assert.ok(
        words.every((word) => word.length > 0),
        card.id,
      );
      assert.equal(new Set(words).size, 6, `${language} ${card.id}: ${words.join(', ')}`);
      assert.equal(getLocalizedCard(card.id, language), card);
    }
  });
}

test('switching card language preserves the current game and restores old saves', () => {
  let game = createGame({ ...DEFAULT_SETTINGS, names: ['Gleetch', 'Amici', 'Terza', 'Quarta'] });
  game = recordAnswer({ ...game, phase: 'playing' }, 'correct');
  const snapshot = JSON.stringify(game);
  const id = game.queue[game.cursor]!;
  for (const { id: language } of LANGUAGES) assert.equal(getLocalizedCard(id, language).id, id);
  assert.equal(JSON.stringify(game), snapshot);
  const restored = restoreGame(JSON.parse(snapshot))!;
  assert.equal(restored.cursor, game.cursor);
  assert.deepEqual(restored.queue, game.queue);
  assert.deepEqual(restored.entries, game.entries);
  assert.deepEqual(restored.teams, game.teams);
});
