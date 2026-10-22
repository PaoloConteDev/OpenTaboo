import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, View, useWindowDimensions } from 'react-native';
import {
  Check,
  Flag,
  Hand,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { CARD_MAP } from '../data/cards';
import {
  Game,
  Outcome,
  activeTeam,
  currentRound,
  pointsFor,
  skipsLeft,
  turnPoints,
} from '../game/engine';
import { C, FONT, TEAM_COLORS } from '../theme';
import {
  Button,
  CardBack,
  Confetti,
  IconButton,
  Pill,
  SectionHeading,
  SectionLabel,
  Txt,
  WordCard,
} from '../components/UI';

export function Match({
  game,
  countdown,
  onStart,
  onAnswer,
  onPause,
  onResume,
  onEndTurn,
  onCommit,
  onEdit,
  onHome,
  onReplay,
  onSound,
}: {
  game: Game;
  countdown: number;
  onStart: () => void;
  onAnswer: (o: Outcome) => void;
  onPause: () => void;
  onResume: () => void;
  onEndTurn: () => void;
  onCommit: () => void;
  onEdit: (index: number, outcome: Outcome) => void;
  onHome: () => void;
  onReplay: () => void;
  onSound: () => void;
}) {
  const { width } = useWindowDimensions();
  const mobile = width < 800;
  const team = activeTeam(game);
  const color = TEAM_COLORS[team]!;
  const card = CARD_MAP.get(game.queue[game.cursor]!)!;
  const motion = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    motion.setValue(0);
    Animated.spring(motion, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
      friction: 7,
      tension: 90,
    }).start();
  }, [game.cursor, card.id, motion]);
  const nextTeam = (team + 1) % game.teams.length;
  if (game.phase === 'finished') {
    const high = Math.max(...game.teams.map((t) => t.score));
    const winners = game.teams.filter((t) => t.score === high);
    const ranked = game.teams.map((t, i) => ({ ...t, index: i })).sort((a, b) => b.score - a.score);
    return (
      <View
        style={{ maxWidth: 720, width: '100%', alignSelf: 'center', paddingVertical: 40, gap: 24 }}
      >
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Confetti celebration />
          <Trophy color={C.orange} size={58} strokeWidth={1.4} />
          <SectionLabel style={{ marginTop: 22, color: C.orange }}>BELLA PARTITA!</SectionLabel>
          <Txt
            accessibilityRole="header"
            style={{
              fontFamily: FONT.bold,
              fontSize: mobile ? 35 : 46,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            {winners.length > 1 ? 'La vittoria si condivide.' : `${winners[0]!.name} vincono!`}
          </Txt>
          <Txt style={{ color: C.muted, marginTop: 12, textAlign: 'center', lineHeight: 25 }}>
            {winners.length > 1
              ? `${winners.map((t) => t.name).join(' e ')} a pari merito con ${high} punti.`
              : `${high} punti e un sacco di parole da raccontare.`}
          </Txt>
        </View>
        <View style={{ gap: 10 }}>
          {ranked.map((t) => (
            <View
              key={t.index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                padding: 23,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: t.score === high ? '#FFB64C70' : C.line,
                backgroundColor: C.panel,
              }}
            >
              <Txt style={{ color: C.muted, width: 22, fontFamily: FONT.bold, fontSize: 20 }}>
                {ranked.findIndex((r) => r.score === t.score) + 1}
              </Txt>
              <View
                style={{
                  backgroundColor: `${TEAM_COLORS[t.index]}20`,
                  padding: 10,
                  borderRadius: 12,
                }}
              >
                <Users size={22} color={TEAM_COLORS[t.index]} />
              </View>
              <Txt style={{ flex: 1, fontFamily: FONT.semibold, fontSize: 20 }}>{t.name}</Txt>
              <Txt style={{ color: TEAM_COLORS[t.index], fontFamily: FONT.bold, fontSize: 30 }}>
                {t.score}
              </Txt>
              <Txt style={{ color: C.muted, fontSize: 12 }}>punti</Txt>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <Button title="Rivincita?" onPress={onReplay} icon={RotateCcw} />
          <Button title="Torna alla home" onPress={onHome} secondary icon={null} />
        </View>
        <Txt style={{ textAlign: 'center', color: C.muted, fontSize: 12 }}>
          {game.history.length} turni giocati ·{' '}
          {game.history.reduce(
            (n, t) => n + t.entries.filter((e) => e.outcome === 'correct').length,
            0,
          )}{' '}
          parole indovinate
        </Txt>
      </View>
    );
  }
  if (game.phase === 'review')
    return (
      <View style={{ maxWidth: 740, alignSelf: 'center', width: '100%', paddingTop: 35, gap: 22 }}>
        <SectionHeading
          eyebrow="TURNO FINITO. COME È ANDATA?"
          title={`Bel turno, ${game.teams[team]!.name}!`}
          subtitle="Controllate le carte: toccate un esito per correggerlo, poi confermate."
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[
            {
              value: game.entries.filter((e) => e.outcome === 'correct').length,
              label: 'INDOVINATE',
              color: C.mint,
            },
            {
              value: game.entries.filter((e) => e.outcome === 'taboo').length,
              label: 'TABOO',
              color: C.coral,
            },
            {
              value: game.entries.filter((e) => e.outcome === 'skip').length,
              label: 'PASSATE',
              color: C.purple,
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                padding: 19,
                backgroundColor: C.panel,
                borderRadius: 17,
                alignItems: 'center',
                gap: 7,
              }}
            >
              <Txt style={{ fontFamily: FONT.bold, fontSize: 34, color: stat.color }}>
                {stat.value}
              </Txt>
              <SectionLabel style={{ fontSize: 9, letterSpacing: 1 }}>{stat.label}</SectionLabel>
            </View>
          ))}
        </View>
        <View style={{ gap: 8 }}>
          {game.entries.length === 0 && (
            <Txt style={{ color: C.muted, textAlign: 'center', padding: 25 }}>
              Nessuna carta giocata in questo turno. Il prossimo andrà meglio!
            </Txt>
          )}
          {game.entries.map((entry, i) => (
            <View
              key={i}
              style={{
                backgroundColor: C.panel,
                borderRadius: 13,
                padding: 13,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <Txt style={{ flex: 1, minWidth: 100, fontFamily: FONT.medium }}>
                {CARD_MAP.get(entry.cardId)!.word}
              </Txt>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {(
                  [
                    { outcome: 'correct', icon: Check, color: C.mint, label: 'Indovinata' },
                    { outcome: 'taboo', icon: X, color: C.coral, label: 'Taboo' },
                    { outcome: 'skip', icon: SkipForward, color: C.purple, label: 'Passata' },
                  ] as const
                ).map(({ outcome, icon: Icon, color: col, label }) => (
                  <Pressable
                    key={outcome}
                    accessibilityRole="button"
                    accessibilityLabel={`${CARD_MAP.get(entry.cardId)!.word}: ${label}`}
                    accessibilityState={{ selected: entry.outcome === outcome }}
                    onPress={() => onEdit(i, outcome)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: entry.outcome === outcome ? col : '#FFFFFF06',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={entry.outcome === outcome ? C.ink : C.muted} />
                  </Pressable>
                ))}
              </View>
              <Txt
                style={{
                  color: entry.outcome === 'correct' ? C.mint : C.coral,
                  minWidth: 30,
                  textAlign: 'right',
                  fontFamily: FONT.semibold,
                }}
              >
                {pointsFor(entry.outcome, game.settings) > 0 ? '+' : ''}
                {pointsFor(entry.outcome, game.settings)}
              </Txt>
            </View>
          ))}
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: C.line,
            paddingVertical: 18,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Txt style={{ fontFamily: FONT.medium }}>Punti di questo turno</Txt>
          <Txt
            style={{
              fontFamily: FONT.bold,
              fontSize: 34,
              color: turnPoints(game) >= 0 ? C.mint : C.coral,
            }}
          >
            {turnPoints(game) > 0 ? '+' : ''}
            {turnPoints(game)}
          </Txt>
        </View>
        <Button
          title={
            game.turn + 1 === game.teams.length * game.settings.rounds
              ? 'Scopri i vincitori'
              : `Conferma · tocca a ${game.teams[nextTeam]!.name}`
          }
          onPress={onCommit}
        />
        <Txt style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginBottom: 25 }}>
          Il punteggio viene assegnato quando confermi il turno.
        </Txt>
      </View>
    );
  return (
    <View style={{ paddingTop: mobile ? 18 : 26 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: mobile ? 18 : 25,
          gap: 12,
        }}
      >
        <View style={{ gap: 7, flex: 1 }}>
          <SectionLabel>
            ROUND {currentRound(game)} DI {game.settings.rounds}
          </SectionLabel>
          <Txt style={{ fontFamily: FONT.semibold, fontSize: mobile ? 24 : 30 }}>
            La parola a{' '}
            <Txt style={{ color, fontFamily: FONT.semibold, fontSize: mobile ? 24 : 30 }}>
              {game.teams[team]!.name}
            </Txt>
          </Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <IconButton
            icon={game.settings.sound ? Volume2 : VolumeX}
            label="Attiva o disattiva audio"
            onPress={onSound}
          />
          {game.phase === 'playing' && (
            <IconButton icon={Pause} label="Metti in pausa" onPress={onPause} />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: mobile ? 'column-reverse' : 'row',
          gap: 30,
          alignItems: mobile ? 'stretch' : 'flex-start',
        }}
      >
        <View style={{ width: mobile ? '100%' : 240, gap: 16 }}>
          <View style={{ backgroundColor: C.panel, borderRadius: 20, padding: 20, gap: 16 }}>
            <SectionLabel>LA CLASSIFICA</SectionLabel>
            <View style={{ flexDirection: mobile ? 'row' : 'column', gap: 12, flexWrap: 'wrap' }}>
              {game.teams.map((t, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: mobile ? 1 : undefined,
                    minWidth: mobile ? 110 : undefined,
                    gap: 10,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: TEAM_COLORS[i],
                      }}
                    />
                    <Txt
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                        fontFamily: FONT.medium,
                        color: i === team ? C.text : C.muted,
                        flexShrink: 1,
                      }}
                    >
                      {t.name}
                    </Txt>
                  </View>
                  <Txt style={{ fontFamily: FONT.bold, fontSize: 21, color: TEAM_COLORS[i] }}>
                    {t.score}
                  </Txt>
                </View>
              ))}
            </View>
          </View>
          {!mobile && (
            <View
              style={{
                padding: 20,
                gap: 12,
                borderWidth: 1,
                borderColor: C.line,
                borderRadius: 20,
              }}
            >
              <Hand size={24} color={C.purple} />
              <Txt style={{ fontFamily: FONT.medium }}>Occhio alle parole!</Txt>
              <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22 }}>
                Un avversario controlla la carta. Se senti una parola vietata, premi Taboo!
              </Txt>
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingBottom: 25,
            minHeight: 470,
            width: '100%',
          }}
        >
          {(game.phase === 'ready' || game.phase === 'countdown') && (
            <View style={{ alignItems: 'center', gap: 20, width: '100%' }}>
              {game.phase === 'ready' ? (
                <>
                  <View
                    style={{
                      transform: [{ rotate: '-5deg' }, { scale: 0.85 }],
                      marginVertical: -22,
                    }}
                  >
                    <CardBack color={color} />
                  </View>
                  <Txt style={{ fontFamily: FONT.semibold, fontSize: 25, textAlign: 'center' }}>
                    Pronti a non dirlo?
                  </Txt>
                  <Txt
                    style={{ color: C.muted, lineHeight: 24, textAlign: 'center', maxWidth: 370 }}
                  >
                    Passa il telefono a chi descrive.{'\n'}Solo l’indiziatore e il controllore
                    guardano le carte.
                  </Txt>
                  <Button
                    title={`Via! · ${game.settings.seconds} secondi`}
                    onPress={onStart}
                    icon={Play}
                    color={color}
                    style={{ minWidth: 260 }}
                  />
                </>
              ) : (
                <View
                  style={{ height: 470, alignItems: 'center', justifyContent: 'center', gap: 18 }}
                >
                  <Pill color={color}>SI PARTE TRA…</Pill>
                  <Txt
                    accessibilityLiveRegion="assertive"
                    style={{ fontFamily: FONT.black, fontSize: 150, color }}
                  >
                    {countdown || 'Via!'}
                  </Txt>
                  <Txt style={{ color: C.muted }}>Respira. Trova le parole. Divertiti.</Txt>
                </View>
              )}
            </View>
          )}
          {game.phase === 'playing' && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: 370,
                  marginBottom: 18,
                }}
              >
                <Timer remaining={game.remainingMs} total={game.settings.seconds * 1000} />
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <SectionLabel>PUNTI DEL TURNO</SectionLabel>
                  <Txt style={{ fontFamily: FONT.bold, fontSize: 30, color: C.mint }}>
                    {turnPoints(game) > 0 ? '+' : ''}
                    {turnPoints(game)}
                  </Txt>
                </View>
              </View>
              <Animated.View
                style={{
                  width: '100%',
                  maxWidth: 350,
                  opacity: motion,
                  transform: [
                    {
                      translateX: motion.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
                    },
                    { scale: motion.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                  ],
                }}
              >
                <WordCard card={card} dense={mobile} />
              </Animated.View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  width: '100%',
                  maxWidth: 440,
                  marginTop: 25,
                }}
              >
                <Action
                  label="Taboo!"
                  sub={`−${game.settings.penalty}`}
                  color={C.coral}
                  icon={X}
                  onPress={() => onAnswer('taboo')}
                />
                <Action
                  label="Passa"
                  sub={skipsLeft(game) === Infinity ? '∞' : `${skipsLeft(game)} rimasti`}
                  color={C.purple}
                  icon={SkipForward}
                  onPress={() => onAnswer('skip')}
                  disabled={skipsLeft(game) === 0}
                />
                <Action
                  label="Indovinata"
                  sub="+1 punto"
                  color={C.mint}
                  icon={Check}
                  onPress={() => onAnswer('correct')}
                />
              </View>
            </>
          )}
          {game.phase === 'paused' && (
            <View
              style={{
                minHeight: 460,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 22,
                maxWidth: 380,
              }}
            >
              <View style={{ backgroundColor: C.panel, padding: 24, borderRadius: 50 }}>
                <Pause size={38} color={C.orange} />
              </View>
              <Txt style={{ fontFamily: FONT.bold, fontSize: 34 }}>Parole in pausa.</Txt>
              <Txt style={{ color: C.muted, textAlign: 'center', lineHeight: 24 }}>
                La carta resta nascosta. Avete ancora {Math.ceil(game.remainingMs / 1000)} secondi
                per farvi capire.
              </Txt>
              <Button title="Riprendi il turno" onPress={onResume} icon={Play} />
              <Button title="Concludi questo turno" onPress={onEndTurn} secondary icon={Flag} />
              <Pressable accessibilityRole="button" onPress={onHome} style={{ padding: 10 }}>
                <Txt style={{ color: C.muted, fontSize: 13 }}>Salva ed esci alla home</Txt>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
function Timer({ remaining, total }: { remaining: number; total: number }) {
  const urgent = remaining <= 10000;
  const color = urgent ? C.coral : C.orange;
  const radius = 24;
  const length = 2 * Math.PI * radius;
  return (
    <View style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}>
      <View style={{ width: 58, height: 58, alignItems: 'center', justifyContent: 'center' }}>
        <Svg
          width={58}
          height={58}
          style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
        >
          <Circle cx={29} cy={29} r={radius} fill="none" stroke={C.line} strokeWidth={3} />
          <Circle
            cx={29}
            cy={29}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={`${length} ${length}`}
            strokeDashoffset={length * (1 - remaining / total)}
            strokeLinecap="round"
          />
        </Svg>
        <Txt style={{ fontFamily: FONT.bold, fontSize: 21, color }}>
          {Math.ceil(remaining / 1000)}
        </Txt>
      </View>
      <View>
        <SectionLabel style={{ fontSize: 9 }}>IL TEMPO VOLA</SectionLabel>
        <Txt style={{ color, fontFamily: FONT.medium, fontSize: 12, marginTop: 4 }}>
          {urgent ? 'Ultime parole!' : 'Pensa in fretta.'}
        </Txt>
      </View>
    </View>
  );
}
function Action({
  label,
  sub,
  color,
  icon: Icon,
  onPress,
  disabled = false,
}: {
  label: string;
  sub: string;
  color: string;
  icon: typeof Check;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: color,
        borderRadius: 16,
        paddingVertical: 15,
        gap: 6,
        alignItems: 'center',
        opacity: disabled ? 0.3 : pressed ? 0.7 : 1,
        borderBottomWidth: 4,
        borderBottomColor: '#00000020',
        transform: [{ translateY: pressed ? 2 : 0 }],
      })}
    >
      <Icon color={C.ink} size={25} strokeWidth={2.5} />
      <Txt style={{ color: C.ink, fontFamily: FONT.semibold, fontSize: 14 }}>{label}</Txt>
      <Txt style={{ color: '#34164BAA', fontSize: 10 }}>{sub}</Txt>
    </Pressable>
  );
}
