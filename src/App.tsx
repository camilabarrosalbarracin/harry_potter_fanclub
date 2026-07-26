import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SortingHatModal from "./components/SortingHatModal";
import { useAnonymousId } from "./hooks/useAnonymousId";
import { useHouses } from "./hooks/useHouses";
import HomePage from "./pages/HomePage";
import HouseDetailPage from "./pages/HouseDetailPage";

function App() {
  // Garantiza que anonymousId exista en localStorage desde el primer
  // render de la app, antes de cualquier interacción del usuario.
  useAnonymousId();

  // Se levanta acá (no en HomePage) porque el nav y el modal del Sombrero
  // son globales: el botón "Descubre tu casa" tiene que poder abrirlo
  // desde cualquier página, y el modal necesita las casas para resolver
  // el id de la casa asignada.
  const { houses, loading, error } = useHouses();
  const [isSortingOpen, setSortingOpen] = useState(false);

  return (
    <>
      <NavBar onOpenSorting={() => setSortingOpen(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              houses={houses}
              loading={loading}
              error={error}
              onAutoOpenSorting={() => setSortingOpen(true)}
            />
          }
        />
        <Route path="/houses/:id" element={<HouseDetailPage />} />
      </Routes>
      {isSortingOpen && <SortingHatModal houses={houses} onClose={() => setSortingOpen(false)} />}
    </>
  );
}

export default App;
