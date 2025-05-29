import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import "./styles/trait.css";
import logo from "../../images/nobglogo.png";

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
            const percent = Math.round((value / (3 * 5)) * 100);
            return percent;
          })
        );
      }, 200); // slight delay for animation effect
    }
  }, [scores]);

  if (loading || !scores) return <div className="personality-card-loading">Loading...</div>;

  const maxTraitScore = 3 * 5;

  const sociality = scores.sociality || {};
  const dominantSociality = SOCIALITY_TYPES.reduce(
    (max, type) => (sociality[type] > (sociality[max] || 0) ? type : max),
    SOCIALITY_TYPES[0]
  );

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 10,        // Highest quality
      useCORS: true,   // Allow cross-origin images
    });
    const link = document.createElement("a");
    link.download = "personality_card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="personality-card-page">
      <div className="personality-card-center">
        <div className="personality-card-container" ref={cardRef}>
          <div className="pcard-l-a">
 <img className="logo" src={logo} alt="" />
          </div>
          <div className="filter-dark-box">
            <div className="personality-card-header">
              {userPhoto && (
                <div className="personality-card-photo">
                  <img
                    src={userPhoto}
                    alt="Profile"
                    className="personality-card-photo-img"
                  />
                </div>
              )}
              <div className="personality-card-username">{userName}</div>
              <div
                className={`personality-card-sociality-box personality-card-sociality-${dominantSociality.toLowerCase()}`}
              >
                <span className="personality-card-sociality-label"></span>
                <span className="personality-card-sociality-value">
                  {dominantSociality}
                </span>
              </div>
            </div>
            <div className="personality-card-traits">
              {TRAITS.map((trait, index) => (
                <div className="personality-card-trait-row" key={trait}>
                  <div className="personality-card-trait-bar-bg">
                    <div
                      className="personality-card-trait-bar animated-bar"
                      style={{
                        width: `${barPercents[index]}%`,
                        background: TRAIT_GRADIENTS[trait],
                      }}
                    >
                      <span className="personality-card-trait-bar-content">
                        <span className="personality-card-trait-icon">{TRAIT_ICONS[trait]}</span>
                        <span className="personality-card-trait-text">{trait}</span>
                        <span className="personality-card-trait-percent">{barPercents[index]}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="personality-rating">
              <p>you are worth living for</p>
            </div>
          </div>   
        </div>
        <button className="personality-card-download-btn" onClick={handleDownload}>
          Download Card
        </button>
        <button
  className="personality-card-share-btn"
  style={{ marginLeft: 12 }}
  onClick={async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 4,
      useCORS: true,
    });
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const file = new File([blob], "personality_card.png", { type: "image/png" });

    const shareData = {
      title: "TraitSnap Personality Card",
      text: "Check out my personality card! Make yours at TraitSnap.",
      url: "https://traitsnap.vercel.app",
      files: [file]
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied! Share it with your friends: " + shareData.url);
      } catch {
        alert("Copy this link: " + shareData.url);
      }
    }
  }}
>
  Share
</button>
<div className="personality-card-link">
  <span>Make yours: </span>
  <a href="https://traitsnap.vercel.app" target="_blank" rel="noopener noreferrer">
    traitsnap.vercel.app
  </a>
</div>
      </div>
    </div>
  );
};

export default Card;