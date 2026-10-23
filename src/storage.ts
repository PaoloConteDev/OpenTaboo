import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, Settings, normalizeSettings, restoreGame } from './game/engine';
import { CustomDeck, normalizeCustomDecks } from './data/customDecks';
const KEY = '@open-taboo/save-v1';
let writes: Promise<void> = Promise.resolve();
export async function loadSave(): Promise<{
  settings: Settings;
  game: Game | null;
  customDecks: CustomDeck[];
}> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const customDecks = normalizeCustomDecks(data.customDecks);
      return {
        customDecks,
        settings: normalizeSettings(data.settings ?? {}, customDecks),
        game: restoreGame(data.game),
      };
    }
  } catch {
    /* Missing, corrupted or inaccessible storage: start with safe defaults. */
  }
  return { settings: normalizeSettings({}), game: null, customDecks: [] };
}
export function saveState(
  settings: Settings,
  game: Game | null,
  customDecks: CustomDeck[] = [],
): Promise<void> {
  const serialized = JSON.stringify({ settings, game, customDecks });
  writes = writes.catch(() => {}).then(() => AsyncStorage.setItem(KEY, serialized));
  return writes;
}
