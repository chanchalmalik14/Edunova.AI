import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

import Dashboard from "./pages/Dashboard";
import AINotesPage from "./pages/AINotesPage";

import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import UploadNotesPage from "./pages/UploadNotesPage";

import AssignmentPage from "./pages/AssignmentPage";

import TeacherAssignments from "./pages/TeacherAssignments";

import NotesLibrary from "./pages/NotesLibrary";

import AnalyticsPage from "./pages/AnalyticsPage";

import SettingsPage from "./pages/SettingsPage";

import TeacherManagement from "./pages/TeacherManagement";

// Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Login Page */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* AI Workspace */}
      <Route
        path="/ai-notes"
        element={
          <ProtectedRoute>
            <AINotesPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Dashboard */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Upload Notes */}
      <Route
        path="/upload-notes"
        element={
          <ProtectedRoute>
            <UploadNotesPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Assignments */}
      <Route
        path="/teacher-assignments"
        element={
          <ProtectedRoute>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />

      {/* Student Assignments */}
      <Route
        path="/assignment"
        element={
          <ProtectedRoute>
            <AssignmentPage />
          </ProtectedRoute>
        }
      />

      {/* Notes Library */}
      <Route
        path="/notes-library"
        element={
          <ProtectedRoute>
            <NotesLibrary />
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    <Route
  path="/teacher-management"
  element={
    <ProtectedRoute>
      <TeacherManagement />
    </ProtectedRoute>
  }
/>
        </Routes>
  );
}

export default App;