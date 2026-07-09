import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, HelpCircle, CheckCircle, AlertTriangle, Calendar } from "lucide-react";

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Completed check states
  const [hasResult, setHasResult] = useState(false);
  const [pastResult, setPastResult] = useState(null);

  // Fetch Quiz details and student score results
  useEffect(() => {
    const fetchQuizAndResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedId = decodeURIComponent(id);

        // 1. Fetch Quiz details
        const response = await fetch("http://127.0.0.1:8000/get-quizzes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.quizzes) {
          const found = data.quizzes.find((q) => q.title === decodedId);
          if (found) {
            setQuiz(found);
          }
        }

        // 2. Fetch past scores to check if already completed
        const resResults = await fetch("http://127.0.0.1:8000/get-student-results", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dataResults = await resResults.json();
        if (resResults.ok && dataResults.results) {
          const matchedResult = dataResults.results.find((r) => r.quiz_title === decodedId);
          if (matchedResult) {
            setHasResult(true);
            setPastResult(matchedResult);
          }
        }
      } catch (err) {
        console.error("Error loading quiz details & results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndResult();
  }, [id]);

  const handleAnswerSelect = async (selectedOption) => {
    const nextAnswers = [...answers, selectedOption];
    setAnswers(nextAnswers);

    const questionsLength = quiz.questions?.length || 0;

    if (current + 1 < questionsLength) {
      setCurrent(current + 1);
    } else {
      // End of Quiz: Submit answers to backend
      setSubmitting(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            title: quiz.title,
            answers: nextAnswers
          })
        });

        const data = await response.json();
        if (response.ok && data.score !== undefined) {
          setScore(data.score);
        } else {
          alert(data.error || "Failed to save score");
        }
      } catch (err) {
        console.error("Error submitting quiz results:", err);
      } finally {
        setSubmitting(false);
        setShowResult(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading quiz details...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="text-yellow-500" size={50} />
        <h2 className="text-3xl font-light">Quiz Not Found</h2>
        <button onClick={() => navigate(-1)} className="bg-white/10 px-6 py-3 rounded-xl transition hover:bg-white/20">
          Back
        </button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[current];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-light">
          🧠 Quiz: <span className="text-blue-400">{quiz.title}</span>
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 hover:bg-white/20 transition px-5 py-2.5 rounded-xl text-sm"
        >
          Quit
        </button>
      </div>

      {/* Quiz Box */}
      <div className="mt-8 max-w-2xl mx-auto bg-white/[0.03] border border-white/10 p-8 rounded-3xl w-full">
        {hasResult ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h2 className="text-3xl font-light text-green-400">Quiz Completed!</h2>
                <p className="text-gray-400 text-sm mt-1">Review the questions and correct answers below.</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-400">
                  {pastResult?.score} / {pastResult?.total_questions}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 font-semibold">Your Score</p>
              </div>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 mt-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
                  <p className="text-lg font-medium text-gray-200">
                    Q{qIdx + 1}: {q.question}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 pl-2">
                    {q.options?.map((opt, oIdx) => {
                      const isCorrect = opt === q.correct_answer;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3.5 rounded-xl border text-sm transition font-medium ${
                            isCorrect
                              ? "border-green-500/40 bg-green-500/10 text-green-400"
                              : "border-white/5 bg-white/[0.01] text-gray-400"
                          }`}
                        >
                          {opt} {isCorrect && "✓ (Correct Answer)"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/quizzes")}
              className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold w-full mt-4"
            >
              Back to Quizzes
            </button>
          </div>
        ) : !showResult ? (
          currentQuestion && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-200">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(opt)}
                    className="bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition px-6 py-4 rounded-2xl text-left text-sm font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
                <span>Question {current + 1} of {questions.length}</span>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-6 space-y-6">
            <CheckCircle className="text-green-400 mx-auto" size={60} />
            
            <div>
              <h2 className="text-3xl font-light">Quiz Completed!</h2>
              <p className="text-gray-400 text-sm mt-1">Your responses were successfully submitted to MongoDB.</p>
            </div>

            <p className="text-2xl text-gray-200">
              Your Score: <span className="text-blue-400 font-semibold">{score}</span> / {questions.length}
            </p>

            <button
              onClick={() => navigate("/quizzes")}
              className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold w-full mt-4"
            >
              Back to Quizzes
            </button>
          </div>
        )}
      </div>

      <div />
    </div>
  );
}

export default QuizPage;