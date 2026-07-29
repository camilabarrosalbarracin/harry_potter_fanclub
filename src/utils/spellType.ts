// The API returns SpellType as PascalCase words glued together (e.g.
// "DarkCharm", "HealingSpell"). This splits the ones that actually read
// as more than one word, so they show up spaced instead of squished
// together. Single-word values (Charm, Curse, Hex, Jinx, Vanishment...)
// don't need an entry, they fall through to the raw value.
const SPELL_TYPE_LABELS: Record<string, string> = {
  HealingSpell: "Healing Spell",
  DarkCharm: "Dark Charm",
  MagicalTransportation: "Magical Transportation",
  CounterSpell: "Counter Spell",
  DarkArts: "Dark Arts",
  CounterJinx: "Counter Jinx",
  CounterCharm: "Counter Charm",
  BindingMagicalContract: "Binding Magical Contract",
};

export function getSpellTypeLabel(type: string): string {
  return SPELL_TYPE_LABELS[type] ?? type;
}
