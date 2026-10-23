import { useI18n } from '../i18n/LanguageProvider';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowRight,
  ChevronLeft,
  Coffee,
  Compass,
  Clapperboard,
  Leaf,
  Layers3,
  Lightbulb,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { C, FONT } from '../theme';
import { Card } from '../data/cards';
import { getLocalizedCard } from '../data/localizedCards';

export function Txt({ children, style, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text {...props} style={[{ fontFamily: FONT.regular, color: C.text, fontSize: 16 }, style]}>
      {children}
    </Text>
  );
}
export function IconButton({
  icon: Icon,
  children,
  onPress,
  label,
  color = C.text,
  compact = false,
}: {
  icon?: LucideIcon;
  children?: React.ReactNode;
  onPress: () => void;
  label: string;
  color?: string;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        s.iconButton,
        compact && { width: 38, height: 44 },
        { backgroundColor: pressed ? C.panelLight : C.panel },
      ]}
    >
      {children ?? (Icon && <Icon size={21} color={color} strokeWidth={1.8} />)}
    </Pressable>
  );
}
export function Button({
  title,
  onPress,
  color = C.orange,
  secondary = false,
  icon: Icon = ArrowRight,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  secondary?: boolean;
  icon?: LucideIcon | null;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary
          ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line }
          : { backgroundColor: color, borderBottomWidth: 4, borderBottomColor: '#00000024' },
        {
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
          transform: [{ translateY: pressed ? 2 : 0 }],
          ...(pressed && !secondary ? { backgroundColor: color } : {}),
        },
        style,
      ]}
    >
      <Txt
        style={{
          fontFamily: FONT.semibold,
          fontSize: 17,
          color: secondary ? C.text : C.ink,
          flexShrink: 1,
          textAlign: 'center',
        }}
      >
        {title}
      </Txt>
      {Icon && <Icon size={20} color={secondary ? C.text : C.ink} strokeWidth={2.2} />}
    </Pressable>
  );
}
export function Pill({
  children,
  color = C.mint,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[s.pill, { borderColor: `${color}40` }, style]}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Txt style={{ fontSize: 11, fontFamily: FONT.semibold, letterSpacing: 1.3, color }}>
        {children}
      </Txt>
    </View>
  );
}
export function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  return (
    <Txt
      style={[{ color: C.muted, fontSize: 11, fontFamily: FONT.semibold, letterSpacing: 2 }, style]}
    >
      {children}
    </Txt>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  return (
    <View style={{ marginBottom: 26, gap: 8 }}>
      {eyebrow && <SectionLabel style={{ color: C.orange }}>{eyebrow}</SectionLabel>}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Txt
          accessibilityRole="header"
          style={{
            fontFamily: FONT.bold,
            fontSize: width < 600 ? 30 : 38,
            letterSpacing: -1,
            flex: 1,
          }}
        >
          {title}
        </Txt>
        {action}
      </View>
      {subtitle && <Txt style={{ color: C.muted, lineHeight: 24 }}>{subtitle}</Txt>}
    </View>
  );
}
export const DECK_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  coffee: Coffee,
  leaf: Leaf,
  clapperboard: Clapperboard,
  compass: Compass,
  lightbulb: Lightbulb,
  layers: Layers3,
};

