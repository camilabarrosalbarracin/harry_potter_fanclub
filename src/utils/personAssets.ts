// Same pattern as houseAssets.ts: import.meta.glob so the build doesn't
// break while src/assets/people/ is empty or incomplete. The expected file
// name is the person's full name in kebab-case with no accents (see
// slugify), e.g. "Minerva McGonagall" -> "minerva-mcgonagall.png".
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
