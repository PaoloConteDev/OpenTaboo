import { CARDS, Card, DECKS, DeckId } from './cards';
import { LANGUAGES, Language } from '../i18n';

export type CustomDeck = {
  id: `custom-${string}`;
  name: string;
  color: string;
  language: Language;
  cards: Card[];
};
export const DECK_COLORS = ['#FFB64C', '#FF817C', '#A3D7B4', '#B6A1EF', '#8CCEE1', '#F1A8CB'];
export const newCustomId = (): `custom-${string}` =>
  `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

export function validCardWords(word: string, forbidden: readonly string[]): boolean {
  const words = [word, ...forbidden].map((value) => value.trim().normalize('NFC').toLowerCase());
  return (
    forbidden.length === 5 &&
    words.every((value) => value.length > 0 && value.length <= 60) &&
    new Set(words).size === 6
  );
}

// Validate persisted user content before it can enter the game pool.
export function normalizeCustomDecks(value: unknown): CustomDeck[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  const cardIds = new Set<string>();
  return value.flatMap((deck): CustomDeck[] => {
    if (
      !deck ||
      typeof deck !== 'object' ||
      typeof deck.id !== 'string' ||
      !/^custom-[a-z0-9-]+$/.test(deck.id) ||
      ids.has(deck.id) ||
      typeof deck.name !== 'string' ||
      !deck.name.trim() ||
      typeof deck.color !== 'string' ||
      !/^#[a-f0-9]{6}$/i.test(deck.color) ||
      !LANGUAGES.some((item) => item.id === deck.language) ||
      !Array.isArray(deck.cards)
    )
      return [];
    ids.add(deck.id);
    const cards = deck.cards.flatMap((card: Card): Card[] => {
      if (
        !card ||
        typeof card.id !== 'string' ||
        !card.id.startsWith(`${deck.id}/`) ||
        cardIds.has(card.id) ||
        typeof card.word !== 'string' ||
        !Array.isArray(card.forbidden) ||
        !card.forbidden.every((word) => typeof word === 'string') ||
        !validCardWords(card.word, card.forbidden)
      )
        return [];
      cardIds.add(card.id);
      return [
        {
          id: card.id,
          deck: deck.id,
          word: card.word.trim(),
          forbidden: card.forbidden.map((word) => word.trim()) as Card['forbidden'],
        },
      ];
    });
    return [
      {
        id: deck.id,
        name: deck.name.trim().slice(0, 40),
        color: deck.color,
        language: deck.language,
        cards,
      },
    ];
  });
}

export function availableDecks(customDecks: readonly CustomDeck[], language?: Language) {
  return [
    ...DECKS.map((deck) => ({
      ...deck,
      custom: false,
      count: CARDS.filter((card) => card.deck === deck.id).length,
    })),
    ...customDecks
      .filter((deck) => !language || deck.language === language)
      .map((deck) => ({
        ...deck,
        subtitle: 'Mazzo personalizzato',
        icon: 'layers',
        custom: true,
        count: deck.cards.length,
      })),
  ];
}

export function deckCards(customDecks: readonly CustomDeck[], language?: Language): Card[] {
  return [
    ...CARDS,
    ...customDecks
      .filter((deck) => !language || deck.language === language)
      .flatMap((deck) => deck.cards),
  ];
}

export function playableDeckIds(
  customDecks: readonly CustomDeck[],
  language?: Language,
): Set<DeckId> {
  return new Set(deckCards(customDecks, language).map((card) => card.deck));
}
