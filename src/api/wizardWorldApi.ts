// Wrapper fino sobre la Wizard World API: solo fetch + tipado, sin lógica
// de UI. Así los hooks y componentes no dependen de la forma exacta de la
// URL ni del manejo de errores HTTP.
const BASE_URL = "https://wizard-world-api.herokuapp.com";

export interface HouseTrait {
  id: string;
  name: string;
}

// Cada "head" ya viene con firstName/lastName embebidos en /Houses (se
// confirmó con un fetch real). NO corresponde a un id de /Wizards: ese
// endpoint es una colección chica y no relacionada, así que no hace falta
// (ni funciona) resolverlo con un fetch adicional.
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

export async function getHouseById(id: string): Promise<House> {
  const response = await fetch(`${BASE_URL}/Houses/${id}`);
  if (!response.ok) {
    throw new Error(`Could not load the house (status ${response.status})`);
  }
  return response.json();
}
