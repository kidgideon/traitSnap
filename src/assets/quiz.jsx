import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quizes from "../questions.json";
import "./styles/quiz.css"

const TRAITS = [
  "Confidence",
  "Humor",
  "Creativity",
  "Intelligence",
  "Kindness",
  "Patience",
  "Courage",
  "Loyalty",
  "Anger",
  "Ambition",
];
const SOCIALITY_TYPES = ["Introvert", "Ambivert", "Extrovert"];

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeTraitQuestion(q, category) {
  // Always returns optionA, optionB, and (if present) optionC, optionD
  const opts = q.options;
  return {
    id: q.id,
    question: q.question,
    optionA: { text: opts[0].text, points: opts[0].points },
    optionB: { text: opts[1].text, points: opts[1].points },
    ...(opts[2] && {
      optionC: { text: opts[2].text, points: opts[2].points },
    }),
    ...(opts[3] && {
      optionD: { text: opts[3].text, points: opts[3].points },
    }),
    category,
  };
}

function normalizeSocialityQuestion(q) {
  // Each option has a type field
  const opts = q.options;
  return {
    id: q.id,
    question: q.question,
    optionA: { text: opts[0].text, points: opts[0].points, type: opts[0].type },
    optionB: { text: opts[1].text, points: opts[1].points, type: opts[1].type },
    optionC: { text: opts[2].text, points: opts[2].points, type: opts[2].type },
    category: "Sociality",
  };
}

const Quizarea = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  // Scores for all traits and sociality types
  const [scores, setScores] = useState(() => {
    const initial = {};
    TRAITS.forEach((t) => (initial[t] = 0));
    SOCIALITY_TYPES.forEach((s) => (initial[s] = 0));
    return initial;
  });

  const userPhoto = localStorage.getItem("traitsnap-photo");
  const userName = localStorage.getItem("traitsnap-name");

  // Redirect if name or photo is missing
  useEffect(() => {
    if (!userPhoto || !userName) {
      navigate("/");
    }
  }, [userPhoto, userName, navigate]);

  // Prepare questions on mount
  useEffect(() => {
    const usedIds = new Set();
    let tempQuestions = [];

    // Find categories in JSON
    const categories = quizes.categories || [];

    // 1. Add 3 random questions per trait
    TRAITS.forEach((trait) => {
      const cat = categories.find((c) => c.name === trait);
      if (!cat) return;
      const picked = shuffle(cat.questions)
        .filter((q) => !usedIds.has(q.id))
        .slice(0, 3);
      picked.forEach((q) => {
        tempQuestions.push(normalizeTraitQuestion(q, trait));
        usedIds.add(q.id);
      });
    });

    // 2. Add 3 random Sociality questions
    const socialityCat = categories.find((c) => c.name === "Sociality");
    if (socialityCat) {
      const picked = shuffle(socialityCat.questions)
        .filter((q) => !usedIds.has(q.id))
        .slice(0, 3);
      picked.forEach((q) => {
        tempQuestions.push(normalizeSocialityQuestion(q));
        usedIds.add(q.id);
      });
    }

    // 3. Shuffle all questions for quiz order
    setQuestions(shuffle(tempQuestions));
  }, []);

  // Option select handler
  const handleOptionSelect = (optionKey) => setSelectedOption(optionKey);

  // Next/Finish handler
  const handleNext = () => {
    if (selectedOption === null) return;
    const currentQ = questions[current];
    const selectedOptionData = currentQ[`option${selectedOption}`];

    setScores((prevScores) => {
      const newScores = { ...prevScores };
      if (currentQ.category === "Sociality" && selectedOptionData.type) {
        // Sociality: add to type
        const socType = selectedOptionData.type;
        if (newScores[socType] !== undefined) {
          newScores[socType] += selectedOptionData.points;
        }
      } else {
        // Trait: add to trait
        const trait = currentQ.category;
        if (newScores[trait] !== undefined) {
          newScores[trait] += selectedOptionData.points;
        }
      }
      return newScores;
    });

    setSelectedOption(null);

    // If last question, save and navigate
    if (current === questions.length - 1) {
      // Synchronously update scores for last question
      const finalScores = { ...scores };
      if (currentQ.category === "Sociality" && selectedOptionData.type) {
        const socType = selectedOptionData.type;
        if (finalScores[socType] !== undefined) {
          finalScores[socType] += selectedOptionData.points;
        }
      } else {
        const trait = currentQ.category;
        if (finalScores[trait] !== undefined) {
          finalScores[trait] += selectedOptionData.points;
        }
      }
      // Save to localStorage
      localStorage.setItem(
        "traitsnap-scores",
        JSON.stringify({
          traits: TRAITS.reduce(
            (acc, t) => ({ ...acc, [t]: finalScores[t] || 0 }),
            {}
          ),
          sociality: SOCIALITY_TYPES.reduce(
            (acc, s) => ({ ...acc, [s]: finalScores[s] || 0 }),
            {}
          ),
        })
      );
      navigate("/trait-card");
      return;
    }
    setCurrent((c) => c + 1);
  };

  if (questions.length === 0) return <div>Loading questions...</div>;

  const currentQ = questions[current];
  const optionKeys = ["A", "B"];
  if (currentQ.optionC) optionKeys.push("C");
  if (currentQ.optionD) optionKeys.push("D");

  return (
    <div className="quiz-page quizArea-interface">
      <div className="quiz-page__counter">
        {current + 1}/{questions.length}
      </div>
      {userPhoto && (
        <div className="quiz-page__photo">
          <img
            src={userPhoto}
            alt="User"
            className="quiz-page__photo-img"
          />
        </div>
      )}

      <div key={currentQ.id} className="quiz-page__question">
        <h3>{currentQ.question}</h3>
      </div>

      <div className="quiz-page__options">
        {optionKeys.map((key) => {
          const option = currentQ[`option${key}`];
          return (
            <button
              key={key}
              onClick={() => handleOptionSelect(key)}
              className={`quiz-page__option-btn${selectedOption === key ? " quiz-page__option-btn--selected" : ""}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <div className="quiz-page__nav">
        <button
          disabled={selectedOption === null}
          onClick={handleNext}
          className="quiz-page__nav-btn"
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quizarea;