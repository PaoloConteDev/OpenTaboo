import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { C } from '../theme';
import { LANGUAGES, Language, TranslationValue, resolveInitialLanguage, translate } from './index';

export const LANGUAGE_STORAGE_KEY = '@open-taboo/language-v1';
type LanguageContextValue = {
  language: Language;
  locale: string;
  setLanguage: (value: Language) => void;
  languageStorageError: boolean;
  t: (key: string, ...values: TranslationValue[]) => string;
};
const Context = createContext<LanguageContextValue | null>(null);
function systemLocale(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return undefined;
  }
}
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<Language>(() =>
    resolveInitialLanguage(null, systemLocale()),
  );
  const [loaded, setLoaded] = useState(false);
  const [languageStorageError, setStorageError] = useState(false);
  const writes = useRef<Promise<void>>(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((saved) => {
        if (active) updateLanguage(resolveInitialLanguage(saved, systemLocale()));
      })
      .catch(() => {
        if (active) setStorageError(true);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const setLanguage = useCallback((value: Language) => {
    updateLanguage(value);
    writes.current = writes.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, value));
    void writes.current.then(() => setStorageError(false)).catch(() => setStorageError(true));
  }, []);
  const value = useMemo(
    () => ({
      language,
      locale: LANGUAGES.find((item) => item.id === language)!.locale,
      setLanguage,
      languageStorageError,
      t: (key: string, ...values: TranslationValue[]) => translate(language, key, ...values),
    }),
    [language, setLanguage, languageStorageError],
  );
  if (!loaded)
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={C.orange} />
      </View>
    );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useI18n() {
  const value = useContext(Context);
  if (!value) throw new Error('useI18n requires LanguageProvider');
  return value;
}
