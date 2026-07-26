import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { House } from "../api/wizardWorldApi";
import { getHouseAccent } from "../data/houseContent";
import { getHouseShield } from "../utils/houseAssets";
import styles from "./HouseCard.module.css";

interface HouseCardProps {
  house: House;
}

export default function HouseCard({ house }: HouseCardProps) {
  const shield = getHouseShield(house.name);
  const cardStyle = { "--hp-glow": getHouseAccent(house.name) } as CSSProperties;

  return (
    <article className={`card elev-sm ${styles.card}`} style={cardStyle}>
      <div className={styles.accent} />
      {shield && <img src={shield} alt={`${house.name} crest`} className={styles.shield} />}
      <div className="card-title">{house.name}</div>
      <p className="card-body">{house.houseColours}</p>
      <Link to={`/houses/${house.id}`} className={`btn btn-secondary btn-block ${styles.button}`}>
        View house
      </Link>
    </article>
  );
}
