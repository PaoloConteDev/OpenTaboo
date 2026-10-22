import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Outfit_400Regular } from '@expo-google-fonts/outfit/400Regular';
import { Outfit_500Medium } from '@expo-google-fonts/outfit/500Medium';
import { Outfit_600SemiBold } from '@expo-google-fonts/outfit/600SemiBold';
import { Outfit_700Bold } from '@expo-google-fonts/outfit/700Bold';
import { Outfit_900Black } from '@expo-google-fonts/outfit/900Black';
import { useKeepAwake } from 'expo-keep-awake';
import * as SplashScreen from 'expo-splash-screen';
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Layers3,
  Play,
  Settings2,
  Trophy,
  WifiOff,
  X,
  Zap,
} from 'lucide-react-native';
import { C, FONT, TEAM_COLORS } from './src/theme';
import { DeckId } from './src/data/cards';
import {
  DEFAULT_SETTINGS,
  Game,
  Outcome,
  Settings,
  commitTurn,
  createGame,
  normalizeSettings,
  recordAnswer,
} from './src/game/engine';
import { Button, IconButton, SectionHeading, SectionLabel, Txt } from './src/components/UI';
import { Decks, Home, Rules } from './src/screens/Lobby';
import { Setup, ToggleRow } from './src/screens/Setup';
import { Match } from './src/screens/Match';
import { useFeedback } from './src/hooks/useFeedback';
import { MatchRecord, loadSave, saveState } from './src/storage';

