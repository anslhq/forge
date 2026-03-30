import { parse, converter } from 'culori';

const clamp255 = (x) => Math.max(0, Math.min(255, Math.round(x * 255)));

const toRgb = (s) => {
  const c = parse(s.trim());
  if (!c) throw new Error(`bad: ${s}`);
  const rgb = converter('rgb')(c);
  const r = clamp255(rgb.r);
  const g = clamp255(rgb.g);
  const b = clamp255(rgb.b);
  const a = rgb.alpha;
  if (a !== undefined && a < 1) return `${r} ${g} ${b} / ${a}`;
  return `${r} ${g} ${b}`;
};

const light = {
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  primary: 'oklch(0.525 0.223 3.958)',
  primaryForeground: 'oklch(0.971 0.014 343.198)',
  secondary: 'oklch(0.967 0.001 286.375)',
  secondaryForeground: 'oklch(0.21 0.006 285.885)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  accent: 'oklch(0.97 0 0)',
  accentForeground: 'oklch(0.205 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: 'oklch(0.592 0.249 0.584)',
  sidebarPrimaryForeground: 'oklch(0.971 0.014 343.198)',
  sidebarAccent: 'oklch(0.97 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(0.922 0 0)',
  sidebarRing: 'oklch(0.708 0 0)',
};

const dark = {
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  primary: 'oklch(0.459 0.187 3.815)',
  primaryForeground: 'oklch(0.971 0.014 343.198)',
  secondary: 'oklch(0.274 0.006 286.033)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: 'oklch(0.269 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: 'oklch(0.556 0 0)',
  sidebar: 'oklch(0.205 0 0)',
  sidebarForeground: 'oklch(0.985 0 0)',
  sidebarPrimary: 'oklch(0.656 0.241 354.308)',
  sidebarPrimaryForeground: 'oklch(0.971 0.014 343.198)',
  sidebarAccent: 'oklch(0.269 0 0)',
  sidebarAccentForeground: 'oklch(0.985 0 0)',
  sidebarBorder: 'oklch(1 0 0 / 10%)',
  sidebarRing: 'oklch(0.556 0 0)',
};

for (const [k, v] of Object.entries(light)) {
  console.log(`light.${k}`, toRgb(v));
}
console.log('---');
for (const [k, v] of Object.entries(dark)) {
  console.log(`dark.${k}`, toRgb(v));
}
