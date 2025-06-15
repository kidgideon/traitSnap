import React, { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { useNavigate } from "react-router-dom";
import "./styles/trait.css";
import logo from "../../images/nobglogo.webp";
import comments from "../assets/comments.json";
import facts from "../assets/facts.json";
import BannerAd from "./Ad";
import Shield from "../../images/shield.webp";
import mascot from "../../images/traitsnap_mascot.webp";
import InlineBannerTwo from "./adtwo";

const TRAITS = [
  "Confidence", "Humor", "Creativity", "Intelligence", "Kindness",
  "Patience", "Courage", "Loyalty", "Anger", "Ambition"
];

const SOCIALITY_TYPES = ["Introvert", "Ambivert", "Extrovert"];

const TRAIT_ICONS = {
  Confidence: "💪",
  Humor: "😂",
  Creativity: "🎨",
  Intelligence: "🧠",
  Kindness: "💖",
  Patience: "🕰️",
  Courage: "🦁",
  Loyalty: "🤝",
  Anger: "😡",
  Ambition: "🚀",
};

const TRAIT_GRADIENTS = {
  Confidence: "linear-gradient(90deg, #FFC371, #FF5F6D)",
  Humor: "linear-gradient(90deg, #f7ff00, #db36a4)",
  Creativity: "linear-gradient(90deg, #00c3ff, #ffff1c)",
  Intelligence: "linear-gradient(90deg, #4facfe, #00f2fe)",
  Kindness: "linear-gradient(90deg, #43e97b, #38f9d7)",
  Patience: "linear-gradient(90deg, #a1c4fd, #c2e9fb)",
  Courage: "linear-gradient(90deg, #f83600, #f9d423)",
  Loyalty: "linear-gradient(90deg, #1a2980, #26d0ce)",
  Anger: "linear-gradient(90deg, #ff416c, #ff4b2b)",
  Ambition: "linear-gradient(90deg, #bc4e9c, #f80759)",
};

const Card = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barPercents, setBarPercents] = useState(Array(TRAITS.length).fill(0));
  const [sharing, setSharing] = useState(false);
  const [realTest, setRealTest] = useState(() => localStorage.getItem("realtest") === "true");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false); // NEW
  const [downloadProgress, setDownloadProgress] = useState(0); // NEW
  const cardRef = useRef();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("traitsnap-scores") || "{}");
    setScores(data);
    setUserName(localStorage.getItem("traitsnap-name"));
    setUserPhoto(localStorage.getItem("traitsnap-photo"));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && (!userName || !userPhoto)) {
      navigate("/");
    }
  }, [userName, userPhoto, loading, navigate]);

  useEffect(() => {
    if (scores) {
      setTimeout(() => {
        setBarPercents(
          TRAITS.map(trait => {
            const value = scores.traits?.[trait] || 0;
            const maxTraitScore = realTest ? 3 * 5 : 2 * 5;
            return Math.round((value / maxTraitScore) * 100);
          })
        );
      }, 200);
    }
  }, [scores, realTest]);

  useEffect(() => {
    const handleStorage = () => setRealTest(localStorage.getItem("realtest") === "true");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (loading || !scores)
    return <div className="personality-card-loading">Loading...</div>;

  const sociality = scores.sociality || {};
  const dominantSociality = SOCIALITY_TYPES.reduce(
    (max, type) => (sociality[type] > (sociality[max] || 0) ? type : max),
    SOCIALITY_TYPES[0]
  );

  const traitSum = barPercents.reduce((sum, val) => sum + val, 0);
  const traitAvg = barPercents.length ? traitSum / barPercents.length : 0;
  let sparkRating = Math.round(traitAvg * 0.05 * 2) / 2;

  const maxTraitIndex = barPercents.indexOf(Math.max(...barPercents));
  const maxTrait = TRAITS[maxTraitIndex];

  let compliment = "";
  if (comments[maxTrait] && comments[maxTrait].length > 0) {
    const randIdx = Math.floor(Math.random() * comments[maxTrait].length);
    compliment = comments[maxTrait][randIdx];
  }

  async function waitForImagesLoaded(container) {
    const images = container.querySelectorAll("img");
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(res => {
        img.onload = img.onerror = res;
      });
    }));
  }

  async function handleShare() {
    setSharing(true);
    setProgress(0);
    try {
      if (!cardRef.current) throw new Error("Card not ready");
      await waitForImagesLoaded(cardRef.current);

      const width = cardRef.current.offsetWidth;
      const height = cardRef.current.offsetHeight;

      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1,
        backgroundColor: null,
        cacheBust: true,
        width: width * 4,
        height: height * 4,
        pixelRatio: 2,
        style: {
          transform: "scale(4)",
          transformOrigin: "top left",
          width: width + "px",
          height: height + "px"
        }
      });

      const file = new File([blob], "personality_card.png", { type: "image/png" });
      const shareData = {
        title: "TraitSnap Personality Card",
        text: "Check out my personality card! Make yours at TraitSnap.",
        url: "https://traitsnap.vercel.app"
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          ...shareData,
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied! Share it with your friends: " + shareData.url);
      }
    } catch (err) {
      alert("Sharing failed. Please try again or copy the link manually.");
    }
    setSharing(false);
    setProgress(100);
  }

  // ---- NEW: Download button handler with progress bar ----
  async function handleDownload() {
    setDownloading(true);
    setDownloadProgress(10);

    try {
      if (!cardRef.current) throw new Error("Card not ready");
      await waitForImagesLoaded(cardRef.current);

      setDownloadProgress(40);

      const width = cardRef.current.offsetWidth;
      const height = cardRef.current.offsetHeight;

      // Simulate progress updates
      setDownloadProgress(60);

      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1,
        backgroundColor: null,
        cacheBust: true,
        width: width * 4,
        height: height * 4,
        pixelRatio: 2,
        style: {
          transform: "scale(4)",
          transformOrigin: "top left",
          width: width + "px",
          height: height + "px"
        }
      });

      setDownloadProgress(80);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "personality_card.png";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      setDownloadProgress(100);
    } catch (err) {
      setDownloadProgress(0);
      alert("Download failed. Please try again.");
    }
    setTimeout(() => {
      setDownloading(false);
      setDownloadProgress(0);
    }, 600); // delay allows bar to reach 100%
  }

  function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "1.2em" }}>★</span>);
      } else if (rating >= i - 0.5) {
        stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "1.2em" }}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "1.2em" }}>✩</span>);
      }
    }
    return stars;
  }

  return (
    <div className="personality-card-page">
      <div className="personality-card-center">
        <div className="personality-card-fancy-wrapper">
          <div className="personality-card-container" ref={cardRef}>
            {/* Top left SVG */}
            <span className="fancy-svg fancy-svg-topleft">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00F0FF" width="38" height="38">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 11.25 9 11.25s9-4.03 9-11.25z" />
              </svg>
            </span>
            {/* Bottom right SVG */}
            <span className="fancy-svg fancy-svg-bottomright">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" width="38" height="38">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09z" />
              </svg>
            </span>

            {realTest && (
              <img className="fancy-svg shield-per-real-test-users" src={Shield} alt="" />
            )}

            <div className="pcard-l-a">
              <img className="logo" src={logo} alt="" />
            </div>
            <div className="filter-dark-box">
              <div className="personality-card-header">
                <div className="pch-left">
                  <div className="personality-card-photo">
                    <img
                      src={userPhoto}
                      alt="Profile"
                      className="personality-card-photo-img"
                    />
                  </div>
                  <div className="personality-card-username">{userName}</div>
                </div>
                <div className="pch-right">
                  <div
                    className={`personality-card-sociality-box personality-card-sociality-${dominantSociality.toLowerCase()}`}
                  >
                    <span className="personality-card-sociality-label"></span>
                    <span className="personality-card-sociality-value">
                      {dominantSociality}
                    </span>
                  </div>
                  <div className="personality-score">
                    <p>Trait Spark Rating is {sparkRating}</p>
                    <span>{renderStars(sparkRating)}</span>
                  </div>
                </div>
              </div>
              <div className="personality-card-traits">
                {TRAITS.map((trait, index) => (
                  <div className="personality-card-trait-row" key={trait}>
                    <div className="personality-card-trait-bar-bg" style={{ position: "relative" }}>
                      <div
                        className="personality-card-trait-bar animated-bar"
                        style={{
                          width: `${barPercents[index]}%`,
                          background: TRAIT_GRADIENTS[trait],
                          height: "100%",
                          position: "absolute",
                          left: 0,
                          top: 0,
                          zIndex: 1,
                        }}
                      />
                      <span className="personality-card-trait-bar-content" style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        paddingLeft: 8,
                        paddingRight: 8,
                      }}>
                        <span className="personality-card-trait-icon">{TRAIT_ICONS[trait]}</span>
                        <span className="personality-card-trait-text">{trait}</span>
                        <span className="personality-card-trait-percent">{barPercents[index]}%</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="personality-rating">
                <p>{compliment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button (NEW, above Share) */}
        <button
          className="personality-card-download-btn"
          style={{ marginLeft: 12, position: "relative", overflow: "hidden", minWidth: 180 }}
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <span>Downloading</span>
              {/* Progress bar */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 4,
                  background: "#00f0ff",
                  width: `${downloadProgress}%`,
                  transition: "width 0.2s"
                }}
              />
            </>
          ) : (
            "Download"
          )}
        </button>

        {/* Share Button (existing) */}
        <button
          className="personality-card-download-btn"
          style={{ marginLeft: 12, position: "relative", overflow: "hidden" }}
          onClick={handleShare}
          disabled={sharing}
        >
          {sharing ? (
            <span style={{ position: "relative", zIndex: 2 }}>
              Sharing...
            </span>
          ) : (
            "Share"
          )}
        </button>

        <div className="context-layout">
          <section className="faq-section">
            <h2>Facts on your traits</h2>

 <div className="mascot-are">
              <img src={mascot} alt="" />
            </div>
<InlineBannerTwo />
           
            <div className="faq-list">
              {TRAITS.map((trait, idx) => {
                const percent = barPercents[idx];
                let band = null;
                if (percent >= 90) band = "90-100";
                else if (percent >= 70) band = "70-80";
                else if (percent >= 50) band = "50-60";
                else if (percent >= 30) band = "30-40";
                else band = "10-20";
                const fact = facts[trait] && facts[trait][band];
                return (
                  <div key={trait}>
                    <h4>{trait}</h4>
                    <p>{fact || "No fact available for this range."}</p>
                  </div>
                );
              })}
            </div>

 <div className="mascot-are">
              <img src={mascot} alt="" />
            </div>
            <BannerAd />
            
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
