import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function QuizPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const questions = [
    {
      question: "What is 2 + 2?",
      options: ["2", "3", "4", "5"],
      answer: "4"
    },
    {
      question: "Capital of India?",
      options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
      answer: "Delhi"
    },
    {
      question: "React is a?",
      options: ["Library", "Framework", "Language", "Database"],
      answer: "Library"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {

    let newScore = score;

    if (option === questions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);

      // ✅ SAVE RESULT FOR DASHBOARD
      localStorage.setItem("lastScore", newScore);
      localStorage.setItem("totalQuestions", questions.length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl">
          🧠 Quiz - <span className="text-blue-400">{id}</span>
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 px-4 py-2 rounded-xl"
        >
          Back
        </button>

      </div>

      {/* Quiz Box */}
      <div className="mt-10 max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-2xl">

        {!showResult ? (
          <>
            <h2 className="text-xl mb-6">
              {questions[current].question}
            </h2>

            <div className="grid gap-4">

              {questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl"
                >
                  {opt}
                </button>
              ))}

            </div>

            <p className="mt-6 text-gray-400">
              Question {current + 1} of {questions.length}
            </p>

          </>
        ) : (
          <div className="text-center">

            <h2 className="text-3xl mb-4">
              Quiz Completed 🎉
            </h2>

            <p className="text-xl text-blue-400">
              Score: {score} / {questions.length}
            </p>

            <button
              onClick={() => {
                setCurrent(0);
                setScore(0);
                setShowResult(false);
              }}
              className="mt-6 bg-blue-500 px-6 py-2 rounded-xl"
            >
              Restart Quiz
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default QuizPage;