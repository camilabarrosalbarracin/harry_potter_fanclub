import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import SortingHatModal from "./components/SortingHatModal";
import { useHouses } from "./hooks/useHouses";
import { clearUserProfile, getUserProfile, type UserProfile } from "./utils/identity";
import { AnalyticsEvent, identifyUser, resetIdentity, trackEvent } from "./utils/analytics";
import HomePage from "./pages/HomePage";
import AllHousesPage from "./pages/AllHousesPage";
import HouseDetailPage from "./pages/HouseDetailPage";
import SpellbookPage from "./pages/SpellbookPage";
import PotionsPage from "./pages/PotionsPage";

const PAGE_BY_PATH: Record<string, string> = {
  "/home": "home",
  "/allhouses": "all_houses",
  "/spellbook": "spellbook",
  "/potions": "potions",
};

function App() {
  const location = useLocation();

  // The house detail route is tracked from HouseDetailPage itself, which
  // already has the house data loaded (name, id) to give the event more
  // context instead of just sending the path.
  useEffect(() => {
    if (location.pathname.startsWith("/houses/")) return;
    const page = PAGE_BY_PATH[location.pathname];
    if (!page) return;
    trackEvent(AnalyticsEvent.PageViewed, { path: location.pathname, page });
  }, [location.pathname]);

  // If the person already completed the Sorting Hat in a previous visit,
  // re-identify them to the deterministic userId as soon as the session
  // starts, so every event in this visit is linked too.
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) identifyUser(profile);
  }, []);

  // Lifted here (not in NavBar/HomePage) because the Sorting Hat modal is
  // global: it opens both automatically and from the navbar's button, and
  // needs the houses to resolve the assigned house's id.
  const { houses, loading, error } = useHouses();
  const [isSortingOpen, setSortingOpen] = useState(false);
  // Drives whether the navbar shows "Discover your house" or the profile
  // avatar. Re-read from localStorage when the Sorting Hat modal closes,
  // since that's when a new profile may have just been persisted.
  const [profile, setProfile] = useState<UserProfile | null>(getUserProfile);

  function handleSortingClose() {
    setSortingOpen(false);
    setProfile(getUserProfile());
  }

  // Forgets the current profile and cuts this device's identity link, so a
  // second person can complete the Sorting Hat and get their own profile
  // instead of inheriting this one.
  function handleLogout() {
    clearUserProfile();
    resetIdentity();
    setProfile(null);
  }

  return (
    <>
      <NavBar
        houses={houses}
        profile={profile}
        onOpenSorting={() => setSortingOpen(true)}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <HomePage
              houses={houses}
              loading={loading}
              error={error}
              profile={profile}
              onOpenSorting={() => setSortingOpen(true)}
            />
          }
        />
        <Route
          path="/allhouses"
          element={<AllHousesPage houses={houses} loading={loading} error={error} />}
        />
        <Route
          path="/houses/:slug"
          element={<HouseDetailPage houses={houses} loading={loading} error={error} />}
        />
        <Route path="/spellbook" element={<SpellbookPage />} />
        <Route path="/potions" element={<PotionsPage />} />
      </Routes>
      {isSortingOpen && <SortingHatModal houses={houses} onClose={handleSortingClose} />}
    </>
  );
}

export default App;
