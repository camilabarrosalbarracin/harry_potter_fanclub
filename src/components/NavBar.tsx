import { Fragment, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import type { House } from "../api/wizardWorldApi";
import { CaretDownIcon, SparkleIcon } from "./icons";
import ProfileModal from "./ProfileModal";
import { AnalyticsEvent, trackEvent } from "../utils/analytics";
import { getHouseAccent } from "../data/houseContent";
import { getHouseShield } from "../utils/houseAssets";
import { slugifyHouseName } from "../utils/houseSlug";
import type { UserProfile } from "../utils/identity";
import styles from "./NavBar.module.css";

interface NavBarProps {
  houses: House[];
  profile: UserProfile | null;
  onOpenSorting: () => void;
  onLogout: () => void;
}

// Same sections announced in the Home explore grid.
const NAV_SECTIONS = [
  { label: "Spellbook", emoji: "🪄", to: "/spellbook" },
  { label: "Potions", emoji: "🧪", to: "/potions" },
];

// Global (lives in App, not HomePage) because it needs to show on every
// page. Always-visible bar, no hamburger: the name links to Home, and
// "Houses" (right after) opens a dropdown with the 4 houses.
export default function NavBar({ houses, profile, onOpenSorting, onLogout }: NavBarProps) {
  const location = useLocation();
  const [isHousesOpen, setHousesOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  function handleDiscoverClick() {
    trackEvent(AnalyticsEvent.DiscoverYourHouseClicked, { page: location.pathname });
    onOpenSorting();
  }

  function handleProfileOpen() {
    trackEvent(AnalyticsEvent.ProfileOpened, { page: location.pathname });
    setProfileOpen(true);
  }

  // Awaits the event before resetting: trackEvent only queues the event,
  // the actual device_id/user_id enrichment happens later on the timeline,
  // so calling onLogout() (which resets the identity) right after a
  // fire-and-forget trackEvent would race it — this event could end up
  // stamped with the *new*, post-reset anonymous identity instead of the
  // one that's actually logging out.
  async function handleLogout() {
    await trackEvent(AnalyticsEvent.LoggedOut, { page: location.pathname });
    setProfileOpen(false);
    onLogout();
  }

  return (
    <nav className="nav">
      <Link
        to="/home"
        className={`nav-brand ${styles.brandLink}`}
        aria-current={location.pathname === "/home" ? "page" : undefined}
      >
        Harry Potter's Fans Club
      </Link>

      <span className={styles.navDivider} aria-hidden="true" />

      <div className={styles.navItem}>
        <button
          type="button"
          className={styles.navButton}
          aria-expanded={isHousesOpen}
          onClick={() => setHousesOpen((open) => !open)}
        >
          Houses 🏰
          <span className={`${styles.chevron} ${isHousesOpen ? styles.chevronOpen : ""}`}>
            <CaretDownIcon size={12} />
          </span>
        </button>

        {isHousesOpen && (
          <>
            <div className={styles.dropdownBackdrop} onClick={() => setHousesOpen(false)} />
            <div className={styles.dropdown}>
              <Link to="/allhouses" className={styles.dropdownItem} onClick={() => setHousesOpen(false)}>
                All Houses
              </Link>
              <hr className={styles.dropdownDivider} />
              {houses.map((house) => (
                <Link
                  key={house.id}
                  to={`/houses/${slugifyHouseName(house.name)}`}
                  className={styles.dropdownItem}
                  onClick={() => {
                    trackEvent(AnalyticsEvent.ViewHouseClicked, {
                      houseId: house.id,
                      houseName: house.name,
                      source: "nav_menu",
                    });
                    setHousesOpen(false);
                  }}
                >
                  {house.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {NAV_SECTIONS.map((item) => (
        <Fragment key={item.to}>
          <span className={styles.navDivider} aria-hidden="true" />
          <Link to={item.to} aria-current={location.pathname === item.to ? "page" : undefined}>
            {item.label} {item.emoji}
          </Link>
        </Fragment>
      ))}

      {profile ? (
        <ProfileNavItem
          profile={profile}
          isOpen={isProfileOpen}
          onOpen={handleProfileOpen}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      ) : (
        <button
          type="button"
          className={`btn btn-primary ${styles.discoverButton}`}
          onClick={handleDiscoverClick}
        >
          <SparkleIcon />
          Discover your house
        </button>
      )}
    </nav>
  );
}

interface ProfileNavItemProps {
  profile: UserProfile;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLogout: () => void;
}

// The house crest doubles as the "you're signed in" avatar, ringed in the
// person's house color — replaces "Discover your house" once identified.
function ProfileNavItem({ profile, isOpen, onOpen, onClose, onLogout }: ProfileNavItemProps) {
  const shield = getHouseShield(profile.house.name);

  return (
    <>
      <button
        type="button"
        className={`${styles.avatarButton} ${styles.discoverButton}`}
        style={{ "--hp-glow": getHouseAccent(profile.house.name) } as CSSProperties}
        onClick={onOpen}
        aria-label={`${profile.firstName}'s profile`}
      >
        {shield ? (
          <img src={shield} alt="" className={styles.avatarImage} />
        ) : (
          profile.firstName.charAt(0).toUpperCase()
        )}
      </button>
      {isOpen && <ProfileModal profile={profile} onClose={onClose} onLogout={onLogout} />}
    </>
  );
}
