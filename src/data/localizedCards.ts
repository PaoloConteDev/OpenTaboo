import { CARDS, CARD_MAP, Card } from './cards';
import { Language } from '../i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

type LocalizedRows = Record<string, string[]>;
const rows: Record<Exclude<Language, 'it'>, LocalizedRows> = { en, es, de, fr };
const cache = new Map<Language, Map<string, Card>>([['it', CARD_MAP]]);
export function getCards(language: Language): readonly Card[] {
  if (!cache.has(language)) {
    const dictionary = rows[language as Exclude<Language, 'it'>];
    cache.set(
      language,
      new Map(
        CARDS.map((card) => {
          const translated = dictionary[card.id]!;
          return [
            card.id,
            { ...card, word: translated[0]!, forbidden: translated.slice(1) as Card['forbidden'] },
          ];
        }),
      ),
    );
  }
  return [...cache.get(language)!.values()];
}
export function getLocalizedCard(id: string, language: Language): Card {
  if (!cache.has(language)) getCards(language);
  const card = cache.get(language)!.get(id);
  if (!card) throw new Error(`Unknown card ID: ${id}`);
  return card;
}
