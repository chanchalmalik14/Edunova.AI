import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LayoutDashboard, Brain, BookOpen, FileText, BarChart3, Settings, LogOut, Award, ChevronRight, CheckCircle, Calendar, Sun, Moon } from "lucide-react";

function QuizzesList() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedTitles, setAttemptedTitles] = useState([]);

  // Load quizzes and past student scores
  useEffect(() => {
    const fetchQuizzesAndAttempts = async () => {
      try {
        const token = localStorage.getItem("token");
        const studentEmail = localStorage.getItem("email"); // unique student email

        // Fetch Quizzes list
        const resQuizzes = await fetch("http://127.0.0.1:8000/get-quizzes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dataQuizzes = await resQuizzes.json();
        if (resQuizzes.ok && dataQuizzes.quizzes) {
          setQuizzes(dataQuizzes.quizzes);
        }

        // Fetch student scores to check attempts
        const resStats = await fetch("http://127.0.0.1:8000/analytics", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const dataStats = await resStats.json();
        if (resStats.ok && dataStats.stats?.quiz_titles) {
          setAttemptedTitles(dataStats.stats.quiz_titles); // list of quiz titles student attempted
        }
      } catch (err) {
        console.error("Error loading quizzes page data:", err);
      }
    };

    fetchQuizzesAndAttempts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-white/[0.03] border-r border-gray-200 dark:border-white/10 p-6 hidden md:flex flex-col shadow-sm dark:shadow-none">
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>
        <div className="mt-12 flex flex-col gap-5 text-gray-300">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>
          <div
            onClick={() => navigate("/ai-notes")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Brain size={20} />
            <p>AI Workspace</p>
          </div>
          <div
            onClick={() => navigate("/notes-library")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <BookOpen size={20} />
            <p>Notes Library</p>
          </div>
          <div
            onClick={() => navigate("/assignment")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>
          <div
            onClick={() => navigate("/quizzes")}
            className="flex items-center gap-3 bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white p-3 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-white/10 transition"
          >
            <Award size={20} className="text-blue-400" />
            <p>Quizzes</p>
          </div>
          {/* Attendance */}
          <div
            onClick={() => navigate("/attendance")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Calendar size={20} />
            <p>Attendance</p>
          </div>
          <div
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <BarChart3 size={20} />
            <p>Analytics</p>
          </div>
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Settings size={20} />
            <p>Settings</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 transition-all duration-300 py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-light">Quizzes</h1>
          <p className="text-gray-400 mt-3 text-lg">Test your knowledge and practice your concepts.</p>
        </div>

        {/* Quizzes Grid */}
        <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {quizzes.length === 0 && (
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center col-span-full">
              <Award size={70} className="mx-auto text-gray-500" />
              <h2 className="text-3xl mt-6">No Quizzes Released</h2>
              <p className="text-gray-400 mt-4">Teachers have not published any MCQ quizzes yet.</p>
            </div>
          )}

          {quizzes.map((quiz) => {
            const hasTaken = attemptedTitles.includes(quiz.title);

            return (
              <div
                key={quiz.title}
                className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition duration-300"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <Award className="text-blue-400" size={26} />
                    <h3 className="text-2xl font-light truncate">{quiz.title}</h3>
                  </div>
                  <p className="text-gray-400 mt-4 text-sm">
                    Contains {quiz.questions?.length || 0} multiple choice questions.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  {hasTaken ? (
                    <span className="text-green-400 font-medium flex items-center gap-1.5 text-sm">
                      <CheckCircle size={16} /> Completed
                    </span>
                  ) : (
                    <span className="text-yellow-500 text-sm font-medium">Not Attempted</span>
                  )}

                  <button
                    onClick={() => navigate(`/quiz/${encodeURIComponent(quiz.title)}`)}
                    className={`px-5 py-3 rounded-2xl flex items-center gap-1.5 font-semibold text-sm transition ${
                      hasTaken
                        ? "bg-white/10 hover:bg-white/20 border border-white/10 text-white cursor-pointer"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {hasTaken ? "Review" : "Take Quiz"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuizzesList;


