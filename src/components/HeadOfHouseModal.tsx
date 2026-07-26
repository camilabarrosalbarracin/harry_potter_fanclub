import type { MouseEvent } from "react";
import { getPersonPhoto } from "../utils/personAssets";
import styles from "./HeadOfHouseModal.module.css";

interface HeadOfHouseModalProps {
  name: string;
  bio?: string;
  onClose: () => void;
}

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

export default function HeadOfHouseModal({ name, bio, onClose }: HeadOfHouseModalProps) {
  const photo = getPersonPhoto(name);

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className={`dialog ${styles.dialog}`}
        role="dialog"
        aria-modal="true"
        onClick={stopPropagation}
      >
        {photo && <img src={photo} alt={name} className={styles.photo} />}
        <div className="dialog-title">{name}</div>
        <div className="dialog-body">
          {bio ?? "No bio available for this character yet."}
        </div>
        <button type="button" className="btn btn-secondary btn-block" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
