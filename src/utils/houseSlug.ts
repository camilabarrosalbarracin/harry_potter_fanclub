// Converts the house name into the slug used in the URL
// (/houses/gryffindor) instead of the API's raw id.
export function slugifyHouseName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
