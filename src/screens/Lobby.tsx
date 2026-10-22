import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Heart,
  Layers3,
  Play,
  ShieldCheck,
  Trophy,
  Users,
  WifiOff,
  Zap,
} from 'lucide-react-native';
import { CARDS, DECKS, DeckId } from '../data/cards';
import { Game, Settings } from '../game/engine';
import { C, FONT } from '../theme';
import {
  Button,
  Confetti,
  DECK_ICONS,
  FloatingCards,
  Pill,
  SectionHeading,
  SectionLabel,
  Txt,
} from '../components/UI';

export function Home({
  onStart,
  onRules,
  onDecks,
  onResume,
  game,
  settings,
}: {
  onStart: () => void;
  onRules: () => void;
  onDecks: () => void;
  onResume: () => void;
  game: Game | null;
  settings: Settings;
}) {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  return (
    <View>
      <View style={[s.hero, mobile && { flexDirection: 'column', paddingTop: 28, gap: 0 }]}>
        <View style={[s.heroCopy, mobile && { width: '100%' }]}>
          <Pill>IL PARTY GAME, OVUNQUE TU SIA</Pill>
          <Txt
            accessibilityRole="header"
            style={[s.headline, mobile && { fontSize: 47, lineHeight: 51, marginTop: 24 }]}
          >
            Tutto si può{'\n'}dire.{' '}
            <Txt
              style={[s.headline, { color: C.coral }, mobile && { fontSize: 47, lineHeight: 51 }]}
            >
              O quasi.
            </Txt>
          </Txt>
          <Txt style={[s.heroSub, mobile && { fontSize: 16, lineHeight: 25 }]}>
            Una parola da indovinare. Cinque da evitare.{'\n'}E i tuoi amici che non ti renderanno
            la vita facile.
          </Txt>
          <View style={{ gap: 12, alignSelf: mobile ? 'stretch' : 'flex-start', marginTop: 28 }}>
            <Button
              title={
                game && game.phase !== 'finished' ? 'Riprendi la partita' : 'Che il gioco inizi'
              }
              onPress={game && game.phase !== 'finished' ? onResume : onStart}
              icon={Play}
            />
            {game && game.phase !== 'finished' && (
              <Pressable accessibilityRole="button" onPress={onStart} style={{ padding: 8 }}>
                <Txt style={{ color: C.muted, textAlign: 'center', fontSize: 13 }}>
                  oppure crea una nuova partita
                </Txt>
              </Pressable>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 17, marginTop: 22 }}>
            <View style={s.inline}>
              <Users size={15} color={C.muted} />
              <Txt style={s.micro}>2–4 squadre</Txt>
            </View>
            <View style={s.smallDot} />
            <View style={s.inline}>
              <WifiOff size={15} color={C.muted} />
              <Txt style={s.micro}>100% offline</Txt>
            </View>
            <View style={s.smallDot} />
            <Txt style={s.micro}>100% risate</Txt>
          </View>
        </View>
        <View
          style={[
            s.heroArt,
            mobile && { flex: undefined, width: '100%', height: 374, marginTop: 30 },
          ]}
        >
          <View style={s.orbitOuter} />
          <View style={s.orbitInner} />
          <Confetti />
          <View style={{ transform: [{ scale: mobile ? 0.88 : 1.08 }] }}>
            <FloatingCards />
          </View>
          <View style={s.spark}>
            <Zap size={24} color={C.orange} fill={C.orange} />
          </View>
          <Txt style={s.handNote}>Le parole giuste?{'\n'}Trovale tu.</Txt>
        </View>
      </View>
      <View style={s.featureStrip}>
        {[
          { icon: Layers3, title: `${CARDS.length} carte originali`, sub: 'Tutte in italiano' },
          { icon: Users, title: 'Amici, divano e via', sub: 'Un solo telefono per tutti' },
          { icon: ShieldCheck, title: 'Zero distrazioni', sub: 'Niente account o pubblicità' },
        ].map(({ icon: Icon, title, sub }) => (
          <View key={title} style={[s.feature, mobile && { minWidth: 150, flexBasis: '45%' }]}>
            <View style={s.featureIcon}>
              <Icon size={20} color={C.purple} strokeWidth={1.7} />
            </View>
            <View>
              <Txt style={{ fontSize: 14, fontFamily: FONT.medium }}>{title}</Txt>
              <Txt style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{sub}</Txt>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 39 }}>
        <View style={s.sectionRow}>
          <View>
            <SectionLabel>LA SERATA COMINCIA QUI</SectionLabel>
            <Txt style={s.sectionTitle}>Poche regole. Tante risate.</Txt>
          </View>
          <Pressable accessibilityRole="button" onPress={onRules} style={s.textLink}>
            <Txt style={s.textLinkText}>Come si gioca</Txt>
            <ArrowRight size={16} color={C.purple} />
          </Pressable>
        </View>
        <View style={[s.bottomGrid, mobile && { flexDirection: 'column' }]}>
          <Pressable
            accessibilityRole="button"
            onPress={onStart}
            style={({ pressed }) => [
              s.quickCard,
              { backgroundColor: pressed ? '#4B2B65' : '#40245A' },
            ]}
          >
            <View style={{ flex: 1, gap: 11 }}>
              <View style={s.inline}>
                <Zap size={14} color={C.orange} fill={C.orange} />
                <SectionLabel style={{ color: C.orange }}>LA TUA PROSSIMA PARTITA</SectionLabel>
              </View>
              <Txt style={{ fontFamily: FONT.semibold, fontSize: 23 }}>Raduna la tua squadra.</Txt>
              <Txt style={{ color: C.muted, fontSize: 14, lineHeight: 21 }}>
                Scegli i nomi, imposta il timer e lascia{!mobile ? '\n' : ' '}che siano le parole a
                fare il resto.
              </Txt>
              <View style={[s.inline, { marginTop: 7, gap: 8 }]}>
                {[
                  `${settings.teamCount} squadre`,
                  `${settings.seconds} secondi`,
                  `${settings.rounds} round`,
                ].map((t) => (
                  <View key={t} style={s.miniChip}>
                    <Txt style={{ color: '#D6C5E5', fontSize: 11 }}>{t}</Txt>
                  </View>
                ))}
              </View>
            </View>
            <View style={s.arrowCircle}>
              <ArrowRight size={23} color={C.orange} />
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onDecks}
            style={({ pressed }) => [
              s.deckTeaser,
              { backgroundColor: pressed ? '#523354' : '#482C4E' },
            ]}
          >
            <View style={{ flex: 1, gap: 10 }}>
              <SectionLabel style={{ color: C.coral }}>UN MAZZO PER OGNI MOOD</SectionLabel>
              <Txt style={{ fontFamily: FONT.semibold, fontSize: 23 }}>Non le solite parole.</Txt>
              <Txt style={{ color: C.muted, fontSize: 14, lineHeight: 21 }}>
                Dal grande classico alle sfide{'\n'}fuori dagli schemi. Scoprili tutti.
              </Txt>
              <View style={[s.inline, { marginTop: 6 }]}>
                <Txt style={{ fontSize: 13, color: C.coral, fontFamily: FONT.medium }}>
                  Esplora i 6 mazzi
                </Txt>
                <ArrowRight size={15} color={C.coral} />
              </View>
            </View>
            <View
              style={{ width: 77, height: 110, justifyContent: 'center', alignItems: 'center' }}
            >
              <View
                style={[
                  s.miniDeck,
                  { backgroundColor: C.purple, transform: [{ rotate: '19deg' }], left: 16 },
                ]}
              />
              <View
                style={[
                  s.miniDeck,
                  { backgroundColor: C.coral, transform: [{ rotate: '-10deg' }] },
                ]}
              >
                <Layers3 size={30} color={C.ink} />
              </View>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={s.loveNote}>
        <Heart size={12} color={C.muted} />
        <Txt style={{ color: C.muted, fontSize: 11 }}>
          Fatto per stare insieme. Anche senza connessione.
        </Txt>
      </View>
    </View>
  );
}

