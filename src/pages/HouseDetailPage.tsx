import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { ArrowLeftIcon, SparkleIcon } from "../components/icons";
import HeadOfHouseModal from "../components/HeadOfHouseModal";
import Loader from "../components/Loader";
import { getHouseAccent, getHouseTagline } from "../data/houseContent";
import { headsOfHouse } from "../data/headsOfHouse";
import { useHouse } from "../hooks/useHouse";
import { getHouseShield } from "../utils/houseAssets";
import {
  animalWithEmoji,
  commonRoomWithEmoji,
  elementWithEmoji,
  ghostWithEmoji,
} from "../utils/houseEmoji";
import { getHouseHeads } from "../utils/houseHead";
import { getPersonPhoto } from "../utils/personAssets";
import styles from "./HouseDetailPage.module.css";

export default function HouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { house, loading, error } = useHouse(id);
  // Nombre de la persona (founder o algún head) cuya bio se muestra en el
  // modal; null = modal cerrado. Un solo estado alcanza porque solo puede
  // haber una persona seleccionada a la vez.
  const [activePersonName, setActivePersonName] = useState<string | null>(null);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!house) return null;

  const heads = getHouseHeads(house);
  const accent = getHouseAccent(house.name);
  const shield = getHouseShield(house.name);
  const ringStyle = { boxShadow: `0 0 0 2px ${accent}` } as CSSProperties;

  return (
    <main className="page">
      <button
        type="button"
        className={`btn btn-ghost ${styles.backButton}`}
        onClick={() => navigate("/")}
      >
        <ArrowLeftIcon />
        All houses
      </button>

      <div className={styles.layout}>
        <section>
          <div className={styles.headerRow}>
            <div className={styles.shieldBox} style={ringStyle}>
              {shield && (
                <img src={shield} alt={`${house.name} crest`} className={styles.shieldImg} />
              )}
            </div>
            <div>
              <h1 className={styles.name}>{house.name}</h1>
              <p className={`text-muted ${styles.coloursRow}`}>
                <span className={styles.dot} style={{ backgroundColor: accent }} />
                {house.houseColours}
              </p>
            </div>
          </div>

          <p className={`text-muted ${styles.tagline}`}>{getHouseTagline(house.name)}</p>

          <h2 className={styles.sectionTitle}>Traits</h2>
          <div className={styles.traits}>
            {house.traits.map((trait) => (
              <span key={trait.id} className="tag tag-outline">
                <SparkleIcon size={12} />
                {trait.name}
              </span>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>House details</h2>
          <div className={styles.dataGrid}>
            <div>
              <div className={`text-muted ${styles.dataLabel}`}>Founder</div>
              <button
                type="button"
                className={`btn btn-ghost ${styles.founderButton}`}
                onClick={() => setActivePersonName(house.founder)}
              >
                {house.founder} <span className="text-muted">(View)</span>
              </button>
            </div>
            <div>
              <div className={`text-muted ${styles.dataLabel}`}>Animal</div>
              <div>{animalWithEmoji(house.animal)}</div>
            </div>
            <div>
              <div className={`text-muted ${styles.dataLabel}`}>Element</div>
              <div>{elementWithEmoji(house.element)}</div>
            </div>
            <div>
              <div className={`text-muted ${styles.dataLabel}`}>Ghost</div>
              <div>{ghostWithEmoji(house.ghost)}</div>
            </div>
            <div>
              <div className={`text-muted ${styles.dataLabel}`}>Common room</div>
              <div>{commonRoomWithEmoji(house.name, house.commonRoom)}</div>
            </div>
          </div>
        </section>

        <aside className={`card elev-md ${styles.headAside}`}>
          <div className={`card-kicker ${styles.headKicker}`}>
            {heads.length > 1 ? "Heads of House" : "Head of House"}
          </div>
          {heads.length > 0 ? (
            heads.map((head, index) => {
              const fullName = `${head.firstName} ${head.lastName}`;
              const photo = getPersonPhoto(fullName);
              return (
                <div key={head.id}>
                  {index > 0 && <hr className={`hr ${styles.headDivider}`} />}
                  <div className={styles.headEntry}>
                    {photo && <img src={photo} alt={fullName} className={styles.headPhoto} />}
                    <div className={`card-title ${styles.headTitle}`}>{fullName}</div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={() => setActivePersonName(fullName)}
                    >
                      View biography
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No information available.</p>
          )}
        </aside>
      </div>

      {activePersonName && (
        <HeadOfHouseModal
          name={activePersonName}
          bio={headsOfHouse[activePersonName]}
          onClose={() => setActivePersonName(null)}
        />
      )}
    </main>
  );
}
