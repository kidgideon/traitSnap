import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./styles/trait.css";

const TRAITS = [
  "Confidence", "Humor", "Creativity", "Intelligence", "Kindness",
  "Patience", "Courage", "Loyalty", "Anger", "Ambition"
];
const SOCIALITY_TYPES = ["Introvert", "Ambivert", "Extrovert"];

const Card = () => {
  const [scores, setScores] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const cardRef = useRef();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("traitsnap-scores") || "{}");
    setScores(data);
    setUserName(localStorage.getItem("traitsnap-name") || "Your Name");
    setUserPhoto(localStorage.getItem("traitsnap-photo") || "");
  }, []);

  // Clear localStorage after card is loaded
  useEffect(() => {
    if (scores) {
      localStorage.removeItem("traitsnap-scores");
      localStorage.removeItem("traitsnap-name");
      localStorage.removeItem("traitsnap-photo");
    }
  }, [scores]);

  if (!scores) return <div className="personality-card-loading">Loading...</div>;

  // Each trait: 3 questions, each can give up to 5 points
  const maxTraitScore = 3 * 5; // adjust if your max per question is different

  const sociality = scores.sociality || {};
  const dominantSociality = SOCIALITY_TYPES.reduce(
    (max, type) => (sociality[type] > (sociality[max] || 0) ? type : max),
    SOCIALITY_TYPES[0]
  );

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null });
    const link = document.createElement("a");
    link.download = "personality_card.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="personality-card-page">
      <div className="personality-card-center">
        <div className="personality-card-container" ref={cardRef}>
          <div className="personality-card-header">
            {userPhoto && (
              <img
                src={userPhoto}
                alt="Profile"
                className="personality-card-photo"
              />
            )}
            <div className="personality-card-username">{userName}</div>
            <div className="personality-card-sociality">
              <span className="personality-card-sociality-label">Sociality:</span>
              <span className={`personality-card-sociality-value personality-card-sociality-${dominantSociality.toLowerCase()}`}>
                {dominantSociality}
              </span>
            </div>
          </div>
          <div className="personality-card-traits">
            {TRAITS.map((trait) => {
              const value = scores.traits?.[trait] || 0;
              // Clamp percent to 100 max just in case
              const percent = Math.min(100, Math.round((value / maxTraitScore) * 100));
              return (
                <div className="personality-card-trait-row" key={trait}>
                  <div className="personality-card-trait-label">{trait}</div>
                  <div className="personality-card-trait-bar-bg">
                    <div
                      className="personality-card-trait-bar"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="personality-card-trait-percent">{percent}%</div>
                </div>
              );
            })}
          </div>
        </div>
        <button className="personality-card-download-btn" onClick={handleDownload}>
          Download Card
        </button>
      </div>
    </div>
  );
};

export default Card;