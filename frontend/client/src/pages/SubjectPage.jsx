import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function SubjectPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-light">
          Subject:
          <span className="text-blue-400 font-semibold ml-2">
            {id}
          </span>
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          Back
        </button>

      </div>

      {/* Modules */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {/* Notes */}
        <div
          onClick={() => navigate(`/subject/${id}/notes`)}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 cursor-pointer transition"
        >
          <h2 className="text-xl">📘 Notes</h2>
          <p className="text-gray-400 mt-2">View study material</p>
        </div>

        {/* Quiz */}
        <div
          onClick={() => navigate(`/subject/${id}/quiz`)}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 cursor-pointer transition"
        >
          <h2 className="text-xl">🧠 Quiz</h2>
          <p className="text-gray-400 mt-2">Test your knowledge</p>
        </div>

        {/* Assignment */}
        <div
          onClick={() => navigate(`/subject/${id}/assignment`)}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 cursor-pointer transition"
        >
          <h2 className="text-xl">📝 Assignments</h2>
          <p className="text-gray-400 mt-2">Submit your work</p>
        </div>

      </div>

    </div>
  );
}

export default SubjectPage;