void SplashScreen.preventAutoHideAsync().catch(() => {});
type Page = 'home' | 'setup' | 'decks' | 'rules' | 'match' | 'history';
type Dialog = 'settings' | 'replace' | null;
function Awake() {
  useKeepAwake();
  return null;
}
export default function App() {
  const [fonts, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_900Black,
  });
  useEffect(() => {
    if (fonts || fontError) void SplashScreen.hideAsync();
  }, [fonts, fontError]);
  if (!fonts && !fontError)
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={C.orange} />
      </View>
    );
  return (
    <SafeAreaProvider>
      <Application />
    </SafeAreaProvider>
  );
}
function Application() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState<Page>('home');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [game, setGame] = useState<Game | null>(null);
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [countdown, setCountdown] = useState(3);
  const [storageError, setStorageError] = useState(false);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const deadline = useRef(0);
  const lastTick = useRef(-1);
  const gameRef = useRef<Game | null>(null);
  const stateRef = useRef({ settings, records });
  const pageRef = useRef(page);
  stateRef.current = { settings, records };
  pageRef.current = page;
  const feedback = useFeedback(game && page === 'match' ? game.settings : settings);
  const feedbackRef = useRef(feedback);
  feedbackRef.current = feedback;
  const update = useCallback((next: Game | null) => {
    gameRef.current = next;
    setGame(next);
  }, []);
  const persist = useCallback((g = gameRef.current) => {
    void saveState(stateRef.current.settings, g, stateRef.current.records)
      .then(() => setStorageError(false))
      .catch(() => setStorageError(true));
  }, []);
  useEffect(() => {
    let live = true;
    void loadSave().then((saved) => {
      if (!live) return;
      setSettings(saved.settings);
      setRecords(saved.records);
      update(saved.game);
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, [update]);
  useEffect(() => {
    if (loaded) persist();
  }, [
    loaded,
    settings,
    records,
    game?.phase,
    game?.turn,
    game?.cursor,
    game?.entries,
    game?.settings,
    persist,
  ]);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [page, game?.phase]);
  const pause = useCallback(() => {
    const g = gameRef.current;
    if (g?.phase === 'playing') {
      const remainingMs = Math.max(0, deadline.current - Date.now());
      const next: Game = { ...g, phase: remainingMs === 0 ? 'review' : 'paused', remainingMs };
      update(next);
      persist(next);
    } else if (g?.phase === 'countdown') update({ ...g, phase: 'ready' });
  }, [persist, update]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status !== 'active') {
        pause();
        persist();
      }
    });
    return () => sub.remove();
  }, [pause, persist]);
  const navigate = useCallback(
    (p: Page) => {
      if (pageRef.current === 'match') pause();
      setPage(p);
    },
    [pause],
  );
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dialog) {
        setDialog(null);
        return true;
      }
      if (
        pageRef.current === 'match' &&
        (gameRef.current?.phase === 'playing' || gameRef.current?.phase === 'countdown')
      ) {
        pause();
        return true;
      }
      if (pageRef.current !== 'home') {
        navigate('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [dialog, navigate, pause]);
  useEffect(() => {
    if (game?.phase !== 'playing') return;
    let persistedAt = 0;
    const interval = setInterval(() => {
      const current = gameRef.current;
      if (!current || current.phase !== 'playing') return;
      const remainingMs = Math.max(0, deadline.current - Date.now());
      const seconds = Math.ceil(remainingMs / 1000);
      if (seconds > 0 && seconds <= 5 && seconds !== lastTick.current) {
        lastTick.current = seconds;
        feedbackRef.current('tick');
      }
      const next: Game = {
        ...current,
        remainingMs,
        phase: remainingMs === 0 ? 'review' : 'playing',
      };
      update(next);
      if (Date.now() - persistedAt > 1000 || !remainingMs) {
        persist(next);
        persistedAt = Date.now();
      }
      if (remainingMs === 0) feedbackRef.current('finish');
    }, 100);
    return () => clearInterval(interval);
  }, [game?.phase, persist, update]);
  const resume = () => {
    const g = gameRef.current;
    if (!g) return;
    deadline.current = Date.now() + g.remainingMs;
    lastTick.current = -1;
    update({ ...g, phase: g.remainingMs > 0 ? 'playing' : 'review' });
  };
  useEffect(() => {
    if (game?.phase !== 'countdown') return;
    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown((n) => n - 1);
        feedbackRef.current('tick');
      } else {
        const g = gameRef.current;
        if (g?.phase === 'countdown') {
          deadline.current = Date.now() + g.remainingMs;
          lastTick.current = -1;
          update({ ...g, phase: 'playing' });
          feedbackRef.current('tick');
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [game?.phase, countdown, update]);
  const answer = (outcome: Outcome) => {
    const g = gameRef.current;
    if (!g || g.phase !== 'playing') return;
    const remainingMs = Math.max(0, deadline.current - Date.now());
    if (remainingMs <= 0) {
      update({ ...g, remainingMs: 0, phase: 'review' });
      feedback('finish');
      return;
    }
    const next = recordAnswer({ ...g, remainingMs }, outcome);
    if (next.cursor === g.cursor && next.entries.length === g.entries.length) return;
    update(next);
    feedback(outcome);
  };
  const commit = () => {
    const g = gameRef.current;
    if (!g || g.phase !== 'review') return;
    const next = commitTurn(g);
    update(next);
    if (next.phase === 'finished') {
      setRecords((prev) =>
        [
          {
            id: Date.now(),
            teams: next.teams,
            rounds: next.settings.rounds,
            guessed: next.history.reduce(
              (n, t) => n + t.entries.filter((e) => e.outcome === 'correct').length,
              0,
            ),
          },
          ...prev,
        ].slice(0, 20),
      );
      feedback('finish');
    }
  };
  const startMatch = () => {
    const safe = normalizeSettings(settings);
    setSettings(safe);
    update(createGame(safe));
    setDialog(null);
    navigate('match');
  };
  const requestStart = () => {
    if (game && game.phase !== 'finished') setDialog('replace');
    else startMatch();
  };
  const toggleDeck = (id: DeckId) =>
    setSettings((prev) => ({
      ...prev,
      decks: prev.decks.includes(id)
        ? prev.decks.length > 1
          ? prev.decks.filter((d) => d !== id)
          : prev.decks
        : [...prev.decks, id],
    }));
  if (!loaded)
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center' }}>
        <ActivityIndicator color={C.orange} />
      </View>
    );
  const tabs: { page: Page; label: string; icon: typeof Play }[] = [
    { page: 'home', label: 'Gioca', icon: Play },
    { page: 'decks', label: 'I mazzi', icon: Layers3 },
    { page: 'rules', label: 'Come si gioca', icon: CircleHelp },
  ];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        paddingTop: insets.top,
        paddingBottom: page === 'match' ? insets.bottom : 0,
      }}
    >
      <StatusBar style="light" />
      {page === 'match' && (game?.phase === 'playing' || game?.phase === 'countdown') && <Awake />}
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#54376A77' }}>
        <View
          style={[s.header, { paddingHorizontal: mobile ? 22 : 42, minHeight: mobile ? 76 : 90 }]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Taboo, home"
            onPress={() => navigate('home')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <View style={s.logoMark}>
              <Zap color={C.bg} size={23} fill={C.bg} strokeWidth={1.5} />
            </View>
            <View>
              <Txt
                style={{ fontFamily: FONT.black, fontSize: 13, letterSpacing: 4, lineHeight: 16 }}
              >
                OPEN
              </Txt>
              <Txt
                style={{
                  fontFamily: FONT.black,
                  fontSize: 22,
                  letterSpacing: -0.8,
                  lineHeight: 23,
                }}
              >
                TABOO<Txt style={{ color: C.coral, fontSize: 22 }}>.</Txt>
              </Txt>
            </View>
          </Pressable>
          {!mobile && (
            <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center', marginLeft: 40 }}>
              {tabs.map((tab) => (
                <Pressable
                  key={tab.page}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected:
                      page === tab.page ||
                      (tab.page === 'home' && (page === 'setup' || page === 'match')),
                  }}
                  onPress={() => navigate(tab.page)}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor:
                      page === tab.page ||
                      (tab.page === 'home' && ['setup', 'match'].includes(page))
                        ? C.coral
                        : 'transparent',
                  }}
                >
                  <Txt
                    style={{
                      fontFamily: FONT.medium,
                      fontSize: 14,
                      color: page === tab.page ? C.text : C.muted,
                    }}
                  >
                    {tab.label}
                  </Txt>
                </Pressable>
              ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: mobile ? 8 : 13, alignItems: 'center' }}>
            {!mobile && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 8 }}>
                <WifiOff size={13} color={C.mint} />
                <Txt style={{ color: C.mint, fontSize: 11, fontFamily: FONT.medium }}>
                  OFFLINE & INSIEME
                </Txt>
              </View>
            )}
            <IconButton icon={Trophy} label="Storico partite" onPress={() => navigate('history')} />
            <IconButton
              icon={Settings2}
              label="Impostazioni"
              onPress={() => {
                pause();
                setDialog('settings');
              }}
            />
          </View>
        </View>
      </View>
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: mobile ? 22 : 42,
          paddingBottom: mobile ? 20 : 12,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: 1100, alignSelf: 'center', flex: 1 }}>
          {storageError && (
            <View
              accessibilityRole="alert"
              style={{ marginTop: 15, backgroundColor: '#FF817C20', borderRadius: 10, padding: 12 }}
            >
              <Txt style={{ fontSize: 13, color: C.coral }}>
                Salvataggio non disponibile. La partita prosegue; mantieni l’app aperta per
                conservarla.
              </Txt>
            </View>
          )}
          {page !== 'home' && page !== 'match' && (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigate('home')}
              style={{
                flexDirection: 'row',
                gap: 7,
                paddingTop: 20,
                alignItems: 'center',
                alignSelf: 'flex-start',
              }}
            >
              <ArrowLeft size={14} color={C.muted} />
              <Txt style={{ color: C.muted, fontSize: 12 }}>Torna alla home</Txt>
            </Pressable>
          )}
          {page === 'home' && (
            <Home
              settings={settings}
              game={game}
              onStart={() => navigate('setup')}
              onDecks={() => navigate('decks')}
              onRules={() => navigate('rules')}
              onResume={() => navigate('match')}
            />
          )}
          {page === 'decks' && (
            <Decks
              selected={settings.decks}
              onToggle={toggleDeck}
              onStart={() => navigate('setup')}
            />
          )}
          {page === 'rules' && <Rules onStart={() => navigate('setup')} />}
          {page === 'setup' && (
            <Setup settings={settings} onChange={setSettings} onStart={requestStart} />
          )}
          {page === 'match' && game && (
            <Match
              game={game}
              countdown={countdown}
              onStart={() => {
                setCountdown(3);
                update({ ...gameRef.current!, phase: 'countdown' });
                feedback('tick');
              }}
              onAnswer={answer}
              onPause={pause}
              onResume={resume}
              onEndTurn={() => {
                const g = gameRef.current;
                if (g && g.phase === 'paused') update({ ...g, phase: 'review' });
              }}
              onCommit={commit}
              onEdit={(index, outcome) => {
                const g = gameRef.current;
                if (g?.phase === 'review')
                  update({
                    ...g,
                    entries: g.entries.map((e, i) => (i === index ? { ...e, outcome } : e)),
                  });
              }}
              onHome={() => navigate('home')}
              onReplay={() => {
                const g = gameRef.current;
                if (g) {
                  update(createGame(g.settings));
                  setCountdown(3);
                }
              }}
              onSound={() => {
                const g = gameRef.current;
                if (g) update({ ...g, settings: { ...g.settings, sound: !g.settings.sound } });
              }}
            />
          )}
          {page === 'history' && (
            <View style={{ paddingTop: 32, gap: 18 }}>
              <SectionHeading
                eyebrow="I VOSTRI MOMENTI DI GLORIA"
                title="Le partite da ricordare."
                subtitle="Le ultime 20 sfide, salvate solo su questo dispositivo."
              />
              {records.length === 0 ? (
                <View style={s.empty}>
                  <Trophy size={48} color={C.orange} strokeWidth={1.5} />
                  <Txt style={{ fontSize: 26, fontFamily: FONT.semibold }}>
                    Il podio vi aspetta.
                  </Txt>
                  <Txt style={{ color: C.muted, textAlign: 'center', lineHeight: 24 }}>
                    Giocate la prima partita per iniziare{'\n'}a scrivere la vostra storia.
                  </Txt>
                  <Button title="Creiamo una partita" onPress={() => navigate('setup')} />
                </View>
              ) : (
                records.map((record) => {
                  const high = Math.max(...record.teams.map((t) => t.score));
                  return (
                    <View
                      key={record.id}
                      style={{ backgroundColor: C.panel, borderRadius: 18, padding: 23, gap: 17 }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        <Txt style={{ color: C.muted, fontSize: 12 }}>
                          {new Date(record.id).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Txt>
                        <Txt style={{ color: C.muted, fontSize: 12 }}>
                          {record.rounds} round · {record.guessed} indovinate
                        </Txt>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                        {record.teams.map((t, i) => (
                          <View
                            key={i}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                          >
                            <Txt
                              style={{ color: TEAM_COLORS[i], fontSize: 22, fontFamily: FONT.bold }}
                            >
                              {t.score}
                            </Txt>
                            <Txt style={{ fontSize: 15 }}>{t.name}</Txt>
                            {t.score === high && <Trophy size={14} color={C.orange} />}
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
          {page !== 'home' && (
            <View style={{ paddingVertical: 28, alignItems: 'center' }}>
              <Txt style={{ color: '#8C749F', fontSize: 10, letterSpacing: 1 }}>
                OPEN TABOO · PENSA. PARLA. OSA.
              </Txt>
            </View>
          )}
        </View>
      </ScrollView>
      {mobile && page !== 'match' && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: C.bg,
            borderTopWidth: 1,
            borderTopColor: C.line,
            paddingTop: 11,
            paddingBottom: Math.max(insets.bottom, 11),
          }}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.page}
              accessibilityRole="button"
              onPress={() => navigate(tab.page)}
              style={{ flex: 1, alignItems: 'center', gap: 5 }}
            >
              <tab.icon size={20} color={page === tab.page ? C.coral : C.muted} />
              <Txt
                style={{
                  fontSize: 10,
                  fontFamily: FONT.medium,
                  color: page === tab.page ? C.coral : C.muted,
                }}
              >
                {tab.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
      <Modal
        transparent
        visible={dialog !== null}
        animationType="fade"
        onRequestClose={() => setDialog(null)}
      >
        <View style={s.modalBackdrop}>
          <View accessibilityViewIsModal style={[s.modal, { maxHeight: '85%' }]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <Txt style={{ fontFamily: FONT.semibold, fontSize: 25 }}>
                {dialog === 'replace' ? 'Si ricomincia?' : 'Il tuo modo di giocare.'}
              </Txt>
              <IconButton icon={X} label="Chiudi finestra" onPress={() => setDialog(null)} />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {dialog === 'replace' ? (
                <View style={{ gap: 22 }}>
                  <Txt style={{ color: C.muted, lineHeight: 25 }}>
                    C’è una partita ancora in corso. Iniziandone una nuova, i progressi di quella
                    partita verranno sostituiti.
                  </Txt>
                  <Button title="Sì, nuova partita" onPress={startMatch} />
                  <Button
                    title="Conserva la partita"
                    onPress={() => setDialog(null)}
                    secondary
                    icon={null}
                  />
                </View>
              ) : (
                <View>
                  <ToggleRow
                    title="Effetti sonori"
                    description="Segnali per indovinate, penalità e timer."
                    value={settings.sound}
                    onChange={(v) => {
                      setSettings((s) => ({ ...s, sound: v }));
                      const g = gameRef.current;
                      if (g) update({ ...g, settings: { ...g.settings, sound: v } });
                    }}
                  />
                  <ToggleRow
                    title="Vibrazione"
                    description="Feedback tattile sui dispositivi compatibili."
                    value={settings.haptics}
                    onChange={(v) => {
                      setSettings((s) => ({ ...s, haptics: v }));
                      const g = gameRef.current;
                      if (g) update({ ...g, settings: { ...g.settings, haptics: v } });
                    }}
                  />
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderColor: C.line,
                      marginTop: 16,
                      paddingTop: 25,
                      gap: 12,
                    }}
                  >
                    <SectionLabel>OPEN TABOO · 1.0.0</SectionLabel>
                    <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22 }}>
                      Progetto universitario indipendente. Grafica, suoni e carte originali.
                      Ispirato al gioco di parole Taboo; non affiliato a Hasbro o Marmalade Game
                      Studio.
                    </Txt>
                    <Txt style={{ color: C.muted, fontSize: 13, lineHeight: 22 }}>
                      Nessun account, nessun tracciamento. Preferenze, partita in corso e risultati
                      restano sul dispositivo.
                    </Txt>
                  </View>
                  <Button
                    title="Perfetto, continuiamo"
                    onPress={() => setDialog(null)}
                    style={{ marginTop: 25 }}
                    icon={Check}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: 1184,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  logoMark: {
    backgroundColor: C.coral,
    width: 40,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-9deg' }],
    borderBottomWidth: 3,
    borderBottomColor: '#00000025',
  },
  empty: { alignItems: 'center', paddingVertical: 50, gap: 22 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#130920D9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.panel,
  },
});
