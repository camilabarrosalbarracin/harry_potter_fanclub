import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { House } from "../api/wizardWorldApi";
import ErrorState from "../components/ErrorState";
import { ArrowLeftIcon, SparkleIcon } from "../components/icons";
import HeadOfHouseModal from "../components/HeadOfHouseModal";
import Loader from "../components/Loader";
import { getHouseAccent, getHouseTagline } from "../data/houseContent";
import { headsOfHouse } from "../data/headsOfHouse";
import { useHouse } from "../hooks/useHouse";
import { getHouseShield } from "../utils/houseAssets";
import { slugifyHouseName } from "../utils/houseSlug";
import {
  animalWithEmoji,
  commonRoomWithEmoji,
  elementWithEmoji,
  ghostWithEmoji,
} from "../utils/houseEmoji";
import { getHouseHeads } from "../utils/houseHead";
import { getPersonPhoto } from "../utils/personAssets";
import { AnalyticsEvent, trackEvent } from "../utils/analytics";
import styles from "./HouseDetailPage.module.css";

interface HouseDetailPageProps {
  houses: House[];
  loading: boolean;
  error: string | null;
}

export default function HouseDetailPage({ houses, loading, error }: HouseDetailPageProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  // The already-loaded list is used only as an index to resolve the URL
  // slug (which doesn't expose the API's raw id) against the house's real
  // id. The detail itself is populated below with its own fetch to
  // /Houses/:id — the list's object is never reused.
  const houseId = houses.find((h) => slugifyHouseName(h.name) === slug)?.id;
  const { house, loading: detailLoading, error: detailError } = useHouse(houseId);
  // Name of the person (founder or a head) whose bio is shown in the
  // modal; null = modal closed. A single piece of state is enough since
  // only one person can be selected at a time.
  const [activePersonName, setActivePersonName] = useState<string | null>(null);

  useEffect(() => {
    if (!house) return;
    trackEvent(AnalyticsEvent.PageViewed, {
      path: `/houses/${slugifyHouseName(house.name)}`,
      page: "house_detail",
      houseId: house.id,
      houseName: house.name,
    });
  }, [house]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!houseId) return <ErrorState message="House not found" />;
  if (detailLoading) return <Loader />;
  if (detailError) return <ErrorState message={detailError} />;
  if (!house) return <ErrorState message="House not found" />;

  const heads = getHouseHeads(house);
  const accent = getHouseAccent(house.name);
  const shield = getHouseShield(house.name);
  const ringStyle = { boxShadow: `0 0 0 2px ${accent}` } as CSSProperties;

  return (
    <main className="page">
      <button
        type="button"
        className={`btn btn-ghost ${styles.backButton}`}
        onClick={() => navigate("/allhouses")}
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
                onClick={() => {
                  trackEvent(AnalyticsEvent.BioViewed, {
                    name: house.founder,
                    personType: "founder",
                    houseId: house.id,
                    houseName: house.name,
                  });
                  setActivePersonName(house.founder);
                }}
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
                      onClick={() => {
                        trackEvent(AnalyticsEvent.BioViewed, {
                          name: fullName,
                          personType: "head_of_house",
                          houseId: house.id,
                          houseName: house.name,
                        });
                        setActivePersonName(fullName);
                      }}
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
