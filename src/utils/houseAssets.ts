// import.meta.glob (instead of direct imports by file name) so the build
// doesn't break if a shield is missing from src/assets/houses/: any file
// added there gets picked up into the map automatically, without touching
// this file.
const shieldModules = import.meta.glob<{ default: string }>(
  "../assets/houses/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const shieldsByFileName: Record<string, string> = {};
for (const path in shieldModules) {
  const fileName = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  shieldsByFileName[fileName.toLowerCase()] = shieldModules[path].default;
}

// We prefer the "-crest" version (transparent background) over the white
// background one, since the cards now have a dark background
// (--color-surface).
export function getHouseShield(houseName: string): string | undefined {
  const slug = houseName.toLowerCase();
  return shieldsByFileName[`${slug}-crest`] ?? shieldsByFileName[slug];
}
