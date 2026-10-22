import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../assets/', import.meta.url);
await mkdir(new URL('sounds/', root), { recursive: true });
const mark = `<g transform="translate(512 512) rotate(-9)"><rect x="-267" y="-297" width="534" height="594" rx="114" fill="#FF817C"/><rect x="-240" y="-270" width="480" height="540" rx="94" fill="none" stroke="#34164B" stroke-opacity=".22" stroke-width="7"/><path d="M41 -210 L-133 29 L-10 29 L-44 210 L141 -43 L18 -43 Z" fill="#291148"/></g>`;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="216" fill="#291148"/><circle cx="512" cy="512" r="420" fill="none" stroke="#53386A" stroke-width="3"/>${mark}<circle cx="824" cy="232" r="20" fill="#FFB64C"/><path d="M179 775 l25 30" stroke="#A3D7B4" stroke-width="15" stroke-linecap="round"/></svg>`;
const adaptive = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g transform="translate(145 145) scale(.717)">${mark}</g></svg>`;
await writeFile(new URL('icon.svg', root), icon);
await sharp(Buffer.from(icon))
  .png()
  .toFile(fileURLToPath(new URL('icon.png', root)));
await sharp(Buffer.from(adaptive))
  .png()
  .toFile(fileURLToPath(new URL('adaptive-icon.png', root)));
await sharp(Buffer.from(icon))
  .resize(64, 64)
  .png()
  .toFile(fileURLToPath(new URL('favicon.png', root)));

// PCM WAV: suoni sintetizzati originali, riproducibili senza rete o licenze esterne.
function wav(notes, duration, type = 'sine', gain = 0.25) {
  const rate = 22050,
    count = Math.floor(rate * duration),
    out = Buffer.alloc(44 + count * 2);
  out.write('RIFF');
  out.writeUInt32LE(out.length - 8, 4);
  out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22);
  out.writeUInt32LE(rate, 24);
  out.writeUInt32LE(rate * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    let sample = 0;
    for (const [freq, start, length] of notes) {
      const local = t - start;
      if (local < 0 || local >= length) continue;
      const env = Math.min(1, local / 0.008) * Math.min(1, (length - local) / 0.04);
      const phase = 2 * Math.PI * freq * local;
      sample +=
        (type === 'buzzer'
          ? Math.sin(phase) * 0.65 + Math.sin(phase * 3) * 0.25
          : Math.sin(phase)) *
        env *
        gain;
    }
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + i * 2);
  }
  return out;
}
for (const [name, notes, duration, type] of [
  [
    'correct',
    [
      [659, 0, 0.14],
      [880, 0.11, 0.23],
    ],
    0.37,
    'sine',
  ],
  [
    'taboo',
    [
      [140, 0, 0.32],
      [110, 0.13, 0.25],
    ],
    0.41,
    'buzzer',
  ],
  ['tick', [[1050, 0, 0.075]], 0.1, 'sine'],
  [
    'skip',
    [
      [520, 0, 0.09],
      [390, 0.07, 0.12],
    ],
    0.22,
    'sine',
  ],
  [
    'finish',
    [
      [523, 0, 0.15],
      [659, 0.14, 0.15],
      [784, 0.28, 0.16],
      [1047, 0.43, 0.4],
    ],
    0.87,
    'sine',
  ],
])
  await writeFile(new URL(`sounds/${name}.wav`, root), wav(notes, duration, type));
console.log('Icone e 5 effetti sonori generati in assets/.');
