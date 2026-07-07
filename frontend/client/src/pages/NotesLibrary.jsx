import React, { useEffect, useState } from "react";

import {
  FileText,
  Download,
  BookOpen
} from "lucide-react";

function NotesLibrary() {

  const [notes, setNotes] = useState([]);

  // Load Notes
  useEffect(() => {

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/get-notes", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.notes) {
          setNotes(data.notes);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    fetchNotes();

  }, []);

  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div>

        <h1 className="text-5xl font-light">
          Notes Library
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Access all uploaded study material.
        </p>

      </div>

      {/* Notes */}
      <div className="mt-12 space-y-8">

        {notes.length === 0 && (

          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 text-center">

            <BookOpen
              size={70}
              className="mx-auto text-gray-500"
            />

            <h2 className="text-3xl mt-6">
              No Notes Available
            </h2>

            <p className="text-gray-400 mt-4">
              Teachers have not uploaded notes yet.
            </p>

          </div>

        )}

        {notes.map((note) => (

          <div
            key={note.filename}
            className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >

            {/* Left */}
            <div>

              <div className="flex items-center gap-3">

                <FileText
                  className="text-blue-400"
                  size={28}
                />

                <h2 className="text-2xl">
                  {note.title}
                </h2>

              </div>

              <p className="text-gray-400 mt-3">
                📘 {note.subject}
              </p>

              <p className="text-gray-500 mt-3">
                📄 {note.filename}
              </p>

              <p className="text-gray-600 mt-4 text-sm">
                Uploaded By: {note.uploaded_by}
              </p>

            </div>

            {/* Download */}
            <a
              href={`http://127.0.0.1:8000/download-note/${note.filename}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-6 py-4 rounded-2xl flex items-center gap-3"
            >

              <Download size={22} />

              Download

            </a>

          </div>

        ))}

      </div>

    </div>
  );
}

export default NotesLibrary;