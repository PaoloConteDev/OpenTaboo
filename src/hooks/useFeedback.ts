import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Settings } from '../game/engine';

export function useFeedback(settings: Pick<Settings, 'sound' | 'haptics'>) {
  const correct = useAudioPlayer(require('../../assets/sounds/correct.wav'));
  const taboo = useAudioPlayer(require('../../assets/sounds/taboo.wav'));
  const tick = useAudioPlayer(require('../../assets/sounds/tick.wav'));
  const finish = useAudioPlayer(require('../../assets/sounds/finish.wav'));
  const skip = useAudioPlayer(require('../../assets/sounds/skip.wav'));
  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }).catch(
      () => {},
    );
  }, []);
  return (kind: 'correct' | 'taboo' | 'tick' | 'finish' | 'skip') => {
    if (settings.sound) {
      const player = { correct, taboo, tick, finish, skip }[kind];
      void (async () => {
        try {
          await player.seekTo(0);
          player.play();
        } catch {
          /* Sound must never interrupt a turn. */
        }
      })();
    }
    if (settings.haptics && kind !== 'tick') {
      if (kind === 'taboo' || kind === 'finish')
        void Haptics.notificationAsync(
          kind === 'taboo'
            ? Haptics.NotificationFeedbackType.Error
            : Haptics.NotificationFeedbackType.Success,
        ).catch(() => {});
      else void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };
}
