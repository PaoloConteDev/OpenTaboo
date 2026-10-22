import React from 'react';
import { Pressable, Switch, TextInput, View, useWindowDimensions } from 'react-native';
import { Check, Settings2, Users } from 'lucide-react-native';
import { CARDS, DECKS } from '../data/cards';
import { Settings } from '../game/engine';
import { C, FONT, TEAM_COLORS } from '../theme';
import { Button, Choice, DECK_ICONS, SectionHeading, SectionLabel, Txt } from '../components/UI';

export function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        paddingVertical: 18,
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Txt style={{ fontFamily: FONT.medium }}>{title}</Txt>
        <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 19 }}>{description}</Txt>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.line, true: C.purple }}
        thumbColor={value ? C.cream : C.muted}
      />
    </View>
  );
}
export function Setup({
  settings,
  onChange,
  onStart,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  onStart: () => void;
}) {
  const { width } = useWindowDimensions();
  const mobile = width < 800;
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });
  return (
    <View style={{ paddingTop: 32 }}>
      <SectionHeading
        eyebrow="FACCIAMO SQUADRA"
        title="La vostra partita. Le vostre regole."
        subtitle="Bastano pochi tocchi per mettere tutti d’accordo. Forse."
      />
      <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 24, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, width: mobile ? '100%' : undefined, gap: 24 }}>
          <View style={panel}>
            <View style={labelRow}>
              <Users size={19} color={C.coral} />
              <Txt style={panelTitle}>Chi c’è in squadra?</Txt>
            </View>
            <Choice
              label="Numero di squadre"
              values={[2, 3, 4].map((n) => ({ value: n, label: `${n} squadre` }))}
              selected={settings.teamCount}
              onChange={(v) => update('teamCount', v)}
            />
            <View style={{ gap: 12, marginTop: 20 }}>
              {settings.names.slice(0, settings.teamCount).map((name, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: `${TEAM_COLORS[i]}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Txt style={{ color: TEAM_COLORS[i], fontFamily: FONT.bold }}>
                      {String(i + 1).padStart(2, '0')}
                    </Txt>
                  </View>
                  <TextInput
                    accessibilityLabel={`Nome squadra ${i + 1}`}
                    maxLength={20}
                    value={name}
                    onChangeText={(text) =>
                      update(
                        'names',
                        settings.names.map((v, n) => (n === i ? text : v)),
                      )
                    }
                    selectTextOnFocus
                    placeholder={`Squadra ${i + 1}`}
                    placeholderTextColor={C.muted}
                    style={{
                      flex: 1,
                      backgroundColor: '#29114860',
                      color: C.text,
                      borderRadius: 11,
                      padding: 13,
                      fontFamily: FONT.medium,
                      fontSize: 15,
                      borderWidth: 1,
                      borderColor: C.line,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={panel}>
            <View style={labelRow}>
              <Settings2 size={19} color={C.orange} />
              <Txt style={panelTitle}>Il ritmo del gioco</Txt>
            </View>
            <Setting label="TEMPO PER TURNO">
              <Choice
                label="Durata turno"
                values={[30, 45, 60, 90, 120].map((n) => ({ value: n, label: `${n}s` }))}
                selected={settings.seconds}
                onChange={(v) => update('seconds', v)}
              />
            </Setting>
            <Setting label="ROUND · UN TURNO PER OGNI SQUADRA">
              <Choice
                label="Round"
                values={[1, 3, 5, 7].map((n) => ({ value: n, label: `${n}` }))}
                selected={settings.rounds}
                onChange={(v) => update('rounds', v)}
              />
            </Setting>
            <Setting label="PENALITÀ PER PAROLA VIETATA">
              <Choice
                label="Penalità Taboo"
                values={[0, 1, 2].map((n) => ({
                  value: n,
                  label: n ? `−${n} ${n === 1 ? 'punto' : 'punti'}` : 'Nessuna',
                }))}
                selected={settings.penalty}
                onChange={(v) => update('penalty', v)}
              />
            </Setting>
            <Setting label="PASSAGGI DISPONIBILI PER TURNO">
              <Choice
                label="Passaggi"
                values={[
                  { value: 0, label: '0' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                  { value: -1, label: 'Illimitati' },
                ]}
                selected={settings.maxSkips}
                onChange={(v) => update('maxSkips', v)}
              />
            </Setting>
            <Setting label="PENALITÀ PER PASSAGGIO">
              <Choice
                label="Penalità passaggio"
                values={[
                  { value: 0, label: 'Nessuna' },
                  { value: 1, label: '−1 punto' },
                ]}
                selected={settings.skipPenalty}
                onChange={(v) => update('skipPenalty', v)}
              />
            </Setting>
          </View>
        </View>
        <View style={{ flex: 0.85, width: mobile ? '100%' : undefined, gap: 24 }}>
          <View style={panel}>
            <Txt style={panelTitle}>Cosa mettiamo nel mazzo?</Txt>
            <Txt style={{ color: C.muted, fontSize: 13, marginTop: 7, marginBottom: 20 }}>
              Scegline almeno uno. Puoi mescolarli tutti.
            </Txt>
            <View style={{ gap: 10 }}>
              {DECKS.map((deck) => {
                const Icon = DECK_ICONS[deck.icon]!;
                const checked = settings.decks.includes(deck.id);
                return (
                  <Pressable
                    key={deck.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={`Mazzo ${deck.name}`}
                    onPress={() => {
                      if (checked && settings.decks.length === 1) return;
                      update(
                        'decks',
                        checked
                          ? settings.decks.filter((id) => id !== deck.id)
                          : [...settings.decks, deck.id],
                      );
                    }}
                    style={{
                      padding: 12,
                      borderWidth: 1,
                      borderColor: checked ? `${deck.color}88` : C.line,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 11,
                      backgroundColor: checked ? `${deck.color}09` : 'transparent',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: `${deck.color}20`,
                        width: 35,
                        height: 35,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color={deck.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt style={{ fontSize: 14, fontFamily: FONT.medium }}>{deck.name}</Txt>
                      <Txt style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>
                        {CARDS.filter((card) => card.deck === deck.id).length} carte
                      </Txt>
                    </View>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        backgroundColor: checked ? deck.color : 'transparent',
                        borderWidth: 1,
                        borderColor: checked ? deck.color : C.line,
                      }}
                    >
                      {checked && <Check size={18} color={C.ink} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <ToggleRow
              title="Effetti sonori"
              description="Un suono per ogni momento del gioco."
              value={settings.sound}
              onChange={(v) => update('sound', v)}
            />
            <ToggleRow
              title="Vibrazione"
              description="Un piccolo feedback, quando serve."
              value={settings.haptics}
              onChange={(v) => update('haptics', v)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#FFB64C10',
              borderColor: '#FFB64C30',
              borderWidth: 1,
              borderRadius: 20,
              padding: 23,
              gap: 17,
            }}
          >
            <SectionLabel style={{ color: C.orange }}>TUTTO PRONTO?</SectionLabel>
            <Txt style={{ fontFamily: FONT.semibold, fontSize: 23 }}>
              {settings.teamCount} squadre. Una bella sfida.
            </Txt>
            <Txt style={{ color: C.muted, fontSize: 14, lineHeight: 23 }}>
              {settings.rounds} {settings.rounds === 1 ? 'round' : 'round'} · {settings.seconds}{' '}
              secondi a turno{'\n'}
              {CARDS.filter((c) => settings.decks.includes(c.deck)).length} carte pronte da
              indovinare
            </Txt>
            <Button title="Inizia la partita" onPress={onStart} />
          </View>
        </View>
      </View>
    </View>
  );
}
function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10, marginTop: 20 }}>
      <SectionLabel style={{ fontSize: 10, letterSpacing: 1.1 }}>{label}</SectionLabel>
      {children}
    </View>
  );
}
const panel = {
  backgroundColor: C.panel,
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 21,
  padding: 23,
} as const;
const panelTitle = { fontFamily: FONT.semibold, fontSize: 21 } as const;
const labelRow = { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 20 } as const;
