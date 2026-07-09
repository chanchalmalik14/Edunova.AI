import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Brain, BookOpen, FileText, BarChart3, Settings, LogOut, Award, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

function StudentAttendance() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    present_days: 0,
    absent_days: 0,
    total_days: 0,
    percentage: "100%"
  });
  const [loading, setLoading] = useState(true);

  // Fetch student attendance records on load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/get-student-attendance", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.records) {
          // Sort records by date descending
          const sorted = data.records.sort((a, b) => new Date(b.date) - new Date(a.date));
          setRecords(sorted);
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching student attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-3xl font-light">
          Edunova
          <span className="text-blue-400 font-semibold">.AI</span>
        </h1>
        <div className="mt-12 flex flex-col gap-5 text-gray-300">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>
          <div
            onClick={() => navigate("/ai-notes")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Brain size={20} />
            <p>AI Workspace</p>
          </div>
          <div
            onClick={() => navigate("/notes-library")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <BookOpen size={20} />
            <p>Notes Library</p>
          </div>
          <div
            onClick={() => navigate("/assignment")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>
          <div
            onClick={() => navigate("/quizzes")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <Award size={20} />
            <p>Quizzes</p>
          </div>
          <div
            onClick={() => navigate("/attendance")}
            className="flex items-center gap-3 bg-white/5 p-3 rounded-xl text-white cursor-pointer hover:bg-white/10 transition"
          >
            <Calendar size={20} className="text-blue-400" />
            <p>Attendance</p>
          </div>
          <div
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
          >
            <BarChart3 size={20} />
            <p>Analytics</p>
          </div>
          <div
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition cursor-pointer"
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
          <h1 className="text-5xl font-light">My Attendance</h1>
          <p className="text-gray-400 mt-3 text-lg">Review your classroom attendance percentages and historical logs.</p>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading attendance data...</p>
        ) : (
          <div className="mt-12 space-y-8">
            {/* Stats Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Overall Percentage */}
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <h3 className="text-gray-400 text-sm font-medium">Overall Attendance</h3>
                <p className="text-5xl mt-6 text-blue-400 font-light">{stats.percentage}</p>
                <span className="text-xs text-gray-500 mt-4 uppercase tracking-wider">Required: 75%</span>
              </div>

              {/* Days Present */}
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <h3 className="text-gray-400 text-sm font-medium">Days Present</h3>
                <p className="text-5xl mt-6 text-green-400 font-light">{stats.present_days}</p>
                <span className="text-xs text-gray-500 mt-4 uppercase tracking-wider">Days attended</span>
              </div>

              {/* Days Absent */}
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <h3 className="text-gray-400 text-sm font-medium">Days Absent</h3>
                <p className="text-5xl mt-6 text-red-400 font-light">{stats.absent_days}</p>
                <span className="text-xs text-gray-500 mt-4 uppercase tracking-wider">Missed classes</span>
              </div>

              {/* Total Class Days */}
              <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                <h3 className="text-gray-400 text-sm font-medium">Total Working Days</h3>
                <p className="text-5xl mt-6 text-gray-200 font-light">{stats.total_days}</p>
                <span className="text-xs text-gray-500 mt-4 uppercase tracking-wider">Total logged records</span>
              </div>
            </div>

            {/* Attendance Logs List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-gray-200">Daily Log History</h2>

              {records.length === 0 ? (
                <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 text-center">
                  <Clock size={50} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl text-gray-400">No attendance records logged by your teachers yet</h3>
                </div>
              ) : (
                <div className="bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-gray-400 uppercase">
                        <th className="p-5">Class Date</th>
                        <th className="p-5">Grade Level</th>
                        <th className="p-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {records.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition">
                          <td className="p-5 font-medium flex items-center gap-3">
                            <Calendar size={16} className="text-blue-400" />
                            {rec.date}
                          </td>
                          <td className="p-5 text-gray-400 text-sm">{rec.class_name} Grade</td>
                          <td className="p-5 text-right">
                            <span
                              className={`inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold border items-center gap-1.5 ${
                                rec.status === "present"
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}
                            >
                              {rec.status === "present" ? (
                                <>
                                  <CheckCircle size={12} /> Present
                                </>
                              ) : (
                                <>
                                  <XCircle size={12} /> Absent
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAttendance;
