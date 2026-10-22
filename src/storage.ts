import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, Settings, normalizeSettings, restoreGame } from './game/engine';
export type MatchRecord = {
  id: number;
  teams: { name: string; score: number }[];
  rounds: number;
  guessed: number;
};
const KEY = '@open-taboo/save-v1';
let writes: Promise<void> = Promise.resolve();
export async function loadSave(): Promise<{
  settings: Settings;
  game: Game | null;
  records: MatchRecord[];
}> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        settings: normalizeSettings(data.settings ?? {}),
        game: restoreGame(data.game),
        records: Array.isArray(data.records)
          ? data.records
              .filter(
                (r: MatchRecord) =>
                  r &&
                  Number.isFinite(r.id) &&
                  Number.isFinite(r.guessed) &&
                  Number.isFinite(r.rounds) &&
                  Array.isArray(r.teams) &&
                  r.teams.length >= 2 &&
                  r.teams.every((t) => typeof t.name === 'string' && Number.isFinite(t.score)),
              )
              .slice(0, 20)
          : [],
      };
    }
  } catch {
    /* Missing, corrupted or inaccessible storage: start with safe defaults. */
  }
  return { settings: normalizeSettings({}), game: null, records: [] };
}
export function saveState(
  settings: Settings,
  game: Game | null,
  records: MatchRecord[],
): Promise<void> {
  const serialized = JSON.stringify({ settings, game, records: records.slice(0, 20) });
  writes = writes.catch(() => {}).then(() => AsyncStorage.setItem(KEY, serialized));
  return writes;
}
