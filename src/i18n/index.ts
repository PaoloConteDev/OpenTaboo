import { MESSAGE_ROWS } from './messages';

export const LANGUAGES = [
  { id: 'it', name: 'Italiano', locale: 'it-IT' },
  { id: 'en', name: 'English', locale: 'en-GB' },
  { id: 'es', name: 'Español', locale: 'es-ES' },
  { id: 'de', name: 'Deutsch', locale: 'de-DE' },
  { id: 'fr', name: 'Français', locale: 'fr-FR' },
] as const;
export type Language = (typeof LANGUAGES)[number]['id'];
export type TranslationValue = string | number;
export function normalizeLanguage(value: unknown): Language {
  const code =
    typeof value === 'string' ? value.replace('_', '-').split('-')[0]?.toLowerCase() : undefined;
  return LANGUAGES.find((item) => item.id === code)?.id ?? 'en';
}
export function resolveInitialLanguage(saved: unknown, systemLocale: unknown): Language {
  const manual = LANGUAGES.find((item) => item.id === saved);
  return manual?.id ?? normalizeLanguage(systemLocale);
}
export const MESSAGES = new Map(MESSAGE_ROWS.map((row) => [row[0], row]));
export function translate(language: Language, key: string, ...values: TranslationValue[]) {
  const column = LANGUAGES.findIndex((item) => item.id === language);
  const message = MESSAGES.get(key)?.[column] ?? key;
  return message
    .replace(/\{\{(\d+)\|([^|{}]*)\|([^{}]*)\}\}/g, (_, index, one, other) =>
      Number(values[Number(index)]) === 1 ? one : other,
    )
    .replace(/\{\{(\d+)\}\}/g, (_, index) => String(values[Number(index)] ?? ''));
}
