import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import quizes from "../questions.json";
import "./styles/quiz.css";
import mascot from "../../images/traitsnap_mascot.webp";
import InlineBannerTwo from "./Adtwo";

const TRAITS = [
  "Confidence", "Humor", "Creativity", "Intelligence", "Kindness",
  "Patience", "Courage", "Loyalty", "Anger", "Ambition"
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
  const opts = q.options;
  return {
    id: q.id,
    question: q.question,
    optionA: { text: opts[0].text, points: opts[0].points },
    optionB: { text: opts[1].text, points: opts[1].points },
    ...(opts[2] && { optionC: { text: opts[2].text, points: opts[2].points } }),
    ...(opts[3] && { optionD: { text: opts[3].text, points: opts[3].points } }),
    category,
  };
}

function normalizeSocialityQuestion(q) {
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

const MOTIVATION_MSGS = [
  "Just be honest with your answers for the best results.",
  "Honest answers make your card feel like you",
  "Stay true to yourself for the best results.",
  "Answer honestly for your most accurate card.",
  "Be yourself.",
];

const Quizarea = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [extraMode, setExtraMode] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [extraQuestions, setExtraQuestions] = useState([]);
  const [realTestFlag, setRealTestFlag] = useState(null);
  const [motivationMsg, setMotivationMsg] = useState(MOTIVATION_MSGS[0]);
  const [usedMotivationIndexes, setUsedMotivationIndexes] = useState([0]);

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

  // Prepare initial 23 questions on mount
  useEffect(() => {
    const usedIds = new Set();
    let tempQuestions = [];

    const categories = quizes.categories || [];

    // 2 random questions per trait (20)
    TRAITS.forEach((trait) => {
      const cat = categories.find((c) => c.name === trait);
      if (!cat) return;
      const picked = shuffle(cat.questions)
        .filter((q) => !usedIds.has(q.id))
        .slice(0, 2);
      picked.forEach((q) => {
        tempQuestions.push(normalizeTraitQuestion(q, trait));
        usedIds.add(q.id);
      });
    });

    // 3 random Sociality questions
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

    // Shuffle all questions for quiz order
    const shuffled = shuffle(tempQuestions);
    setQuestions(shuffled);
    setUsedQuestionIds(new Set(shuffled.map(q => q.id)));
  }, []);

  // Option select handler
  const handleOptionSelect = (optionKey) => setSelectedOption(optionKey);

  // Next/Finish handler
  const handleNext = () => {
    if (selectedOption === null) return;
    const currentQ = (extraMode ? extraQuestions : questions)[current];
    const selectedOptionData = currentQ[`option${selectedOption}`];

    setScores((prevScores) => {
      const newScores = { ...prevScores };
      if (currentQ.category === "Sociality" && selectedOptionData.type) {
        const socType = selectedOptionData.type;
        if (newScores[socType] !== undefined) {
          newScores[socType] += selectedOptionData.points;
        }
      } else {
        const trait = currentQ.category;
        if (newScores[trait] !== undefined) {
          newScores[trait] += selectedOptionData.points;
        }
      }
      return newScores;
    });

    setSelectedOption(null);

    // Motivational modal after every 10 questions (except last)
    const totalQ = extraMode ? extraQuestions.length : questions.length;
    if (!extraMode && (current + 1) % 10 === 0 && current + 1 < totalQ) {
      // Pick a message not used yet
      let availableIndexes = MOTIVATION_MSGS.map((_, i) => i).filter(i => !usedMotivationIndexes.includes(i));
      // If all used, reset except for the last one shown
      if (availableIndexes.length === 0) {
        availableIndexes = MOTIVATION_MSGS.map((_, i) => i).filter(i => i !== usedMotivationIndexes[usedMotivationIndexes.length - 1]);
        setUsedMotivationIndexes([]);
      }
      const randomIdx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      setMotivationMsg(MOTIVATION_MSGS[randomIdx]);
      setUsedMotivationIndexes(prev => [...prev, randomIdx]);
      setShowMotivation(true);
      return;
    }

    // After 23rd question, show final modal
    if (!extraMode && current === 22) {
      setShowFinalModal(true);
      return;
    }

    // After 10th extra question, finish
    if (extraMode && current === 9) {
      localStorage.setItem("realtest", "true");
      saveScoresAndGo();
      return;
    }

    setCurrent((c) => c + 1);
  };

  // Continue after motivational modal
  const handleMotivationOk = () => {
    setShowMotivation(false);
    setCurrent((c) => c + 1);
  };

  // Handle "Take More Questions"
  const handleTakeMore = () => {
    // Pick 1 unused question per trait
    const categories = quizes.categories || [];
    let extras = [];
    const usedIds = new Set([...usedQuestionIds]);
    TRAITS.forEach((trait) => {
      const cat = categories.find((c) => c.name === trait);
      if (!cat) return;
      const unused = cat.questions.filter((q) => !usedIds.has(q.id));
      if (unused.length > 0) {
        const picked = shuffle(unused)[0];
        extras.push(normalizeTraitQuestion(picked, trait));
        usedIds.add(picked.id);
      }
    });
    setExtraQuestions(shuffle(extras));
    setExtraMode(true);
    setCurrent(0);
    setShowFinalModal(false);
    setUsedQuestionIds(usedIds);
    setRealTestFlag(true);
  };

  // Handle "Skip"
  const handleSkip = () => {
    localStorage.setItem("realtest", "false");
    saveScoresAndGo();
  };

  // Save scores and go to trait card
  const saveScoresAndGo = () => {
    localStorage.setItem(
      "traitsnap-scores",
      JSON.stringify({
        traits: TRAITS.reduce(
          (acc, t) => ({ ...acc, [t]: scores[t] || 0 }),
          {}
        ),
        sociality: SOCIALITY_TYPES.reduce(
          (acc, s) => ({ ...acc, [s]: scores[s] || 0 }),
          {}
        ),
      })
    );
    navigate("/trait-card");
  };

  // If loading
  const currentQ = extraMode ? extraQuestions[current] : questions[current];
  if (!currentQ) return <div>Loading questions...</div>;

  const optionKeys = ["A", "B"];
  if (currentQ.optionC) optionKeys.push("C");
  if (currentQ.optionD) optionKeys.push("D");

  // Modal animation classes
  const modalClass = (show) => show ? "quiz-modal quiz-modal--show" : "quiz-modal";

  return (
    <div className="quiz-page quizArea-interface">
      <div className="quiz-page__counter">
        {current + 1}/{extraMode ? extraQuestions.length : questions.length}
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
          {(extraMode && current === 9) || (!extraMode && current === 22) ? "Finish" : "Next"}
        </button>
      </div>

     {/* Motivational Modal */}
<div className={modalClass(showMotivation)}>
  <img src={mascot} alt="Traity" className="quiz-modal__mascot" />
  <div className="quiz-modal__content">
    <h3>Keep Going!</h3>
    <p>{motivationMsg}</p>
    <button className="quiz-modal__btn" onClick={handleMotivationOk}>OK</button>
  </div>
</div>

{/* Final Modal */}
<div className={modalClass(showFinalModal)}>
  <img src={mascot} alt="Traity" className="quiz-modal__mascot" />
  <div className="quiz-modal__content">
    <h3>You've completed the core test!</h3>
    <p>
      You can view your result now.<br />
      <b>But for best accuracy, take 10 more questions</b>
    </p>
    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 16 , width: "100%"}}>
      <button className="quiz-modal__btn" onClick={handleTakeMore}>Continue</button>
      <button className="quiz-modal__btn quiz-modal__btn--skip" onClick={handleSkip}>Finish</button>
    </div>
  </div>
</div>


<InlineBannerTwo />

    </div>
  );
};

export default Quizarea;