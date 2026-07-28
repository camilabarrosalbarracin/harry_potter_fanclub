import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { UserProfile } from "../utils/identity";
import { getHouseAccent } from "../data/houseContent";
import { getHouseShield } from "../utils/houseAssets";
import { slugifyHouseName } from "../utils/houseSlug";
import { CaretDownIcon } from "./icons";
import styles from "./ProfileModal.module.css";

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onLogout: () => void;
}

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

export default function ProfileModal({ profile, onClose, onLogout }: ProfileModalProps) {
  const accent = getHouseAccent(profile.house.name);
  const shield = getHouseShield(profile.house.name);
  const themeStyle = { "--hp-glow": accent } as CSSProperties;

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className={`dialog ${styles.dialog}`}
        role="dialog"
        aria-modal="true"
        style={themeStyle}
        onClick={stopPropagation}
      >
        <button type="button" aria-label="Close" className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.accentBar} />

        <div className={styles.shieldGlow}>
          {shield && (
            <img src={shield} alt={`${profile.house.name} crest`} className={styles.shield} />
          )}
        </div>

        <div className="dialog-title">
          {profile.firstName} {profile.lastName}
        </div>

        {/* Pill-styled and paired with a rotated caret so it reads as a
           button, not plain text — same caret already used for the
           navbar's "Houses" dropdown, just pointing sideways here. */}
        <Link
          to={`/houses/${slugifyHouseName(profile.house.name)}`}
          className={styles.house}
          onClick={onClose}
        >
          {profile.house.name}
          <span className={styles.houseArrow}>
            <CaretDownIcon size={12} />
          </span>
        </Link>

        <dl className={styles.details}>
          <dt>Email</dt>
          <dd>{profile.email}</dd>
        </dl>

        <button
          type="button"
          className={`btn btn-secondary btn-block ${styles.logoutButton}`}
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
