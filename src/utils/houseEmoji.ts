// Mapea texto que ya viene de la API (animal, elemento) a un emoji
// acorde, y agrega emojis fijos por casa para fantasma/sala común, según
// el mapeo pedido por el handoff de diseño. Matching por palabra clave en
// vez de por casa: animal/elemento son estables entre houses pero el
// texto exacto de commonRoom puede variar más (ver ghost/commonRoom).
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

// La sala común de cada casa no comparte una palabra clave común en el
// texto que devuelve la API (ej. Hufflepuff -> "Hufflepuff Basement"), así
// que este mapeo va por nombre de casa en vez de por contenido.
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
