import type { House, HouseHead } from "../api/wizardWorldApi";

// If the same person shows up as both founder AND head (e.g. Godric
// Gryffindor in Gryffindor), they're excluded here to avoid repeating
// them: they're already shown as clickable in the "Founder" field. This
// list keeps only the heads that aren't the founder (there can be more
// than one, e.g. Slytherin: Snape + Slughorn).
export function getHouseHeads(house: House): HouseHead[] {
  return house.heads.filter(
    (head) => `${head.firstName} ${head.lastName}` !== house.founder
  );
}
