import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function NotesPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = () => {

    setLoading(true);

    // Simulated AI response (later we can connect real AI API)
    setTimeout(() => {
      setNotes(
        `📘 AI Generated Notes for ${id}\n\n` +
        `• Key Concept 1: Basic understanding of ${id}\n` +
        `• Key Concept 2: Important formulas and rules\n` +
        `• Key Concept 3: Real world applications\n\n` +
        `👉 Revise daily for better performance!`
      );

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl">
          📘 Notes - <span className="text-blue-400">{id}</span>
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 px-4 py-2 rounded-xl"
        >
          Back
        </button>

      </div>

      {/* Generate Button */}
      <button
        onClick={generateNotes}
        className="mt-8 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl"
      >
        {loading ? "Generating..." : "Generate AI Notes"}
      </button>

      {/* Notes Output */}
      {notes && (
        <div className="mt-8 bg-white/5 border border-white/10 p-6 rounded-2xl whitespace-pre-line">
          {notes}
        </div>
      )}

    </div>
  );
}

export default NotesPage;