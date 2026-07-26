import { useState } from "react";
import { getOrCreateAnonymousId } from "../utils/identity";

// Se llama una vez desde App al montar la app, para garantizar que el
// anonymousId ya exista en localStorage antes de cualquier interacción
// del usuario (incluida la identificación en el Sorting Hat).
export function useAnonymousId(): string {
  const [anonymousId] = useState(getOrCreateAnonymousId);
  return anonymousId;
}
