import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, Users, LogOut, Brain, Plus, Trash2, CheckCircle, HelpCircle, Award, Settings, Calendar, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function TeacherQuizzes() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Tab: "ai" (Generate Quiz), "manual" (Create Custom), "results" (Review Results)
  const [activeTab, setActiveTab] = useState("ai");

  // AI Quiz Generation States
  const [notesText, setNotesText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiPreviewQuiz, setAiPreviewQuiz] = useState(null);

  // Manual Quiz Creation States
  const [manualTitle, setManualTitle] = useState("");
  const [manualQuestions, setManualQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct_answer: "" }
  ]);

  // Results State
  const [results, setResults] = useState([]);

  // Fetch Results
  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/view-results", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error("Error loading results:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handle AI Quiz Generation
  const handleGenerateAIQuiz = async (e) => {
    e.preventDefault();
    if (!notesText.trim()) {
      alert("Please paste study notes or content to generate questions");
      return;
    }

    setLoadingAI(true);
    setAiPreviewQuiz(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/generate-ai-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: notesText })
      });
      const data = await response.json();

      if (response.ok && data.quiz) {
        setAiPreviewQuiz(data.quiz);
      } else {
        alert(data.error || "Failed to generate AI quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error generating AI quiz");
    } finally {
      setLoadingAI(false);
    }
  };

  // Publish AI Quiz
  const handlePublishAIQuiz = async () => {
    if (!aiPreviewQuiz) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(aiPreviewQuiz)
      });
      const data = await response.json();

      if (response.ok) {
        alert("AI Quiz Published Successfully ðŸš€");
        setAiPreviewQuiz(null);
        setNotesText("");
      } else {
        alert(data.message || "Failed to publish AI quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error publishing quiz");
    }
  };

  // Manual Creation Handlers
  const handleAddQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      { question: "", options: ["", "", "", ""], correct_answer: "" }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...manualQuestions];
    updated.splice(index, 1);
    setManualQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...manualQuestions];
    updated[index][field] = value;
    setManualQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...manualQuestions];
    updated[qIndex].options[oIndex] = value;
    setManualQuestions(updated);
  };

  const handleCreateManualQuiz = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      alert("Please specify a quiz title");
      return;
    }

    for (let q of manualQuestions) {
      if (!q.question.trim() || !q.correct_answer.trim()) {
        alert("Please complete all questions and correct answer designations");
        return;
      }
      for (let opt of q.options) {
        if (!opt.trim()) {
          alert("All question options must be populated");
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: manualTitle,
          questions: manualQuestions
        })
      });
      const data = await response.json();

      if (response.ok) {
        alert("Custom Quiz Created Successfully ðŸš€");
        setManualTitle("");
        setManualQuestions([{ question: "", options: ["", "", "", ""], correct_answer: "" }]);
      } else {
        alert(data.message || "Failed to create custom quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error creating quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/10 p-6 hidden md:flex flex-col shadow-sm dark:shadow-none">
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>
        <div className="mt-12 flex flex-col gap-2 text-gray-600 dark:text-gray-300 flex-1">
          <div
            onClick={() => navigate("/teacher-dashboard")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>
          <div
            onClick={() => navigate("/upload-notes")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Upload size={20} />
            <p>Upload Notes</p>
          </div>
          <div
            onClick={() => navigate("/teacher-assignments")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>
          <div
            onClick={() => navigate("/teacher-quizzes")}
            className="flex items-center gap-3 bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white p-3 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-white/10 transition"
          >
            <Award size={20} />
            <p>Quizzes</p>
          </div>
          <div
            onClick={() => navigate("/student-management")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Users size={20} />
            <p>Students</p>
          </div>
          <div
            onClick={() => navigate("/teacher-attendance")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Calendar size={20} />
            <p>Attendance</p>
          </div>
          <div
            onClick={() => navigate("/teacher-settings")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Settings size={20} />
            <p>Settings</p>
          </div>
          <div onClick={toggleTheme} className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 mt-2">
            {theme === "dark" ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-500"/>}
            <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-light">Quiz Hub</h1>
            <p className="text-gray-400 mt-3 text-lg">Generate AI multiple choice questions and review scores.</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-5 py-2.5 rounded-xl transition duration-300 font-medium ${
                activeTab === "ai" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              AI Generator
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-5 py-2.5 rounded-xl transition duration-300 font-medium ${
                activeTab === "manual" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Custom Quiz
            </button>
            <button
              onClick={() => {
                setActiveTab("results");
                fetchResults();
              }}
              className={`px-5 py-2.5 rounded-xl transition duration-300 font-medium ${
                activeTab === "results" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Results ({results.length})
            </button>
          </div>
        </div>

        {/* AI GENERATOR TAB */}
        {activeTab === "ai" && (
          <div className="mt-12 space-y-8">
            <form onSubmit={handleGenerateAIQuiz} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-light">Generate Quiz with Gemini</h2>
              <p className="text-sm text-gray-400">Paste your class lecture notes or topic details below, and Gemini will automatically generate 5 multiple choice questions.</p>
              
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste class content here (e.g. Photosynthesis involves taking carbon dioxide and water to generate glucose...)"
                className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 h-40 resize-none text-gray-200 mt-2"
              />

              <button
                type="submit"
                disabled={loadingAI}
                className="bg-blue-500 hover:bg-blue-600 transition px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold disabled:bg-blue-500/50"
              >
                <Brain size={20} />
                {loadingAI ? "Generating MCQs..." : "Generate AI Quiz"}
              </button>
            </form>

            {/* AI Preview */}
            {aiPreviewQuiz && (
              <div className="bg-white/[0.04] border border-blue-500/30 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-2xl font-light text-blue-400">AI Preview: {aiPreviewQuiz.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Review the generated questions below before publishing.</p>
                  </div>
                  <button
                    onClick={handlePublishAIQuiz}
                    className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Publish Quiz
                  </button>
                </div>

                <div className="space-y-6">
                  {aiPreviewQuiz.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
                      <p className="text-lg font-medium">Q{qIdx + 1}: {q.question}</p>
                      <div className="grid md:grid-cols-2 gap-3 pl-2">
                        {q.options?.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border text-sm ${
                              opt === q.correct_answer
                                ? "border-green-500/40 bg-green-500/10 text-green-400"
                                : "border-white/5 bg-white/[0.02] text-gray-400"
                            }`}
                          >
                            {opt} {opt === q.correct_answer && "âœ“ (Correct)"}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CUSTOM QUIZ TAB */}
        {activeTab === "manual" && (
          <form onSubmit={handleCreateManualQuiz} className="mt-12 bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-light">Build Custom MCQ Quiz</h2>

            <div>
              <label className="block mb-2 text-gray-400">Quiz Title</label>
              <input
                type="text"
                placeholder="Term 1 Science Quiz"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-8 pt-4">
              {manualQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-400">Question #{qIdx + 1}</span>
                    {manualQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-red-400 hover:text-red-500 flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-400 font-medium">Question Text</label>
                    <input
                      type="text"
                      placeholder="What is the chemical symbol for gold?"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                      className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx}>
                        <label className="block mb-2 text-xs text-gray-400">Option {oIdx + 1}</label>
                        <input
                          type="text"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-400 font-medium">Correct Answer Value</label>
                    <select
                      value={q.correct_answer}
                      onChange={(e) => handleQuestionChange(qIdx, "correct_answer", e.target.value)}
                      className="w-full bg-white/10 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                    >
                      <option value="" disabled className="bg-gray-900">-- Choose correct option value --</option>
                      {q.options.map((opt, oIdx) => (
                        <option key={oIdx} value={opt} disabled={!opt} className="bg-gray-900">
                          {opt || `(Option ${oIdx + 1} empty)`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-white/5 hover:bg-white/10 border border-white/10 transition px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Add Question
              </button>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3 rounded-xl flex items-center gap-2 font-semibold"
              >
                <CheckCircle size={18} />
                Save & Publish Quiz
              </button>
            </div>
          </form>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && (
          <div className="mt-12">
            <h2 className="text-3xl font-light">Student Results</h2>

            <div className="mt-8 space-y-4">
              {results.length === 0 && (
                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center col-span-full">
                  <HelpCircle size={60} className="mx-auto text-gray-500" />
                  <h3 className="text-2xl mt-5 text-gray-400">No student quiz attempts recorded yet</h3>
                </div>
              )}

              {results.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-lg">
                      {Math.round((res.score / res.total_questions) * 100)}%
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{res.quiz_title}</h3>
                      <p className="text-gray-400 text-sm mt-0.5">Attempted by: {res.student_email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl text-blue-400 font-semibold">{res.score} / {res.total_questions}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Correct Answers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherQuizzes;

