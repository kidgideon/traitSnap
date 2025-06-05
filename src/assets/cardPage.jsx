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

  async function handleDownload() {
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

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "traitsnap_card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed. Please try again.");
    }
    setSharing(false);
    setProgress(100);
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
            {/* Card UI omitted for brevity, unchanged */}
          </div>
        </div>

        {/* Share Button */}
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

        {/* ✅ Download Button */}
        <button
          className="personality-card-download-btn"
          style={{ marginLeft: 12, position: "relative", overflow: "hidden" }}
          onClick={handleDownload}
          disabled={sharing}
        >
          {sharing ? (
            <span style={{ position: "relative", zIndex: 2 }}>
              Downloading...
            </span>
          ) : (
            "Download"
          )}
        </button>

        {/* Rest of the component (facts, mascot, ad) unchanged */}
        <div className="context-layout">
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Card;