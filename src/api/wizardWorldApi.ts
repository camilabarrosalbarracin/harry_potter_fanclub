// Thin wrapper over the Wizard World API: just fetch + typing, no UI
// logic. This way hooks and components don't depend on the exact shape of
// the URL or on HTTP error handling.
const BASE_URL = "https://wizard-world-api.herokuapp.com";

export interface HouseTrait {
  id: string;
  name: string;
}

// Each "head" already comes with firstName/lastName embedded in /Houses
// (confirmed with a real fetch). It does NOT correspond to a /Wizards id:
// that endpoint is a small, unrelated collection, so there's no need (and
// no way) to resolve it with an extra fetch.
export interface HouseHead {
  id: string;
  firstName: string;
  lastName: string;
}

export interface House {
  id: string;
  name: string;
  houseColours: string;
  founder: string;
  animal: string;
  element: string;
  ghost: string;
  commonRoom: string;
  heads: HouseHead[];
  traits: HouseTrait[];
}

export async function getHouses(): Promise<House[]> {
  const response = await fetch(`${BASE_URL}/Houses`);
  if (!response.ok) {
    throw new Error(`Could not load the houses (status ${response.status})`);
  }
  return response.json();
}

// A different resource from getHouses(): the list is used as a lightweight
// index to resolve the URL slug against a real id, but each house's detail
// is always populated with its own fetch here, instead of reusing the
// object already brought back by /Houses. That way the detail view
// doesn't depend on the list having the full object (it might not,
// if /Houses returns a summarized version tomorrow) and always reflects
// the canonical data from /Houses/:id.
export async function getHouseById(id: string): Promise<House> {
  const response = await fetch(`${BASE_URL}/Houses/${id}`);
  if (!response.ok) {
    throw new Error(`Could not load the house (status ${response.status})`);
  }
  return response.json();
}

export interface Spell {
  id: string;
  name: string;
  incantation: string | null;
  effect: string | null;
  canBeVerbal: boolean | null;
  type: string;
  light: string;
  creator: string | null;
}

// /Spells supports query-string filters (Name, Type, Incantation), but the
// full list is fetched once here and filtered client-side instead (see
// Spellbook): it's a bounded dataset (~300 records, one small payload) and
// this avoids a round-trip per keystroke in the search box.
export async function getSpells(): Promise<Spell[]> {
  const response = await fetch(`${BASE_URL}/Spells`);
  if (!response.ok) {
    throw new Error(`Could not load the spells (status ${response.status})`);
  }
  return response.json();
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface ElixirInventor {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Elixir {
  id: string;
  name: string;
  effect: string | null;
  sideEffects: string | null;
  characteristics: string | null;
  time: string | null;
  difficulty: string;
  ingredients: Ingredient[];
  inventors: ElixirInventor[];
  manufacturer: string | null;
}

export async function getElixirs(): Promise<Elixir[]> {
  const response = await fetch(`${BASE_URL}/Elixirs`);
  if (!response.ok) {
    throw new Error(`Could not load the elixirs (status ${response.status})`);
  }
  return response.json();
}

