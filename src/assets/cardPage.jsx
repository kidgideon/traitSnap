import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import "./styles/trait.css";
import logo from "../../images/nobglogo.png";
import comments from "../assets/comments.json"; // Make sure the path is correct

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

  // Calculate average trait percentage
  const traitSum = barPercents.reduce((sum, val) => sum + val, 0);
  const traitAvg = barPercents.length ? traitSum / barPercents.length : 0;
  let sparkRating = Math.round(traitAvg * 0.05 * 2) / 2; // rounded to nearest 0.5

  // Find the trait with the highest score
  const maxTraitIndex = barPercents.indexOf(Math.max(...barPercents));
  const maxTrait = TRAITS[maxTraitIndex];

  // Pick a random compliment for that trait
  let compliment = "";
  if (comments[maxTrait] && comments[maxTrait].length > 0) {
    const randIdx = Math.floor(Math.random() * comments[maxTrait].length);
    compliment = comments[maxTrait][randIdx];
  }

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

  function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="fa-solid fa-star" style={{color: "#FFD700"}}></i>);
      } else if (rating + 0.5 === i) {
        stars.push(<i key={i} className="fa-solid fa-star-half" style={{color: "#FFD700"}}></i>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star" style={{color: "#FFD700"}}></i>);
      }
    }
    return stars;
  }

  return (
    <div className="personality-card-page">
      <div className="personality-card-center">
        <div className="personality-card-fancy-wrapper">
        
          {/* Your card */}
          <div className="personality-card-container" ref={cardRef}>
              {/* Top left SVG */}
          <span className="fancy-svg fancy-svg-topleft">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00F0FF" width="38" height="38">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </span>
        
          {/* Bottom right SVG */}
          <span className="fancy-svg fancy-svg-bottomright">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" width="38" height="38">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </span>

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
                <div className="personality-score">
                  <p> Trait Spark Rating is {sparkRating}</p>
                  <span>{renderStars(sparkRating)}</span>
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
                <p>{compliment}</p>
              </div>
            </div>
          </div>
        </div>

  <button
  className="personality-card-download-btn"
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

 <button className="personality-card-download-btn" onClick={handleDownload}>
          Download Card
        </button>
        
      </div>
    </div>
  );
};

export default Card;
