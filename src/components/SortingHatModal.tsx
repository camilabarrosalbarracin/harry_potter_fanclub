import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import sortingHatImg from "../assets/sorting-hat.png";
import type { House } from "../api/wizardWorldApi";
import Loader from "./Loader";
import { getHouseTagline } from "../data/houseContent";
import { getHouseShield } from "../utils/houseAssets";
import { getHouseFromEmail } from "../utils/sortingAlgorithm";
import { createUserProfile, dismissSortingHat, getUserProfile } from "../utils/identity";
import { AnalyticsEvent, identifyUser, trackEvent } from "../utils/analytics";
import styles from "./SortingHatModal.module.css";

interface SortingHatModalProps {
  houses: House[];
  onClose: () => void;
}

type Stage = "intro" | "form" | "loading" | "result";

// Ceremonial pause between submitting the form and showing the result:
// gives the "loading" stage time to actually show instead of jumping
// straight through (the calculation itself is local and instant).
const SORTING_DELAY_MS = 1600;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
}

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

export default function SortingHatModal({ houses, onClose }: SortingHatModalProps) {
  const location = useLocation();
  const [stage, setStage] = useState<Stage>("intro");
  const [form, setForm] = useState<FormState>({ nombre: "", apellido: "", email: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [assignedHouse, setAssignedHouse] = useState<House | null>(null);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: Partial<FormState> = {};
    if (!form.nombre.trim()) nextErrors.nombre = "Enter your first name";
    if (!form.apellido.trim()) nextErrors.apellido = "Enter your last name";
    if (!form.email.trim()) {
      nextErrors.email = "Enter your email";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "That email doesn't look valid";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const houseName = getHouseFromEmail(form.email.trim());
    const house = houses.find((h) => h.name === houseName) ?? null;
    const isRetake = Boolean(getUserProfile());
    trackEvent(AnalyticsEvent.SortingHatSubmitted, {
      house: houseName,
      page: location.pathname,
      isRetake,
    });
    setAssignedHouse(house);
    setStage("loading");
  }

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = setTimeout(() => setStage("result"), SORTING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  function handleDismiss() {
    dismissSortingHat();
    onClose();
  }

  function handleNotNow() {
    trackEvent(AnalyticsEvent.SortingHatNotNowClicked, { page: location.pathname });
    handleDismiss();
  }

  // The profile is only persisted here: it's saved "on close" from the
  // positive result, not as soon as the house is calculated.
  async function handleCloseResult() {
    if (assignedHouse) {
      // No reset here on purpose: this device's identity was already left
      // clean by the last logout (or was never identified at all), so this
      // funnel's earlier anonymous events (Discover Your House Clicked,
      // Sorting Hat Form Submitted) share this same device_id and get
      // merged into the profile below once identifyUser() sets the userId.
      const profile = await createUserProfile({
        firstName: form.nombre.trim(),
        lastName: form.apellido.trim(),
        email: form.email.trim(),
        house: { id: assignedHouse.id, name: assignedHouse.name },
      });
      identifyUser(profile);
    }
    onClose();
  }

  if (stage === "intro") {
    return (
      <div className="dialog-backdrop" onClick={handleDismiss}>
        <div className="dialog" role="dialog" aria-modal="true" onClick={stopPropagation}>
          <div className="dialog-title">The Sorting Hat</div>
          <img src={sortingHatImg} alt="The Sorting Hat" className={styles.introImage} />
          <div className="dialog-body">
            An old, patched-up hat, yet able to look inside your soul. If you're ready, let it
            decide which of the four houses you belong to.
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={handleNotNow}>
              Not now
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStage("form")}>
              Discover my house
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "form") {
    return (
      <div className="dialog-backdrop" onClick={handleDismiss}>
        <div
          className="dialog"
          role="dialog"
          aria-modal="true"
          style={{ position: "relative" }}
          onClick={stopPropagation}
        >
          <button
            type="button"
            aria-label="Close"
            className={styles.closeButton}
            onClick={handleDismiss}
          >
            ×
          </button>
          <div className="dialog-title">Tell us who you are</div>
          <div className="dialog-body">
            The Sorting Hat needs your name to read your destiny.
          </div>
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className="field">
              <label htmlFor="sorting-nombre">First name</label>
              <input
                id="sorting-nombre"
                className="input"
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>
            <div className="field">
              <label htmlFor="sorting-apellido">Last name</label>
              <input
                id="sorting-apellido"
                className="input"
                type="text"
                value={form.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
              />
              {errors.apellido && <span className="field-error">{errors.apellido}</span>}
            </div>
            <div className="field">
              <label htmlFor="sorting-email">Email</label>
              <input
                id="sorting-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="dialog-actions">
              <button type="submit" className="btn btn-primary btn-block">
                Discover My House
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (stage === "loading") {
    return (
      <div className="dialog-backdrop" onClick={handleDismiss}>
        <div
          className={`dialog ${styles.resultDialog}`}
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          onClick={stopPropagation}
        >
          <Loader label="The Hat is deciding..." />
        </div>
      </div>
    );
  }

  // stage === "result"
  const shield = assignedHouse ? getHouseShield(assignedHouse.name) : undefined;

  return (
    <div className="dialog-backdrop" onClick={handleCloseResult}>
      <div
        className={`dialog ${styles.resultDialog}`}
        role="dialog"
        aria-modal="true"
        onClick={stopPropagation}
      >
        <button
          type="button"
          aria-label="Close"
          className={styles.closeButton}
          onClick={handleCloseResult}
        >
          ×
        </button>
        {shield && assignedHouse && (
          <img src={shield} alt={`${assignedHouse.name} crest`} className={styles.resultShield} />
        )}
        <div className="dialog-title">You belong to {assignedHouse?.name}</div>
        <div className="dialog-body">
          {assignedHouse ? getHouseTagline(assignedHouse.name) : ""}
        </div>
      </div>
    </div>
  );
}
