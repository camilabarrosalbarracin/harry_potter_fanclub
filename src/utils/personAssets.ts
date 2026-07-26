// Mismo patrón que houseAssets.ts: import.meta.glob para que el build no
// rompa mientras src/assets/people/ esté vacía o incompleta. El nombre de
// archivo esperado es el nombre completo de la persona en kebab-case y
// sin acentos (ver slugify), ej. "Minerva McGonagall" -> "minerva-mcgonagall.png".
const photoModules = import.meta.glob<{ default: string }>(
  "../assets/people/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const photosByPersonName: Record<string, string> = {};
for (const path in photoModules) {
  const fileName = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  photosByPersonName[fileName.toLowerCase()] = photoModules[path].default;
}

const DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getPersonPhoto(fullName: string): string | undefined {
  return photosByPersonName[slugify(fullName)];
}
