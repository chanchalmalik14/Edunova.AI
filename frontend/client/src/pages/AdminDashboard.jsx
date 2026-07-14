import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  Bell,
  Settings,
  LogOut,
  UserPlus,
  BookPlus,
  Megaphone,
  Layers3,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Trash2,
  Search,
  Plus,
  X,
  PlusCircle,
  HelpCircle,
  FileText,
  Award,
  BookOpen,
  CalendarDays,
  BarChart3,
  KeyRound,
  Pencil,
  Shield
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, classes, content, announcements, settings
  const [academicSubTab, setAcademicSubTab] = useState("notes"); // notes, exams, timetable, syllabus, calendar


  // Overview stats & Activity states
  const [analytics, setAnalytics] = useState({
    stats: {
      total_users: 0,
      total_students: 0,
      total_teachers: 0,
      total_notes: 0,
      total_assignments: 0,
      total_quizzes: 0
    },
    recent_activity: []
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // User Management states
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState("teacher"); // "teacher" or "student"
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  // Create User Form
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    student_class: "",
    school_name: ""
  });
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [editingUserForm, setEditingUserForm] = useState({ full_name: "", role: "student", student_class: "", school_name: "", password: "" });
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Class Management states
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classForm, setClassForm] = useState({
    class_name: "",
    sections: "",
    subjects: "",
    class_teacher: "",
    subject_teachers: ""
  });

  // Content Management states
  const [content, setContent] = useState({
    notes: [],
    assignments: [],
    quizzes: []
  });
  const [loadingContent, setLoadingContent] = useState(false);

  // Announcement states
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [announceForm, setAnnounceForm] = useState({
    title: "",
    content: "",
    target_group: "all"
  });

  // AI settings state
  const [aiSettings, setAiSettings] = useState({
    model: "gemini-3-flash-preview",
    maxTokens: "2048",
    temperature: "0.7"
  });

  // LMS Revamp Custom states
  const [exams, setExams] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [parents, setParents] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [reportsData, setReportsData] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);

  const [examForm, setExamForm] = useState({ class_name: "", subject: "", date: "", time: "", marks: "" });
  const [timetableForm, setTimetableForm] = useState({ class_name: "", day: "", subject: "", time: "", teacher: "" });
  const [syllabusForm, setSyllabusForm] = useState({ class_name: "", subject: "", chapters: "" });
  const [calendarForm, setCalendarForm] = useState({ title: "", date: "", type: "event", description: "" });


  // Check login and load config
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username") || localStorage.getItem("full_name") || "Admin";

    if (!loggedIn || role !== "admin") {
      localStorage.clear();
      navigate("/login");
      return;
    }
    setAdminName(name);
    
    // Default load analytics
    fetchAnalytics();
  }, [navigate]);

  // Tab Load triggers
  useEffect(() => {
    if (activeTab === "overview") fetchAnalytics();
    if (activeTab === "users") {
      fetchUsers();
      fetchPendingTeachers();
      fetchParents();
    }
    if (activeTab === "classes") fetchClasses();
    if (activeTab === "academics") {
      fetchExams();
      fetchTimetable();
      fetchSyllabus();
      fetchCalendar();
    }
    if (activeTab === "attendance") {
      fetchAttendanceSummary();
    }
    if (activeTab === "reports") {
      fetchAnalytics();
      fetchReportsData();
    }
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab, userRoleFilter]);

  // Fetch Analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Users (Teachers, Students, and Parents)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      let url = "http://127.0.0.1:8000/admin/get-teachers";
      if (userRoleFilter === "student") {
        url = "http://127.0.0.1:8000/admin/get-students";
      } else if (userRoleFilter === "parent") {
        url = "http://127.0.0.1:8000/admin/get-parents";
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (userRoleFilter === "teacher") {
          setTeachers(data.teachers || []);
        } else if (userRoleFilter === "student") {
          setStudents(data.students || []);
        } else if (userRoleFilter === "parent") {
          setParents(data.parents || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Pending Teachers
  const fetchPendingTeachers = async () => {
    setLoadingPending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/pending-teachers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPendingTeachers(data.pending_teachers || []);
    } catch (err) { console.error(err); }
    finally { setLoadingPending(false); }
  };

  // Fetch Parents
  const fetchParents = async () => {
    setLoadingParents(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-parents", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setParents(data.parents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingParents(false);
    }
  };

  // EXAMS
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/exams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setExams(data.exams || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(examForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Exam scheduled successfully!");
        setExamForm({ class_name: "", subject: "", date: "", time: "", marks: "" });
        fetchExams();
      } else {
        alert(data.detail || "Failed to schedule exam");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-exam/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchExams();
    } catch (err) { console.error(err); }
  };

  // TIMETABLE
  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/timetable", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTimetable(data.timetable || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(timetableForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Timetable slot added successfully!");
        setTimetableForm({ class_name: "", day: "", subject: "", time: "", teacher: "" });
        fetchTimetable();
      } else {
        alert(data.detail || "Failed to add slot");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTimetable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-timetable/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchTimetable();
    } catch (err) { console.error(err); }
  };

  // SYLLABUS
  const fetchSyllabus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/syllabus", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSyllabus(data.syllabus || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateSyllabus = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(syllabusForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Syllabus entry created!");
        setSyllabusForm({ class_name: "", subject: "", chapters: "" });
        fetchSyllabus();
      } else {
        alert(data.detail || "Failed to create syllabus entry");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteSyllabus = async (id) => {
    if (!window.confirm("Are you sure you want to delete this syllabus entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-syllabus/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchSyllabus();
    } catch (err) { console.error(err); }
  };

  // CALENDAR
  const fetchCalendar = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/calendar", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCalendarEvents(data.calendar || []);
    } catch (err) { console.error(err); }
  };

  const handleCreateCalendar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(calendarForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Calendar event added!");
        setCalendarForm({ title: "", date: "", type: "event", description: "" });
        fetchCalendar();
      } else {
        alert(data.detail || "Failed to add event");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCalendar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this calendar event?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-calendar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCalendar();
    } catch (err) { console.error(err); }
  };

  // Approve Teacher
  const handleApproveTeacher = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/approve-teacher/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingTeachers(prev => prev.filter(t => t.email !== email));
        setTeachers(prev => [...prev, { ...pendingTeachers.find(t => t.email === email), status: "active" }]);
      } else {
        alert(data.detail || "Failed to approve teacher");
      }
    } catch (err) { console.error(err); }
  };

  const fetchReportsData = async () => {
    setLoadingReports(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/reports-analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setReportsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  // Reject Teacher
  const handleRejectTeacher = async (email) => {
    if (!window.confirm(`Reject and remove ${email}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/reject-teacher/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setPendingTeachers(prev => prev.filter(t => t.email !== email));
    } catch (err) { console.error(err); }
  };

  // Create User Account
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.full_name || !userForm.email || !userForm.password) {
      alert("All fields are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "User created successfully!");
        setUserForm({
          full_name: "",
          email: "",
          password: "",
          role: "student",
          student_class: "",
          school_name: ""
        });
        fetchUsers();
        fetchAnalytics();
      } else {
        alert(data.detail || data.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditUser = (user) => {
    setEditingUserEmail(user.email);
    setEditingUserForm({
      full_name: user.full_name || "",
      role: user.role || "student",
      student_class: user.student_class || "",
      school_name: user.school_name || "",
      password: ""
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUserEmail) return;
    try {
      const token = localStorage.getItem("token");
      const payload = { ...editingUserForm };
      if (!payload.password) delete payload.password;
      const res = await fetch(`http://127.0.0.1:8000/admin/update-user/${encodeURIComponent(editingUserEmail)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "User updated successfully");
        setEditingUserEmail("");
        setEditingUserForm({ full_name: "", role: "student", student_class: "", school_name: "", password: "" });
        fetchUsers();
      } else {
        alert(data.detail || "Unable to update user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordEmail || !resetPasswordValue) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/reset-password/${encodeURIComponent(resetPasswordEmail)}?new_password=${encodeURIComponent(resetPasswordValue)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Password updated");
        setResetPasswordEmail("");
        setResetPasswordValue("");
      } else {
        alert(data.detail || "Password reset failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete User
  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-user/${email}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.detail || "Delete operation failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Classes Configurations
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-classes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setClasses(data.classes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Create Class Configuration
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!classForm.class_name) {
      alert("Class name is required");
      return;
    }
    const payload = {
      class_name: classForm.class_name,
      sections: classForm.sections.split(",").map(s => s.trim()).filter(Boolean),
      subjects: classForm.subjects.split(",").map(s => s.trim()).filter(Boolean),
      class_teacher: classForm.class_teacher,
      subject_teachers: classForm.subject_teachers.split(",").map(s => s.trim()).filter(Boolean)
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setClassForm({ class_name: "", sections: "", subjects: "", class_teacher: "", subject_teachers: "" });
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Class Config
  const handleDeleteClass = async (className) => {
    if (!window.confirm(`Delete configuration for ${className} class?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-class/${className}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Class configuration deleted");
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Content Monitoring Data
  const fetchContent = async () => {
    setLoadingContent(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-content", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setContent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContent(false);
    }
  };

  // Moderate/Delete note
  const handleDeleteNote = async (filename) => {
    if (!window.confirm("Moderator delete this study note?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/delete-note/${filename}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Study Note moderated/deleted");
        fetchContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Moderate/Delete assignment
  const handleDeleteAssignment = async (title) => {
    if (!window.confirm("Moderator delete this assignment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/delete-assignment/${title}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Assignment moderated/deleted");
        fetchContent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Notice Board Announcements
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/get-announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchAttendanceSummary = async () => {
    setLoadingAttendance(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/attendance-summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAttendanceSummary(data.attendance || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Create Announcement Notice
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announceForm.title || !announceForm.content) {
      alert("All fields are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/admin/create-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(announceForm)
      });
      if (res.ok) {
        alert("Notice published successfully!");
        setAnnounceForm({ title: "", content: "", target_group: "all" });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (title) => {
    if (!window.confirm("Delete this notice board announcement?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-announcement/${title}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Announcement deleted");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filtered lists for User management tab
  const filteredUsersList = (userRoleFilter === "teacher" ? teachers : userRoleFilter === "student" ? students : parents).filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full" />

      {/* SIDEBAR */}
      <div className="w-72 bg-white/[0.03] border-r border-white/10 p-6 hidden md:flex flex-col justify-between relative z-10 backdrop-blur-2xl">
        <div>
          {/* Logo */}
          <h1 className="text-3xl font-light">
            Edunova
            <span className="text-blue-400 font-semibold">.AI</span>
          </h1>

          {/* Admin Card */}
          <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg font-bold">
                {adminName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <h3 className="text-md font-medium truncate">{adminName}</h3>
                <p className="text-gray-500 text-xs mt-0.5">Administrator</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-2 text-gray-300">
            {[
              { id: "overview", label: "Dashboard Overview", icon: <LayoutDashboard size={18} /> },
              { id: "users", label: "User Management", icon: <Users size={18} /> },
              { id: "classes", label: "Classes & Subjects", icon: <School size={18} /> },
              { id: "academics", label: "Academic Management", icon: <BookOpen size={18} /> },
              { id: "attendance", label: "Attendance", icon: <ClipboardCheck size={18} /> },
              { id: "reports", label: "Reports & Analytics", icon: <BarChart3 size={18} /> },
              { id: "announcements", label: "Announcements", icon: <Megaphone size={18} /> }
            ].map(tab => (

              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl transition cursor-pointer font-medium ${
                  activeTab === tab.id 
                    ? "bg-white/5 border border-white/10 text-white" 
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <p className="text-sm">{tab.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 overflow-y-auto relative z-10 p-8 md:p-12">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* Metrics grid */}
            {loadingAnalytics ? (
              <p className="text-gray-400 text-center">Loading live stats...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Total Students", val: analytics.stats?.total_students, color: "text-blue-400" },
                  { title: "Total Teachers", val: analytics.stats?.total_teachers, color: "text-green-400" },
                  { title: "Total Classes", val: analytics.stats?.total_classes, color: "text-yellow-400" },
                  { title: "Attendance Today", val: analytics.stats?.attendance_today ?? 0, color: "text-red-400" },
                  { title: "Pending Assignments", val: analytics.stats?.pending_assignments, color: "text-purple-400" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                    <span className="text-gray-500 text-sm">{stat.title}</span>
                    <h2 className={`text-5xl font-semibold mt-4 ${stat.color}`}>{stat.val}</h2>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Activity Logs */}
            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Recent Platform Logs</h2>
              <div className="divide-y divide-white/5 space-y-4">
                {analytics.recent_activity?.length === 0 ? (
                  <p className="text-gray-500 py-4">No recent database operations recorded.</p>
                ) : (
                  analytics.recent_activity?.map((log, idx) => (
                    <div key={idx} className="pt-4 flex items-center gap-3 text-gray-300 text-sm">
                      <span className="text-blue-400">â€¢</span>
                      <p>{log}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="space-y-8">

            {/* ─── Pending Teacher Approvals ─── */}
            {(pendingTeachers.length > 0 || loadingPending) && (
              <div className="bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-400/40 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 text-xl">⏳</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">Pending Teacher Approvals</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">These teachers registered and are waiting for your approval to log in.</p>
                  </div>
                  <span className="ml-auto bg-yellow-400/20 text-yellow-500 border border-yellow-400/30 text-sm px-3 py-1 rounded-full font-medium">
                    {pendingTeachers.length} pending
                  </span>
                </div>

                {loadingPending ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Loading pending approvals...</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTeachers.map((t) => (
                      <div key={t.email} className="flex items-center justify-between bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t.full_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Registered: {t.registered_at || "Recently"} · School: {t.school_name}
                          </p>
                        </div>
                        <div className="flex gap-3 ml-6">
                          <button
                            onClick={() => handleApproveTeacher(t.email)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTeacher(t.email)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create account form */}

            <form onSubmit={handleCreateUser} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Register Student or Teacher Account</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Arpita"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="arpita@gmail.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Account Password</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Role Privilege</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                  >
                    <option value="student" className="bg-gray-900">Student</option>
                    <option value="teacher" className="bg-gray-900">Teacher</option>
                    <option value="parent" className="bg-gray-900">Parent</option>
                  </select>
                </div>
                {userForm.role !== "admin" && userForm.role !== "parent" && (
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      Assign Class {userForm.role === "teacher" ? "(Teacher's class)" : ""}
                    </label>
                    <select
                      value={userForm.student_class}
                      onChange={(e) => setUserForm({ ...userForm, student_class: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                    >
                      <option value="" className="bg-gray-900">-- Select Class --</option>
                      <option value="9th" className="bg-gray-900">9th Grade</option>
                      <option value="10th" className="bg-gray-900">10th Grade</option>
                      <option value="11th" className="bg-gray-900">11th Grade</option>
                      <option value="12th" className="bg-gray-900">12th Grade</option>
                    </select>
                  </div>
                )}

              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <UserPlus size={18} /> Add Account
              </button>
            </form>

            {editingUserEmail && (
              <form onSubmit={handleUpdateUser} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-light">Edit / Promote / Transfer Account</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Full Name</label>
                    <input type="text" required value={editingUserForm.full_name} onChange={(e)=>setEditingUserForm({...editingUserForm, full_name:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Role</label>
                    <select value={editingUserForm.role} onChange={(e)=>setEditingUserForm({...editingUserForm, role:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300">
                      <option value="student" className="bg-gray-900">Student</option>
                      <option value="teacher" className="bg-gray-900">Teacher</option>
                      <option value="parent" className="bg-gray-900">Parent</option>
                    </select>
                  </div>
                  {editingUserForm.role !== "admin" && editingUserForm.role !== "parent" && (
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Promote / Class Level</label>
                      <select value={editingUserForm.student_class} onChange={(e)=>setEditingUserForm({...editingUserForm, student_class:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300">
                        <option value="" className="bg-gray-900">-- Select Class --</option>
                        <option value="9th" className="bg-gray-900">9th Grade</option>
                        <option value="10th" className="bg-gray-900">10th Grade</option>
                        <option value="11th" className="bg-gray-900">11th Grade</option>
                        <option value="12th" className="bg-gray-900">12th Grade</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Transfer School (School Name)</label>
                    <input type="text" value={editingUserForm.school_name || ""} onChange={(e)=>setEditingUserForm({...editingUserForm, school_name:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" placeholder="e.g. JPS Academy" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">New Password (optional)</label>
                    <input type="password" value={editingUserForm.password} onChange={(e)=>setEditingUserForm({...editingUserForm, password:e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" placeholder="Leave blank to keep current" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-2xl font-semibold">Save Changes</button>
                  <button type="button" onClick={() => { setEditingUserEmail(""); setEditingUserForm({ full_name: "", role: "student", student_class: "", school_name: "", password: "" }); }} className="bg-white/10 hover:bg-white/20 transition px-6 py-3 rounded-2xl">Cancel</button>
                </div>
              </form>
            )}

            <form onSubmit={handleResetPassword} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-4">
              <h3 className="text-xl font-light">Reset Student or Teacher Password</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Email Address</label>
                  <input type="email" required value={resetPasswordEmail} onChange={(e)=>setResetPasswordEmail(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" placeholder="user@school.edu" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">New Password</label>
                  <input type="password" required value={resetPasswordValue} onChange={(e)=>setResetPasswordValue(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="bg-purple-500 hover:bg-purple-600 transition px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"><KeyRound size={18}/> Reset Password</button>
            </form>

            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Search */}
                <div className="relative w-full max-w-sm">
                  <Search size={18} className="absolute left-4 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search accounts by name/email..."
                    className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Filter */}
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setUserRoleFilter("teacher")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      userRoleFilter === "teacher" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Teachers
                  </button>
                  <button
                    onClick={() => setUserRoleFilter("student")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      userRoleFilter === "student" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Students
                  </button>
                  <button
                    onClick={() => setUserRoleFilter("parent")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      userRoleFilter === "parent" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Parents
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <p className="text-gray-400 text-center py-6">Querying user list...</p>
              ) : (
                <div className="overflow-hidden border border-white/5 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-gray-400 uppercase">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email Address</th>
                        {userRoleFilter === "student" && <th className="p-4">Class</th>}
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsersList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500">No accounts matched.</td>
                        </tr>
                      ) : (
                        filteredUsersList.map((user, index) => (
                          <tr key={index} className="hover:bg-white/[0.01] transition text-sm">
                            <td className="p-4 font-medium">{user.full_name}</td>
                            <td className="p-4 text-gray-400">{user.email}</td>
                            {userRoleFilter === "student" && <td className="p-4 text-gray-400">{user.student_class} Grade</td>}
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => startEditUser(user)} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 p-2.5 rounded-xl transition" title="Edit user">
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => setResetPasswordEmail(user.email)} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 p-2.5 rounded-xl transition" title="Reset password">
                                  <KeyRound size={16} />
                                </button>
                                <button onClick={() => handleDeleteUser(user.email)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2.5 rounded-xl transition" title="Delete user">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLASS CONFIGURATION TAB */}
        {activeTab === "classes" && (
          <div className="space-y-8">
            <form onSubmit={handleCreateClass} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Configure Class, Sections, and Subjects</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Class Name</label>
                  <input type="text" required placeholder="9th" value={classForm.class_name} onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Sections (Comma Separated)</label>
                  <input type="text" placeholder="A, B, C" value={classForm.sections} onChange={(e) => setClassForm({ ...classForm, sections: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Subjects (Comma Separated)</label>
                  <input type="text" placeholder="Physics, Chemistry, Mathematics" value={classForm.subjects} onChange={(e) => setClassForm({ ...classForm, subjects: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Class Teacher</label>
                  <input type="text" placeholder="Priya Ma'am" value={classForm.class_teacher} onChange={(e) => setClassForm({ ...classForm, class_teacher: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <div className="xl:col-span-2">
                  <label className="block mb-2 text-sm text-gray-400">Subject Teachers (Comma Separated)</label>
                  <input type="text" placeholder="Math: Rahul, Science: Meera" value={classForm.subject_teachers} onChange={(e) => setClassForm({ ...classForm, subject_teachers: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <PlusCircle size={18} /> Save Class Configuration
              </button>
            </form>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Template / Example Card */}
              <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl">
                  Example Template
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-light text-blue-400">Class 10</h3>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-gray-500 font-medium">Sections:</span> A, B</p>
                    <p><span className="text-gray-500 font-medium">Class Teacher:</span> Priya Ma'am</p>
                    <p><span className="text-gray-500 font-medium">Subjects:</span> Math, Science, English</p>
                  </div>
                </div>
              </div>

              {loadingClasses ? (
                <p className="text-gray-400 col-span-full text-center">Loading class grid configs...</p>
              ) : (
                classes.map((cls, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-light text-blue-400">{cls.class_name}</h3>
                        <button
                          onClick={() => handleDeleteClass(cls.class_name)}
                          className="text-red-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <p><span className="text-gray-500 font-medium">Sections:</span> {cls.sections?.join(", ")}</p>
                        <p><span className="text-gray-500 font-medium">Subjects:</span> {cls.subjects?.join(", ")}</p>
                        <p><span className="text-gray-500 font-medium">Class Teacher:</span> {cls.class_teacher || "Not assigned"}</p>
                        <p><span className="text-gray-500 font-medium">Subject Teachers:</span> {cls.subject_teachers?.join(", ") || "Not assigned"}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ACADEMIC MANAGEMENT TAB */}
        {activeTab === "academics" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl font-light">Academic Management</h2>
                <p className="text-sm text-gray-400">Configure schedules, syllabi, calendar events, and moderate classroom content.</p>
              </div>
              
              {/* Sub Navigation */}
              <div className="flex flex-wrap bg-white/5 border border-white/10 p-1 rounded-2xl gap-1">
                {[
                  { id: "notes", label: "Notes & Assignments" },
                  { id: "exams", label: "Exams Schedule" },
                  { id: "timetable", label: "Timetable Slot" },
                  { id: "syllabus", label: "Syllabus Index" },
                  { id: "calendar", label: "Academic Calendar" }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setAcademicSubTab(sub.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      academicSubTab === sub.id ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-panel 1: Notes & Assignments */}
            {academicSubTab === "notes" && (
              <div className="space-y-8">
                {loadingContent ? (
                  <p className="text-gray-400 text-center py-6">Loading active media indexes...</p>
                ) : (
                  <div className="space-y-8">
                    {/* Notes section */}
                    <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                      <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2">
                        <BookOpen size={20} /> Moderate Study Notes
                      </h3>
                      <div className="divide-y divide-white/5">
                        {content.notes?.length === 0 ? (
                          <p className="text-gray-500 py-3">No study notes uploaded.</p>
                        ) : (
                          content.notes?.map((n, idx) => (
                            <div key={idx} className="py-3.5 flex justify-between items-center text-sm">
                              <div>
                                <p className="font-semibold">{n.title} ({n.subject})</p>
                                <p className="text-xs text-gray-500 mt-0.5">Class: {n.student_class} | Uploaded by: {n.uploaded_by}</p>
                              </div>
                              <button onClick={() => handleDeleteNote(n.filename)} className="text-red-400 hover:text-red-500 transition p-2">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Assignments section */}
                    <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                      <h3 className="text-xl font-medium text-green-400 flex items-center gap-2">
                        <FileText size={20} /> Moderate Assignments
                      </h3>
                      <div className="divide-y divide-white/5">
                        {content.assignments?.length === 0 ? (
                          <p className="text-gray-500 py-3">No assignments created.</p>
                        ) : (
                          content.assignments?.map((a, idx) => (
                            <div key={idx} className="py-3.5 flex justify-between items-center text-sm">
                              <div>
                                <p className="font-semibold">{a.title} ({a.subject})</p>
                                <p className="text-xs text-gray-500 mt-0.5">Target Grade: {a.student_class} | Due: {a.due_date}</p>
                              </div>
                              <button onClick={() => handleDeleteAssignment(a.title)} className="text-red-400 hover:text-red-500 transition p-2">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub-panel 2: Exams */}
            {academicSubTab === "exams" && (
              <div className="space-y-8">
                <form onSubmit={handleCreateExam} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-medium text-blue-400">Schedule Examination</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Class</label>
                      <input type="text" placeholder="10th" required value={examForm.class_name} onChange={e => setExamForm({...examForm, class_name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Subject</label>
                      <input type="text" placeholder="Math" required value={examForm.subject} onChange={e => setExamForm({...examForm, subject: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Date</label>
                      <input type="date" required value={examForm.date} onChange={e => setExamForm({...examForm, date: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Time</label>
                      <input type="text" placeholder="09:00 AM" required value={examForm.time} onChange={e => setExamForm({...examForm, time: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Max Marks</label>
                      <input type="number" placeholder="100" required value={examForm.marks} onChange={e => setExamForm({...examForm, marks: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-2xl text-sm font-semibold">
                    Schedule Exam
                  </button>
                </form>

                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-medium mb-4">Exam Schedules</h3>
                  {exams.length === 0 ? <p className="text-gray-500 text-sm">No exams scheduled.</p> : (
                    <div className="overflow-x-auto border border-white/10 rounded-2xl">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase">
                            <th className="p-4">Class</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Max Marks</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {exams.map(e => (
                            <tr key={e._id} className="hover:bg-white/5">
                              <td className="p-4">{e.class_name}</td>
                              <td className="p-4 font-medium">{e.subject}</td>
                              <td className="p-4 text-gray-400">{e.date}</td>
                              <td className="p-4 text-gray-400">{e.time}</td>
                              <td className="p-4">{e.marks}</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteExam(e._id)} className="text-red-400 hover:text-red-500 transition">
                                  <Trash2 size={16}/>
                                </button>
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

            {/* Sub-panel 3: Timetable */}
            {academicSubTab === "timetable" && (
              <div className="space-y-8">
                <form onSubmit={handleCreateTimetable} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-medium text-blue-400">Add Timetable Slot</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Class</label>
                      <input type="text" placeholder="10th" required value={timetableForm.class_name} onChange={e => setTimetableForm({...timetableForm, class_name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Day</label>
                      <select required value={timetableForm.day} onChange={e => setTimetableForm({...timetableForm, day: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500 text-gray-300">
                        <option value="" className="bg-gray-900">-- Select Day --</option>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                          <option key={d} value={d} className="bg-gray-900">{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Subject</label>
                      <input type="text" placeholder="Science" required value={timetableForm.subject} onChange={e => setTimetableForm({...timetableForm, subject: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Time</label>
                      <input type="text" placeholder="10:00 AM - 11:00 AM" required value={timetableForm.time} onChange={e => setTimetableForm({...timetableForm, time: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Teacher</label>
                      <input type="text" placeholder="Meera Ma'am" required value={timetableForm.teacher} onChange={e => setTimetableForm({...timetableForm, teacher: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-2xl text-sm font-semibold">
                    Add Slot
                  </button>
                </form>

                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-medium mb-4">Timetable Slots</h3>
                  {timetable.length === 0 ? <p className="text-gray-500 text-sm">No slots configured.</p> : (
                    <div className="overflow-x-auto border border-white/10 rounded-2xl">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase">
                            <th className="p-4">Class</th>
                            <th className="p-4">Day</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Teacher</th>
                            <th className="p-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {timetable.map(t => (
                            <tr key={t._id} className="hover:bg-white/5">
                              <td className="p-4">{t.class_name}</td>
                              <td className="p-4 font-semibold">{t.day}</td>
                              <td className="p-4">{t.subject}</td>
                              <td className="p-4 text-gray-400">{t.time}</td>
                              <td className="p-4 text-gray-400">{t.teacher}</td>
                              <td className="p-4 text-right">
                                <button onClick={() => handleDeleteTimetable(t._id)} className="text-red-400 hover:text-red-500 transition">
                                  <Trash2 size={16}/>
                                </button>
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

            {/* Sub-panel 4: Syllabus */}
            {academicSubTab === "syllabus" && (
              <div className="space-y-8">
                <form onSubmit={handleCreateSyllabus} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-medium text-blue-400">Add Syllabus Chapters</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Class</label>
                      <input type="text" placeholder="10th" required value={syllabusForm.class_name} onChange={e => setSyllabusForm({...syllabusForm, class_name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Subject</label>
                      <input type="text" placeholder="English Literature" required value={syllabusForm.subject} onChange={e => setSyllabusForm({...syllabusForm, subject: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Chapters Outline</label>
                    <textarea placeholder="e.g. Chapter 1: The Portrait of a Lady, Chapter 2: We are not afraid to die" required value={syllabusForm.chapters} onChange={e => setSyllabusForm({...syllabusForm, chapters: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500 h-28 resize-none text-gray-200" />
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-2xl text-sm font-semibold">
                    Create Syllabus
                  </button>
                </form>

                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-medium mb-4">Syllabus Index</h3>
                  {syllabus.length === 0 ? <p className="text-gray-500 text-sm">No syllabus entries found.</p> : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {syllabus.map(s => (
                        <div key={s._id} className="border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                              <h4 className="font-semibold text-blue-400">{s.subject} ({s.class_name})</h4>
                              <button onClick={() => handleDeleteSyllabus(s._id)} className="text-red-400 hover:text-red-500 transition">
                                <Trash2 size={16}/>
                              </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed whitespace-pre-line">{s.chapters}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-panel 5: Academic Calendar */}
            {academicSubTab === "calendar" && (
              <div className="space-y-8">
                <form onSubmit={handleCreateCalendar} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-medium text-blue-400">Add Calendar Event</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Event Title</label>
                      <input type="text" placeholder="Independence Day Holiday" required value={calendarForm.title} onChange={e => setCalendarForm({...calendarForm, title: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Date</label>
                      <input type="date" required value={calendarForm.date} onChange={e => setCalendarForm({...calendarForm, date: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">Event Type</label>
                      <select required value={calendarForm.type} onChange={e => setCalendarForm({...calendarForm, type: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500 text-gray-300">
                        <option value="event" className="bg-gray-900">Event</option>
                        <option value="holiday" className="bg-gray-900">Holiday</option>
                        <option value="exam" className="bg-gray-900">Exam Window</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Description</label>
                    <input type="text" placeholder="Optional details..." value={calendarForm.description} onChange={e => setCalendarForm({...calendarForm, description: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none text-sm focus:border-blue-500" />
                  </div>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-2xl text-sm font-semibold">
                    Add Event
                  </button>
                </form>

                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-medium mb-4">Academic Events Timeline</h3>
                  {calendarEvents.length === 0 ? <p className="text-gray-500 text-sm">No calendar events configured.</p> : (
                    <div className="space-y-3">
                      {calendarEvents.map(event => (
                        <div key={event._id} className="flex items-center justify-between border border-white/10 rounded-2xl p-4 bg-white/5">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${event.type === "holiday" ? "bg-red-400" : event.type === "exam" ? "bg-orange-400" : "bg-blue-400"}`} />
                            <div>
                              <p className="font-semibold">{event.title} <span className="text-xs uppercase px-2 py-0.5 rounded bg-white/10 text-gray-400 ml-2">{event.type}</span></p>
                              {event.description && <p className="text-xs text-gray-400 mt-1">{event.description}</p>}
                              <p className="text-xs text-gray-500 mt-0.5">Date: {event.date}</p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteCalendar(event._id)} className="text-red-400 hover:text-red-500 transition">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {/* NOTICE BOARD BROADCAST TAB */}
        {activeTab === "announcements" && (
          <div className="space-y-8">
            <form onSubmit={handleCreateAnnouncement} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-light">Publish Announcement Notice</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Notice Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Terminal Exam Timetable"
                    value={announceForm.title}
                    onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Target Group</label>
                  <select
                    value={announceForm.target_group}
                    onChange={(e) => setAnnounceForm({ ...announceForm, target_group: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-gray-300"
                  >
                    <option value="all" className="bg-gray-900">Entire School</option>
                    <option value="9th" className="bg-gray-900">Class 9th</option>
                    <option value="10th" className="bg-gray-900">Class 10th</option>
                    <option value="11th" className="bg-gray-900">Class 11th</option>
                    <option value="12th" className="bg-gray-900">Class 12th</option>
                    <option value="teachers" className="bg-gray-900">Teachers Only</option>
                    <option value="students" className="bg-gray-900">Students Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-400">Notice Content Body</label>
                <textarea
                  required
                  placeholder="Announce updates to target students..."
                  value={announceForm.content}
                  onChange={(e) => setAnnounceForm({ ...announceForm, content: e.target.value })}
                  className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 h-28 resize-none text-gray-200"
                />
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2">
                <Megaphone size={18} /> Broadcast Announcement
              </button>
            </form>

            <div className="space-y-4">
              <h2 className="text-2xl font-light">Notice Board Archives</h2>
              {loadingAnnouncements ? (
                <p className="text-gray-400 text-center">Loading announcements...</p>
              ) : announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No announcements published.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {announcements.map((announce, idx) => (
                    <div key={idx} className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start border-b border-white/5 pb-3">
                          <h3 className="text-xl font-medium truncate pr-4">{announce.title}</h3>
                          <button onClick={() => handleDeleteAnnouncement(announce.title)} className="text-red-400 hover:text-red-500 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed">{announce.content}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-6 pt-3 border-t border-white/5">
                        <span>Target: Class {announce.target_group?.toUpperCase()}</span>
                        <span>{announce.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light">Attendance Monitoring</h2>
              <p className="text-sm text-gray-400">View real-time summaries and marked attendance registers across the school.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">School Attendance (Overall)</span>
                <h3 className="text-4xl font-semibold mt-4 text-blue-400">94.8%</h3>
                <p className="text-xs text-gray-500 mt-2">Weighted average of students & staff</p>
              </div>
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Teacher Attendance Today</span>
                <h3 className="text-4xl font-semibold mt-4 text-green-400">98.2%</h3>
                <p className="text-xs text-gray-500 mt-2">All teachers checked in</p>
              </div>
              <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-6">
                <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Student Attendance Today</span>
                <h3 className="text-4xl font-semibold mt-4 text-yellow-400">93.5%</h3>
                <p className="text-xs text-gray-500 mt-2">Daily registration average</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-medium mb-6">Daily Attendance Logs</h3>
              {loadingAttendance ? (
                <p className="text-gray-400">Loading daily attendance records...</p>
              ) : attendanceSummary.length === 0 ? (
                <p className="text-gray-500">No attendance registers marked yet.</p>
              ) : (
                <div className="space-y-4">
                  {attendanceSummary.map((entry, idx) => (
                    <div key={idx} className="border border-white/10 rounded-2xl p-5 bg-white/[0.01]">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-semibold text-lg text-blue-400">{entry.class_name} Grade</p>
                          <p className="text-xs text-gray-500 mt-0.5">Date: {entry.date} | Marked by: {entry.marked_by}</p>
                        </div>
                        <div className="text-xs bg-white/10 border border-white/10 px-3 py-1 rounded-full text-gray-300">
                          {entry.records?.length ?? 0} Student Records
                        </div>
                      </div>
                      {entry.records?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {entry.records.map((record, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                record.status === "present"
                                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}
                            >
                              {record.student_name}: {record.status}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REPORTS & ANALYTICS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light">Reports & Analytics</h2>
              <p className="text-sm text-gray-400">Review student performance, exam statistics, and AI engagement indices.</p>
            </div>

            {loadingReports || !reportsData ? (
              <p className="text-gray-400 text-center py-12">Generating platform reports dynamically from database...</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Student Performance & Subject Breakdown */}
                  <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-medium text-blue-400">Subject-wise Academic Performance</h3>
                    <div className="space-y-4">
                      {reportsData.subject_performance?.map((item, i) => {
                        const colors = ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400"];
                        return (
                          <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300 font-medium">{item.subject}</span>
                              <span className="text-gray-400">{item.percentage}% average score</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[i % colors.length]}`} style={{ width: `${item.percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Usage Tracker */}
                  <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-medium text-purple-400">AI Assistance & Student Activity</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Total AI Notes Queries</p>
                          <p className="text-2xl font-semibold mt-1">{reportsData.ai_usage?.notes_queries}</p>
                        </div>
                        <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full font-semibold">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">AI Quiz Generated</p>
                          <p className="text-2xl font-semibold mt-1">{reportsData.ai_usage?.quizzes_generated} Quizzes</p>
                        </div>
                        <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full font-semibold">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        AI usage represents calculated prompt tokens based on notes uploads and student interactive quiz registrations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exam Reports Summary */}
                <div className="bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-medium mb-6">Examination Results summary</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
                    <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.01]">
                      <p className="text-gray-400 mb-1 font-medium">Exam Passing Rate</p>
                      <p className="text-3xl font-semibold text-green-400">{reportsData.passing_rate}%</p>
                      <p className="text-xs text-gray-500 mt-2">Target passing threshold set at 40 marks</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.01]">
                      <p className="text-gray-400 mb-1 font-medium">Top Performing Grade</p>
                      <p className="text-3xl font-semibold text-blue-400">{reportsData.top_performing_grade}</p>
                      <p className="text-xs text-gray-500 mt-2">Class highest score index</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.01]">
                      <p className="text-gray-400 mb-1 font-medium">Student Performance Index</p>
                      <p className="text-3xl font-semibold text-yellow-400">{reportsData.performance_index}</p>
                      <p className="text-xs text-gray-500 mt-2">Average score of all classes: {reportsData.overall_avg}%</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
