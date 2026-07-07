import React, { useState, useEffect } from "react";

import {
  Brain,
  FileText,
  BookOpen,
  Trophy,
  TrendingUp
} from "lucide-react";

function AnalyticsPage() {
  const [data, setData] = useState({
    quizzes_completed: 0,
    learning_score: "0%",
    assignments_completed: 0,
    notes_available: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/analytics", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const json = await response.json();
        if (response.ok && json.stats) {
          setData(json.stats);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  const learningScoreInt = parseInt(data.learning_score) || 0;
  const assignmentsPercent = Math.min(data.assignments_completed * 20, 100);
  const notesPercent = Math.min(data.notes_available * 10, 100);

  const stats = [
    {
      title: "Quizzes Completed",
      value: data.quizzes_completed.toString(),
      icon: <Brain size={28} className="text-blue-400" />,
      color: "blue"
    },
    {
      title: "Assignments Completed",
      value: data.assignments_completed.toString(),
      icon: <FileText size={28} className="text-green-400" />,
      color: "green"
    },
    {
      title: "Notes Available",
      value: data.notes_available.toString(),
      icon: <BookOpen size={28} className="text-purple-400" />,
      color: "purple"
    },
    {
      title: "Learning Score",
      value: data.learning_score,
      icon: <Trophy size={28} className="text-yellow-400" />,
      color: "yellow"
    }
  ];

  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full" />

      {/* Main */}
      <div className="relative z-10 p-8 md:p-12">

        {/* Header */}
        <div>

          <h1 className="text-5xl font-light">
            Analytics
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Track your learning performance and activity.
          </p>

        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-14">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl hover:border-white/20 transition-all duration-300"
            >

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">

                {item.icon}

              </div>

              {/* Value */}
              <h2 className="text-5xl font-semibold mt-8">

                {item.value}

              </h2>

              {/* Title */}
              <p className="text-gray-400 mt-4 text-lg">

                {item.title}

              </p>

            </div>

          ))}

        </div>

        {/* Progress Section */}
        <div className="grid lg:grid-cols-2 gap-10 mt-14">

          {/* Weekly Progress */}
          <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                <TrendingUp
                  className="text-blue-400"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-3xl">
                  Weekly Progress
                </h2>

                <p className="text-gray-400 mt-1">
                  Learning activity this week
                </p>

              </div>

            </div>

            {/* Progress Bars */}
            <div className="mt-10 space-y-8">

              {/* Learning Score */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <p className="text-lg">
                    Learning Score
                  </p>

                  <p className="text-blue-400">
                    {data.learning_score}
                  </p>

                </div>

                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                  <div style={{ width: `${learningScoreInt}%` }} className="h-full bg-blue-500 rounded-full" />

                </div>

              </div>

              {/* Assignments */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <p className="text-lg">
                    Assignments
                  </p>

                  <p className="text-green-400">
                    {assignmentsPercent}%
                  </p>

                </div>

                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                  <div style={{ width: `${assignmentsPercent}%` }} className="h-full bg-green-500 rounded-full" />

                </div>

              </div>

              {/* Notes */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <p className="text-lg">
                    Notes Reading
                  </p>

                  <p className="text-purple-400">
                    {notesPercent}%
                  </p>

                </div>

                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                  <div style={{ width: `${notesPercent}%` }} className="h-full bg-purple-500 rounded-full" />

                </div>

              </div>

            </div>

          </div>

          {/* Performance */}
          <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">

                <Trophy
                  className="text-yellow-400"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-3xl">
                  Performance
                </h2>

                <p className="text-gray-400 mt-1">
                  Your current learning achievements
                </p>

              </div>

            </div>

            {/* Achievements */}
            <div className="mt-10 space-y-6">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <h3 className="text-2xl">
                  🏆 Fast Learner
                </h3>

                <p className="text-gray-400 mt-3">
                  Completed {data.quizzes_completed} quizzes so far.
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <h3 className="text-2xl">
                  📚 Active Reader
                </h3>

                <p className="text-gray-400 mt-3">
                  {data.notes_available} lecture notes available for your class.
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                <h3 className="text-2xl">
                  🚀 Assignment Master
                </h3>

                <p className="text-gray-400 mt-3">
                  Submitted {data.assignments_completed} assignments to the database.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;