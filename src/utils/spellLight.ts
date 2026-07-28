// Maps the API's SpellLight enum to a real color, to render a visual
// swatch next to each spell instead of just showing the enum name as
// plain text.
const SPELL_LIGHT_COLORS: Record<string, string> = {
  Blue: "#3b82f6",
  IcyBlue: "#93c5fd",
  Red: "#ef4444",
  Gold: "#d4af37",
  Purple: "#9333ea",
  White: "#f5f5f5",
  Green: "#22c55e",
  Orange: "#f97316",
  Yellow: "#eab308",
  BrightBlue: "#2563eb",
  Pink: "#ec4899",
  Violet: "#7c3aed",
  BlueishWhite: "#dbeafe",
  Silver: "#c0c0c0",
  Scarlet: "#ff2400",
  Fire: "#ff4500",
  FieryScarlet: "#e3242b",
  Grey: "#9ca3af",
  DarkRed: "#8b0000",
  Turquoise: "#40e0d0",
  BrightYellow: "#ffea00",
  BlackSmoke: "#3f3f46",
};

// "None", "Transparent" and "PsychedelicTransparentWave" don't have a
// fixed color that makes sense — the former shows no swatch, the latter
// resolves to a special gradient (see isRainbowLight) instead of a flat
// color.
export function getSpellLightColor(light: string): string | null {
  return SPELL_LIGHT_COLORS[light] ?? null;
}

export function isRainbowLight(light: string): boolean {
  return light === "PsychedelicTransparentWave";
}

// Whether this spell would actually show a light swatch (a flat color or
// the rainbow special-case) — used to filter out spells with no visible
// light at all ("None", "Transparent").
export function hasVisibleLight(light: string): boolean {
  return getSpellLightColor(light) !== null || isRainbowLight(light);
}
