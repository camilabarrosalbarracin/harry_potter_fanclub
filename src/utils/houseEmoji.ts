// Maps text that already comes from the API (animal, element) to a
// matching emoji, and adds fixed per-house emojis for ghost/common room,
// per the mapping requested by the design handoff. Matching by keyword
// instead of by house: animal/element are stable across houses, but the
// exact commonRoom text can vary more (see ghost/commonRoom).
const ANIMAL_EMOJI: Array<[RegExp, string]> = [
  [/lion/i, "🦁"],
  [/eagle/i, "🦅"],
  [/badger/i, "🦡"],
  [/serpent|snake/i, "🐍"],
];

const ELEMENT_EMOJI: Array<[RegExp, string]> = [
  [/fire/i, "🔥"],
  [/water/i, "💧"],
  [/earth/i, "🌱"],
  [/air/i, "💨"],
];

// Each house's common room doesn't share a common keyword in the text the
// API returns (e.g. Hufflepuff -> "Hufflepuff Basement"), so this mapping
// goes by house name instead of by content.
const COMMON_ROOM_EMOJI: Record<string, string> = {
  Gryffindor: "🏰",
  Ravenclaw: "🏰",
  Slytherin: "🕯️",
  Hufflepuff: "🍽️",
};

function withEmoji(text: string, table: Array<[RegExp, string]>): string {
  const match = table.find(([pattern]) => pattern.test(text));
  return match ? `${text} ${match[1]}` : text;
}

export function animalWithEmoji(animal: string): string {
  return withEmoji(animal, ANIMAL_EMOJI);
}

export function elementWithEmoji(element: string): string {
  return withEmoji(element, ELEMENT_EMOJI);
}

export function ghostWithEmoji(ghost: string): string {
  return `${ghost} 👻`;
}

export function commonRoomWithEmoji(houseName: string, commonRoom: string): string {
  const emoji = COMMON_ROOM_EMOJI[houseName];
  return emoji ? `${commonRoom} ${emoji}` : commonRoom;
}