export function Decks({
  selected,
  onToggle,
  onStart,
}: {
  selected: DeckId[];
  onToggle: (id: DeckId) => void;
  onStart: () => void;
}) {
  const { width } = useWindowDimensions();
  return (
    <View style={{ paddingTop: 32 }}>
      <SectionHeading
        eyebrow="SCEGLI LE TUE PAROLE"
        title="Un mazzo, mille storie."
        subtitle="Mescola i tuoi preferiti. Tutte le carte sono incluse, tutte offline."
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
        {DECKS.map((deck) => {
          const Icon = DECK_ICONS[deck.icon]!;
          const checked = selected.includes(deck.id);
          return (
            <Pressable
              key={deck.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={deck.name}
              onPress={() => onToggle(deck.id)}
              style={({ pressed }) => ({
                width: width < 700 ? '100%' : '31.8%',
                flexGrow: 1,
                minWidth: 230,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: checked ? deck.color : C.line,
                overflow: 'hidden',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  height: 142,
                  backgroundColor: deck.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    width: 130,
                    height: 130,
                    borderRadius: 70,
                    borderWidth: 1,
                    borderColor: '#34164B20',
                    right: -25,
                    top: -35,
                  }}
                />
                <View
                  style={{
                    transform: [{ rotate: '-10deg' }],
                    width: 79,
                    height: 102,
                    borderRadius: 12,
                    backgroundColor: '#FFF9F099',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#FFFFFF80',
                  }}
                >
                  <Icon size={38} color={C.ink} strokeWidth={1.5} />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 14,
                    backgroundColor: C.ink,
                    width: 27,
                    height: 27,
                    borderRadius: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: checked ? 1 : 0.25,
                  }}
                >
                  {checked && <Check size={16} color={deck.color} />}
                </View>
              </View>
              <View style={{ padding: 20, gap: 7, backgroundColor: C.panel }}>
                <Txt style={{ fontFamily: FONT.semibold, fontSize: 21 }}>{deck.name}</Txt>
                <Txt style={{ color: C.muted, fontSize: 13 }}>{deck.subtitle}</Txt>
                <Txt
                  style={{ color: deck.color, fontSize: 11, fontFamily: FONT.medium, marginTop: 8 }}
                >
                  {CARDS.filter((c) => c.deck === deck.id).length} CARTE · ITALIANO
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View
        style={{
          marginTop: 26,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Txt style={{ color: C.muted }}>
          {selected.length} {selected.length === 1 ? 'mazzo selezionato' : 'mazzi selezionati'} ·{' '}
          {CARDS.filter((c) => selected.includes(c.deck)).length} carte
        </Txt>
        <Button title="Gioca con questi mazzi" onPress={onStart} />
      </View>
    </View>
  );
}

export function Rules({ onStart }: { onStart: () => void }) {
  const { width } = useWindowDimensions();
  const steps = [
    {
      title: 'Amici, fate squadra.',
      text: 'Dividetevi in 2, 3 o 4 squadre. Scegliete chi descrive per primo e affidate a un avversario il controllo delle parole vietate.',
      icon: Users,
      color: C.coral,
    },
    {
      title: 'Descrivi l’indescrivibile.',
      text: 'Fai indovinare la parola in cima alla carta senza pronunciarla e senza usare nessuna delle cinque parole vietate. Niente parti della parola, traduzioni, gesti o suggerimenti in rima.',
      icon: BookOpen,
      color: C.orange,
    },
    {
      title: 'Il tempo corre. Tu parla!',
      text: 'Premi “Indovinata” per guadagnare un punto, “Taboo!” se scappa una parola vietata, oppure “Passa” se sei in difficoltà. Il timer, le penalità e i passaggi li decidete voi.',
      icon: Clock3,
      color: C.mint,
    },
    {
      title: 'Il prossimo turno è vostro.',
      text: 'Allo scadere, controllate le carte e correggete eventuali errori prima di confermare. Passate il telefono alla squadra successiva e alternate chi descrive. Dopo l’ultimo round vince chi ha più punti; i pari merito condividono la vittoria.',
      icon: Trophy,
      color: C.purple,
    },
  ];
  return (
    <View style={{ paddingTop: 32, maxWidth: 900, alignSelf: 'center', width: '100%' }}>
      <SectionHeading
        eyebrow="SI IMPARA IN UN MINUTO"
        title="La parola a voi."
        subtitle="Un solo telefono. Tutti intorno. E nessuna parola di troppo."
      />
      <View style={{ gap: 16 }}>
        {steps.map((step, i) => (
          <View
            key={step.title}
            style={{
              backgroundColor: C.panel,
              borderRadius: 20,
              padding: width < 600 ? 20 : 28,
              flexDirection: 'row',
              gap: 20,
            }}
          >
            <View
              style={{
                width: 43,
                height: 43,
                backgroundColor: `${step.color}18`,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <step.icon color={step.color} size={23} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <SectionLabel style={{ color: step.color }}>0{i + 1}</SectionLabel>
              <Txt style={{ fontFamily: FONT.semibold, fontSize: 22 }}>{step.title}</Txt>
              <Txt style={{ color: C.muted, lineHeight: 25, fontSize: 15 }}>{step.text}</Txt>
            </View>
          </View>
        ))}
      </View>
      <Button
        title="Tutto chiaro. Giochiamo!"
        onPress={onStart}
        style={{ marginTop: 24, alignSelf: 'center' }}
      />
    </View>
  );
}
const s = StyleSheet.create({
  hero: { flexDirection: 'row', paddingTop: 52, paddingBottom: 26, alignItems: 'center', gap: 20 },
  heroCopy: { width: '54%', zIndex: 2 },
  headline: {
    fontFamily: FONT.bold,
    fontSize: 65,
    lineHeight: 71,
    letterSpacing: -2.5,
    marginTop: 24,
  },
  heroSub: { color: '#C7B5D7', fontSize: 17, lineHeight: 27, marginTop: 22 },
  heroArt: {
    flex: 1,
    minWidth: 320,
    height: 430,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orbitOuter: {
    position: 'absolute',
    width: 418,
    height: 418,
    borderRadius: 220,
    borderWidth: 1,
    borderColor: '#56366C50',
  },
  orbitInner: {
    position: 'absolute',
    width: 337,
    height: 337,
    borderRadius: 180,
    backgroundColor: '#3D205533',
    borderWidth: 1,
    borderColor: '#56366C50',
  },
  spark: { position: 'absolute', left: 14, top: 30, transform: [{ rotate: '-18deg' }] },
  handNote: {
    position: 'absolute',
    bottom: 5,
    right: -2,
    fontSize: 12,
    fontFamily: FONT.medium,
    color: C.muted,
    transform: [{ rotate: '-7deg' }],
    lineHeight: 17,
  },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  micro: { fontSize: 12, color: C.muted },
  smallDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: C.line },
  featureStrip: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 23,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 22,
    marginTop: 10,
  },
  feature: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 13 },
  featureIcon: {
    backgroundColor: '#AB88D315',
    width: 41,
    height: 41,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  sectionTitle: { fontFamily: FONT.semibold, fontSize: 24, marginTop: 9, letterSpacing: -0.5 },
  textLink: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  textLinkText: { fontSize: 13, color: C.purple, fontFamily: FONT.medium },
  bottomGrid: { flexDirection: 'row', gap: 18 },
  quickCard: {
    flex: 1.1,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6C457550',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deckTeaser: {
    flex: 1,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#79516350',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniChip: {
    paddingVertical: 6,
    paddingHorizontal: 9,
    backgroundColor: '#FFFFFF09',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FFFFFF0C',
  },
  arrowCircle: {
    width: 45,
    height: 45,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FFB64C55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniDeck: {
    position: 'absolute',
    width: 66,
    height: 88,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },
  loveNote: {
    paddingVertical: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
