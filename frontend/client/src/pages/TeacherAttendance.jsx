import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, Users, LogOut, Award, Settings, Calendar, Check, X, ShieldAlert, CheckSquare, MinusSquare } from "lucide-react";

function TeacherAttendance() {
  const navigate = useNavigate();

  // Tab state: "mark" (Mark Attendance), "history" (View Past Records)
  const [activeTab, setActiveTab] = useState("mark");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [studentClass, setStudentClass] = useState("9th");
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // student_email -> "present" | "absent"
  const [loading, setLoading] = useState(false);

  // History Tab States
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [historyClass, setHistoryClass] = useState("9th");
  const [historyRecords, setHistoryRecords] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyFetched, setHistoryFetched] = useState(false);

  // Load students when class changes
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/get-students", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.students) {
        // Filter students by selected class (case-insensitive or exact)
        const classStudents = data.students.filter(
          (s) => s.student_class?.toLowerCase() === studentClass.toLowerCase()
        );
        setStudents(classStudents);

        // Pre-fetch any existing attendance for this class/date to edit
        const resPast = await fetch(
          `http://127.0.0.1:8000/get-class-attendance?class_name=${studentClass}&date=${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const dataPast = await resPast.json();

        const initialMap = {};
        if (resPast.ok && dataPast.records && dataPast.records.length > 0) {
          dataPast.records.forEach((rec) => {
            initialMap[rec.student_email] = rec.status;
          });
        } else {
          // Default all to present
          classStudents.forEach((s) => {
            initialMap[s.email] = "present";
          });
        }
        setAttendanceMap(initialMap);
      }
    } catch (err) {
      console.error("Error loading students list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "mark") {
      fetchStudents();
    }
  }, [studentClass, date, activeTab]);

  // Toggle status for individual student
  const handleToggle = (email, status) => {
    setAttendanceMap({
      ...attendanceMap,
      [email]: status
    });
  };

  // Quick Toggles
  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.email] = status;
    });
    setAttendanceMap(updated);
  };

  // Submit Attendance
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (students.length === 0) {
      alert("No students found in this class to mark attendance");
      return;
    }

    const payloadRecords = students.map((s) => ({
      student_email: s.email,
      student_name: s.full_name,
      status: attendanceMap[s.email] || "present"
    }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/submit-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: date,
          class_name: studentClass,
          records: payloadRecords
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Attendance submitted successfully! ðŸ“");
      } else {
        alert(data.message || "Failed to submit attendance");
      }
    } catch (err) {
      console.error(err);
      alert("Server error submitting attendance");
    }
  };

  // Fetch History Records
  const handleFetchHistory = async (e) => {
    e.preventDefault();
    setLoadingHistory(true);
    setHistoryFetched(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/get-class-attendance?class_name=${historyClass}&date=${historyDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (response.ok && data.records) {
        setHistoryRecords(data.records);
      } else {
        setHistoryRecords([]);
      }
    } catch (err) {
      console.error(err);
      setHistoryRecords([]);
    } finally {
      setLoadingHistory(false);
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
        <div className="mt-12 flex flex-col gap-5 text-gray-300">
          <div
            onClick={() => navigate("/teacher-dashboard")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </div>
          <div
            onClick={() => navigate("/upload-notes")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Upload size={20} />
            <p>Upload Notes</p>
          </div>
          <div
            onClick={() => navigate("/teacher-assignments")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <FileText size={20} />
            <p>Assignments</p>
          </div>
          <div
            onClick={() => navigate("/teacher-quizzes")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Award size={20} />
            <p>Quizzes</p>
          </div>
          <div
            onClick={() => navigate("/student-management")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Users size={20} />
            <p>Students</p>
          </div>
          <div
            onClick={() => navigate("/teacher-attendance")}
            className="flex items-center gap-3 bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-white p-3 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-white/10 transition"
          >
            <Calendar size={20} className="text-blue-400" />
            <p>Attendance</p>
          </div>
          <div
            onClick={() => navigate("/teacher-settings")}
            className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-white/5 p-3 rounded-xl transition cursor-pointer text-gray-600 dark:text-gray-300"
          >
            <Settings size={20} />
            <p>Settings</p>
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
            <h1 className="text-5xl font-light">Attendance</h1>
            <p className="text-gray-400 mt-3 text-lg">Mark daily classroom attendance and review history logs.</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit font-medium">
            <button
              onClick={() => setActiveTab("mark")}
              className={`px-5 py-2.5 rounded-xl transition duration-300 ${
                activeTab === "mark" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Mark Daily
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2.5 rounded-xl transition duration-300 ${
                activeTab === "history" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Attendance History
            </button>
          </div>
        </div>

        {/* MARK TAB */}
        {activeTab === "mark" && (
          <div className="mt-12 space-y-8">
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm text-gray-400">Target Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">Class / Grade</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                >
                  <option value="9th" className="bg-gray-900">9th Grade</option>
                  <option value="10th" className="bg-gray-900">10th Grade</option>
                  <option value="11th" className="bg-gray-900">11th Grade</option>
                  <option value="12th" className="bg-gray-900">12th Grade</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-400 text-center py-10">Fetching student roster...</p>
            ) : students.length === 0 ? (
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
                <ShieldAlert size={50} className="mx-auto text-yellow-500/80 mb-4" />
                <h3 className="text-xl text-gray-300">No students registered in {studentClass} Grade</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <span className="text-sm text-gray-400">Quick Actions for {students.length} students:</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleMarkAll("present")}
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <CheckSquare size={14} /> Mark All Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkAll("absent")}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <MinusSquare size={14} /> Mark All Absent
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-gray-400 uppercase">
                        <th className="p-5">Student Name</th>
                        <th className="p-5">Email Address</th>
                        <th className="p-5 text-center">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {students.map((stud) => {
                        const status = attendanceMap[stud.email] || "present";
                        return (
                          <tr key={stud.email} className="hover:bg-white/[0.02] transition">
                            <td className="p-5 font-medium">{stud.full_name}</td>
                            <td className="p-5 text-gray-400 text-sm">{stud.email}</td>
                            <td className="p-5">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(stud.email, "present")}
                                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                    status === "present"
                                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                                  }`}
                                >
                                  <Check size={14} /> Present
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggle(stud.email, "absent")}
                                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                    status === "absent"
                                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                                  }`}
                                >
                                  <X size={14} /> Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 transition px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20 text-sm"
                  >
                    Save & Submit Daily Attendance
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="mt-12 space-y-8">
            <form onSubmit={handleFetchHistory} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 grid md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block mb-2 text-sm text-gray-400">Search Date</label>
                <input
                  type="date"
                  value={historyDate}
                  onChange={(e) => setHistoryDate(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">Search Class</label>
                <select
                  value={historyClass}
                  onChange={(e) => setHistoryClass(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                >
                  <option value="9th" className="bg-gray-900">9th Grade</option>
                  <option value="10th" className="bg-gray-900">10th Grade</option>
                  <option value="11th" className="bg-gray-900">11th Grade</option>
                  <option value="12th" className="bg-gray-900">12th Grade</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 transition py-3.5 rounded-2xl font-semibold text-sm"
              >
                Search Records
              </button>
            </form>

            {loadingHistory ? (
              <p className="text-gray-400 text-center py-10">Fetching records from DB...</p>
            ) : historyFetched && historyRecords.length === 0 ? (
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
                <ShieldAlert size={50} className="mx-auto text-yellow-500/80 mb-4" />
                <h3 className="text-xl text-gray-300">No attendance records found for {historyClass} Grade on {historyDate}</h3>
              </div>
            ) : historyRecords.length > 0 ? (
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-xl font-medium">Logs: {historyClass} Grade - {historyDate}</h3>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase">
                    Status: Marked
                  </span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.01] text-xs font-semibold text-gray-400 uppercase">
                      <th className="p-5">Student Name</th>
                      <th className="p-5">Email Address</th>
                      <th className="p-5 text-right">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {historyRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="p-5 font-medium">{rec.student_name}</td>
                        <td className="p-5 text-gray-400 text-sm">{rec.student_email}</td>
                        <td className="p-5 text-right">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                              rec.status === "present"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {rec.status === "present" ? "Present" : "Absent"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAttendance;

