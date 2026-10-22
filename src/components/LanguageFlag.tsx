import { useId } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { Language } from '../i18n';

// Local vector artwork also renders on devices without flag emoji fonts.
export function LanguageFlag({ language, size = 36 }: { language: Language; size?: number }) {
  const clip = `language-flag-${useId().replace(/:/g, '')}`;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 60 40"
      preserveAspectRatio="none"
      accessible={false}
    >
      <Defs>
        <ClipPath id={clip}>
          <Rect width={60} height={40} rx={5} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clip})`}>
        {language === 'it' && (
          <>
            <Rect width={60} height={40} fill="#FFFFFF" />
            <Rect width={20} height={40} fill="#009246" />
            <Rect x={40} width={20} height={40} fill="#CE2B37" />
          </>
        )}
        {language === 'en' && (
          <>
            <Rect width={60} height={40} fill="#012169" />
            <Path d="M0 0 60 40M60 0 0 40" stroke="#FFFFFF" strokeWidth={8} />
            <Path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth={3} />
            <Path d="M30 0V40M0 20H60" stroke="#FFFFFF" strokeWidth={14} />
            <Path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth={8} />
          </>
        )}
        {language === 'es' && (
          <>
            <Rect width={60} height={40} fill="#AA151B" />
            <Rect y={10} width={60} height={20} fill="#F1BF00" />
            <Path d="M16 16H24V23Q20 28 16 23Z" fill="#AA151B" />
            <Path d="M17 17H20V20H17ZM20 20H23V23H20Z" fill="#FFFFFF" />
            <Path d="M16 14H24L22 12 20 14 18 12Z" fill="#AA151B" />
          </>
        )}
        {language === 'de' && (
          <>
            <Rect width={60} height={40} fill="#FFCE00" />
            <Rect width={60} height={40 / 3} fill="#151515" />
            <Rect y={40 / 3} width={60} height={40 / 3} fill="#DD0000" />
          </>
        )}
        {language === 'fr' && (
          <>
            <Rect width={60} height={40} fill="#FFFFFF" />
            <Rect width={20} height={40} fill="#002395" />
            <Rect x={40} width={20} height={40} fill="#ED2939" />
          </>
        )}
      </G>
      <Rect x={0.5} y={0.5} width={59} height={39} rx={5} fill="none" stroke="#FFFFFF30" />
    </Svg>
  );
}