export function WordCard({
  card,
  compact = false,
  dense = false,
  color,
}: {
  card: Card;
  compact?: boolean;
  dense?: boolean;
  color?: string;
}) {
  const { t, locale } = useI18n();
  return (
    <View
      style={[s.wordCard, compact && { width: 244, minHeight: 340 }, dense && { minHeight: 0 }]}
    >
      <View
        style={[
          s.cardHeader,
          color ? { backgroundColor: color } : undefined,
          compact && { paddingVertical: 22 },
          dense && { paddingVertical: 14, gap: 8 },
        ]}
      >
        <View style={s.cardMiniLogo}>
          <Zap size={13} color={C.ink} fill={C.ink} />
          <Txt style={s.miniLabel}>OPEN TABOO</Txt>
        </View>
        <Txt
          numberOfLines={2}
          adjustsFontSizeToFit
          style={[s.mainWord, (compact || dense) && { fontSize: 30 }]}
        >
          {card.word.toLocaleUpperCase(locale)}
        </Txt>
      </View>
      <View style={[s.forbiddenBody, dense && { paddingTop: 12, paddingBottom: 0 }]}>
        <View style={s.forbiddenCaption}>
          <View style={s.hairline} />
          <Txt
            style={{ color: '#9C7D8A', fontSize: 9, letterSpacing: 2, fontFamily: FONT.semibold }}
          >
            {t('NON PUOI DIRE')}
          </Txt>
          <View style={s.hairline} />
        </View>
        {card.forbidden.map((word, i) => (
          <View
            key={word}
            style={[
              s.forbiddenRow,
              dense && { paddingVertical: 6 },
              i < 4 && { borderBottomWidth: 1, borderBottomColor: '#EEE4DD' },
            ]}
          >
            <Txt style={{ color: '#C6B5BA', fontFamily: FONT.medium, fontSize: 10 }}>
              {String(i + 1).padStart(2, '0')}
            </Txt>
            <Txt
              style={{
                color: C.ink,
                fontFamily: FONT.semibold,
                fontSize: compact ? 17 : dense ? 18 : 21,
                textAlign: 'center',
                flex: 1,
              }}
            >
              {word}
            </Txt>
            <View style={{ width: 14 }} />
          </View>
        ))}
      </View>
      <View style={[s.cardFoot, dense && { paddingTop: 6, paddingBottom: 12 }]}>
        <Txt style={{ color: '#AA939E', fontSize: 9, letterSpacing: 1.5 }}>
          {t('UNA PAROLA. MILLE POSSIBILITÀ.')}
        </Txt>
        <View style={s.dot} />
      </View>
    </View>
  );
}
export function CardBack({ color = C.orange }: { color?: string }) {
  const { t } = useI18n();
  return (
    <View style={[s.backCard, { backgroundColor: color }]}>
      <View style={s.backOutline}>
        <Zap size={45} strokeWidth={1.5} color={C.ink} fill={C.ink} />
        <Txt
          style={{
            fontFamily: FONT.black,
            fontSize: 47,
            lineHeight: 47,
            color: C.ink,
            letterSpacing: -2,
            textAlign: 'center',
          }}
        >
          OPEN{'\n'}
          {t('TABOO')}
        </Txt>
        <Txt style={{ fontSize: 10, color: C.ink, letterSpacing: 3, marginTop: 18 }}>
          {t('PENSA. PARLA. OSA.')}
        </Txt>
      </View>
    </View>
  );
}
export function FloatingCards() {
  const { t, language } = useI18n();
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [value]);
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: 340,
        height: 412,
        transform: [
          { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
        ],
      }}
    >
      <View style={{ position: 'absolute', top: 26, left: 70, transform: [{ rotate: '17deg' }] }}>
        <CardBack color="#A18AC9" />
      </View>
      <View style={{ position: 'absolute', top: 15, left: 21, transform: [{ rotate: '-12deg' }] }}>
        <CardBack />
      </View>
      <View style={{ position: 'absolute', left: 43, top: 5, transform: [{ rotate: '5deg' }] }}>
        <WordCard compact card={getLocalizedCard('classico-1', language)} />
      </View>
      <View style={s.cardSticker}>
        <Sparkles color={C.ink} size={15} />
        <Txt style={{ fontSize: 11, color: C.ink, fontFamily: FONT.semibold }}>
          {t('Facile? Prova a dirlo!')}
        </Txt>
      </View>
    </Animated.View>
  );
}
export function Confetti({ celebration = false }: { celebration?: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: celebration ? 32 : 14 }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 31 + 7) % 97}%`,
            top: `${(i * 23 + 11) % 90}%`,
            width: i % 3 === 0 ? 9 : 5,
            height: i % 3 === 0 ? 9 : 17,
            borderRadius: i % 3 === 0 ? 10 : 2,
            backgroundColor: [C.coral, C.orange, C.purple, C.mint][i % 4],
            opacity: celebration ? 0.65 : 0.28,
            transform: [{ rotate: `${i * 43}deg` }],
          }}
        />
      ))}
    </View>
  );
}
export function BackLink({
  onPress,
  title = 'Torna alla home',
}: {
  onPress: () => void;
  title?: string;
}) {
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center',
        paddingVertical: 16,
        alignSelf: 'flex-start',
      }}
    >
      <ChevronLeft size={16} color={C.muted} />
      <Txt style={{ fontSize: 13, color: C.muted }}>{t(title)}</Txt>
    </Pressable>
  );
}
export function Choice<T extends string | number>({
  values,
  selected,
  onChange,
  label,
}: {
  values: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <View accessibilityLabel={label} style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap' }}>
      {values.map((item) => (
        <Pressable
          key={item.value}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected === item.value }}
          accessibilityLabel={`${label}: ${item.label}`}
          onPress={() => onChange(item.value)}
          style={({ pressed }) => ({
            flexGrow: 1,
            minWidth: 42,
            paddingHorizontal: 12,
            paddingVertical: 13,
            alignItems: 'center',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: selected === item.value ? C.orange : C.line,
            backgroundColor: selected === item.value ? C.orange : C.panel,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Txt
            style={{
              color: selected === item.value ? C.ink : C.muted,
              fontFamily: FONT.semibold,
              fontSize: 14,
            }}
          >
            {item.label}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.line,
  },
  button: {
    minHeight: 56,
    borderRadius: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF05',
  },
  wordCard: {
    width: '100%',
    maxWidth: 370,
    minHeight: 410,
    backgroundColor: C.cream,
    borderRadius: 23,
    overflow: 'hidden',
    shadowColor: '#10041B',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    backgroundColor: C.coral,
    paddingHorizontal: 20,
    paddingVertical: 27,
    alignItems: 'center',
    gap: 15,
  },
  cardMiniLogo: { flexDirection: 'row', gap: 3, alignItems: 'center', opacity: 0.7 },
  miniLabel: { fontSize: 9, letterSpacing: 2, fontFamily: FONT.bold, color: C.ink },
  mainWord: {
    fontFamily: FONT.black,
    color: C.ink,
    fontSize: 37,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  forbiddenBody: { paddingHorizontal: 25, paddingTop: 17, paddingBottom: 8 },
  forbiddenCaption: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 8 },
  hairline: { flex: 1, height: 1, backgroundColor: '#E2D5D5' },
  forbiddenRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  cardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dot: { width: 5, height: 5, backgroundColor: C.coral, borderRadius: 3 },
  backCard: {
    width: 244,
    height: 352,
    borderRadius: 23,
    padding: 12,
    shadowColor: '#10041B',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },
  backOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#34164B50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  cardSticker: {
    position: 'absolute',
    bottom: 34,
    left: 92,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: C.mint,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 9,
    transform: [{ rotate: '-7deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
});
