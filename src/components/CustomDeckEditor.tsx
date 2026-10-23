import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { Card } from '../data/cards';
import { CustomDeck, DECK_COLORS, newCustomId, validCardWords } from '../data/customDecks';
import { LANGUAGES } from '../i18n';
import { useI18n } from '../i18n/LanguageProvider';
import { C, FONT } from '../theme';
import { Button, IconButton, SectionLabel, Txt } from './UI';

export function CustomDeckEditor({
  deck,
  onSave,
  onDelete,
  onClose,
}: {
  deck?: CustomDeck;
  onSave: (deck: CustomDeck) => void;
  onDelete: (id: CustomDeck['id']) => void;
  onClose: () => void;
}) {
  const { t, language } = useI18n();
  const [id] = useState(() => deck?.id ?? newCustomId());
  const [name, setName] = useState(deck?.name ?? '');
  const [color, setColor] = useState(deck?.color ?? DECK_COLORS[0]!);
  const [cards, setCards] = useState<Card[]>(deck?.cards ?? []);
  const [word, setWord] = useState('');
  const [forbidden, setForbidden] = useState(['', '', '', '', '']);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const hasDraft = !!(word.trim() || forbidden.some((value) => value.trim()));
  const resetCard = () => {
    setWord('');
    setForbidden(['', '', '', '', '']);
    setEditing(null);
    setError('');
  };
  const withDraft = (): Card[] | null => {
    if (!validCardWords(word, forbidden)) {
      setError('Inserisci una parola e cinque parole vietate, tutte diverse.');
      return null;
    }
    const card: Card = {
      id: editing ?? `${id}/${newCustomId()}`,
      deck: id,
      word: word.trim(),
      forbidden: forbidden.map((value) => value.trim()) as Card['forbidden'],
    };
    return editing ? cards.map((item) => (item.id === editing ? card : item)) : [...cards, card];
  };
  const save = () => {
    if (!name.trim()) {
      setError('Scegli un nome per il mazzo.');
      return;
    }
    const next = hasDraft || editing ? withDraft() : cards;
    if (!next) return;
    onSave({ id, name: name.trim(), color, language: deck?.language ?? language, cards: next });
  };
  const field = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    maxLength = 60,
  ) => (
    <View style={{ gap: 7 }}>
      <Txt style={{ fontSize: 13, color: C.muted }}>{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setError('');
        }}
        maxLength={maxLength}
        placeholderTextColor={C.muted}
        style={s.input}
      />
    </View>
  );
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.backdrop}
      >
        <View style={s.modal}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 }}>
            <Txt
              accessibilityRole="header"
              style={{ fontFamily: FONT.bold, fontSize: 23, flex: 1 }}
            >
              {t(deck ? 'Modifica mazzo' : 'Crea un mazzo')}
            </Txt>
            <IconButton icon={X} label={t('Chiudi finestra')} onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 18 }}
          >
            <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>
              {t(
                'Questo mazzo è legato alla lingua: {{0}}',
                LANGUAGES.find((item) => item.id === (deck?.language ?? language))!.name,
              )}
            </Txt>
            {field(t('Nome del mazzo'), name, setName, 40)}
            <SectionLabel>{t('Colore del mazzo')}</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {DECK_COLORS.map((value, index) => (
                <Pressable
                  key={value}
                  accessibilityRole="radio"
                  accessibilityLabel={t('Colore {{0}}', index + 1)}
                  accessibilityState={{ checked: color === value }}
                  onPress={() => setColor(value)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: value,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: color === value ? C.cream : 'transparent',
                  }}
                >
                  {color === value && <Check size={23} color={C.ink} />}
                </Pressable>
              ))}
            </View>
            <View style={{ height: 1, backgroundColor: C.line, marginVertical: 5 }} />
            <Txt style={{ fontFamily: FONT.semibold, fontSize: 20 }}>
              {t('Le tue carte')} · {cards.length}
            </Txt>
            {cards.length === 0 && (
              <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 21 }}>
                {t('Aggiungi almeno una carta per poter giocare con questo mazzo.')}
              </Txt>
            )}
            {cards.map((card) => (
              <View
                key={card.id}
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: editing === card.id ? color : C.line,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt style={{ fontFamily: FONT.semibold }}>{card.word}</Txt>
                  <Txt style={{ fontSize: 12, color: C.muted }}>{card.forbidden.join(' · ')}</Txt>
                </View>
                <IconButton
                  icon={Pencil}
                  label={t('Modifica carta {{0}}', card.word)}
                  onPress={() => {
                    setEditing(card.id);
                    setWord(card.word);
                    setForbidden([...card.forbidden]);
                    setError('');
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label={t('Elimina carta {{0}}', card.word)}
                  onPress={() => {
                    setCards(cards.filter((item) => item.id !== card.id));
                    if (editing === card.id) resetCard();
                  }}
                />
              </View>
            ))}
            <SectionLabel>{t(editing ? 'Modifica carta' : 'Nuova carta')}</SectionLabel>
            {field(t('Parola da indovinare'), word, setWord)}
            {forbidden.map((value, index) => (
              <View key={index}>
                {field(t('Parola vietata {{0}}', index + 1), value, (text) =>
                  setForbidden(forbidden.map((item, i) => (i === index ? text : item))),
                )}
              </View>
            ))}
            <Button
              title={t(editing ? 'Aggiorna carta' : 'Aggiungi carta')}
              icon={editing ? Check : Plus}
              secondary
              onPress={() => {
                const next = withDraft();
                if (next) {
                  setCards(next);
                  resetCard();
                }
              }}
            />
            {(hasDraft || editing) && (
              <Button title={t('Annulla carta')} secondary icon={null} onPress={resetCard} />
            )}
            {error !== '' && (
              <Txt accessibilityRole="alert" style={{ color: C.coral, fontSize: 14 }}>
                {t(error)}
              </Txt>
            )}
            <Button title={t('Salva mazzo')} icon={Check} onPress={save} />
            {deck &&
              (deleting ? (
                <View style={{ gap: 12 }}>
                  <Txt style={{ color: C.coral, lineHeight: 22 }}>
                    {t('Eliminare questo mazzo e tutte le sue carte?')}
                  </Txt>
                  <Button
                    title={t('Conferma eliminazione')}
                    color={C.coral}
                    icon={Trash2}
                    onPress={() => onDelete(id)}
                  />
                  <Button
                    title={t('Annulla')}
                    secondary
                    icon={null}
                    onPress={() => setDeleting(false)}
                  />
                </View>
              ) : (
                <Button
                  title={t('Elimina mazzo')}
                  secondary
                  icon={Trash2}
                  onPress={() => setDeleting(true)}
                />
              ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#130920E8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '95%',
    backgroundColor: C.panel,
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  input: {
    color: C.text,
    fontFamily: FONT.medium,
    fontSize: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 11,
    backgroundColor: '#29114860',
  },
});
