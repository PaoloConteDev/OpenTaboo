import { CARDS, DECKS } from '../src/data/cards';
import classico from '../src/data/expansion/classico';
import quotidiano from '../src/data/expansion/quotidiano';
import natura from '../src/data/expansion/natura';
import spettacolo from '../src/data/expansion/spettacolo';
import viaggio from '../src/data/expansion/viaggio';
import extra from '../src/data/expansion/extra';

const expansions = { classico, quotidiano, natura, spettacolo, viaggio, extra };
const normalize = (word: string) =>
  word.toLocaleLowerCase('it').normalize('NFKC').trim().replace(/\s+/g, ' ');
const seen = new Map(
  CARDS.filter((card) => Number(card.id.split('-').at(-1)) <= 40).map((card) => [
    normalize(card.word),
    card.deck,
  ]),
);
let errors = 0;
for (const deck of DECKS) {
  const lines = expansions[deck.id].split('\n');
  console.log(`${deck.id}: ${lines.length} nuove carte, totale ${lines.length + 40}`);
  if (lines.length !== 260) errors++;
  for (const line of lines) {
    const [word, ...forbidden] = line.split('|');
    if (
      forbidden.length !== 5 ||
      new Set(forbidden.map(normalize)).size !== 5 ||
      forbidden.some((f) => normalize(f) === normalize(word!)) ||
      line.includes('  ')
    ) {
      console.log('  RIGA NON VALIDA:', line);
      errors++;
    }
    if (seen.has(normalize(word!))) {
      console.log(`  DUPLICATO: ${word} (già in ${seen.get(normalize(word!))})`);
      errors++;
    }
    seen.set(normalize(word!), deck.id);
  }
}
process.exitCode = errors ? 1 : 0;
