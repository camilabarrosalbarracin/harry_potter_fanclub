// import.meta.glob (en vez de imports directos por nombre de archivo) para
// que el build no rompa si falta algún escudo en src/assets/houses/: cada
// archivo que se agregue ahí se incorpora automáticamente al mapa, sin
// tocar este archivo.
const shieldModules = import.meta.glob<{ default: string }>(
  "../assets/houses/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const shieldsByFileName: Record<string, string> = {};
for (const path in shieldModules) {
  const fileName = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
  shieldsByFileName[fileName.toLowerCase()] = shieldModules[path].default;
}

// Preferimos la versión "-crest" (fondo transparente) sobre la de fondo
// blanco, ya que las cards ahora tienen fondo oscuro (--color-surface).
export function getHouseShield(houseName: string): string | undefined {
  const slug = houseName.toLowerCase();
  return shieldsByFileName[`${slug}-crest`] ?? shieldsByFileName[slug];
}
