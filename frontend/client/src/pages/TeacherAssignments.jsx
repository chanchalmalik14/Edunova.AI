import React, { useEffect, useState } from "react";
import { FileText, Upload, CheckCircle, Image, Type } from "lucide-react";

function AssignmentPage() {

  // 📌 Teacher-created assignments
  const [assignments, setAssignments] = useState([]);

  // 📌 Student submissions
  const [submitted, setSubmitted] = useState(
    JSON.parse(localStorage.getItem("submittedAssignments")) || {}
  );

  const [files, setFiles] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [mode, setMode] = useState({});

  // 🔥 LOAD TEACHER ASSIGNMENTS FROM LOCALSTORAGE
  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem("assignments")) || [];

    setAssignments(stored);

  }, []);

  // IMAGE HANDLER
  const handleFileChange = (e, id) => {

    const file = e.target.files[0];

    if (!file) return;

    setFiles({
      ...files,
      [id]: file,
    });

  };

  // SUBMIT
  const handleSubmit = (id) => {

    const hasText = textAnswers[id]?.trim();
    const hasImage = files[id];

    if (!hasText && !hasImage) {
      alert("Please write answer or upload image 📌");
      return;
    }

    const updated = {
      ...submitted,
      [id]: {
        submitted: true,
        text: textAnswers[id] || null,
        fileUrl: files[id] ? URL.createObjectURL(files[id]) : null,
        fileName: files[id]?.name || null,
      },
    };

    setSubmitted(updated);

    localStorage.setItem(
      "submittedAssignments",
      JSON.stringify(updated)
    );

    alert("Assignment Submitted 🚀");

  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-light">
        Assignments
      </h1>

      <p className="text-gray-400 mt-2">
        Teacher assigned tasks — submit your work
      </p>

      <div className="mt-10 space-y-6">

        {/* IF NO ASSIGNMENTS */}
        {assignments.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No assignments uploaded by teacher yet 📭
          </div>
        )}

        {/* ASSIGNMENT LIST */}
        {assignments.map((a) => {

          const isDone = submitted[a.id]?.submitted;

          return (

            <div
              key={a.id}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl"
            >

              {/* Title */}
              <div className="flex items-center gap-3">

                <FileText className="text-blue-400" />

                <h2 className="text-2xl">
                  {a.title}
                </h2>

              </div>

              <p className="text-gray-400 mt-2">
                {a.subject}
              </p>

              <p className="text-gray-500 mt-2">
                {a.description}
              </p>

              {/* MODE */}
              {!isDone && (
                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() =>
                      setMode({ ...mode, [a.id]: "text" })
                    }
                    className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                      mode[a.id] === "text"
                        ? "bg-blue-500"
                        : "bg-white/5"
                    }`}
                  >
                    <Type size={16} />
                    Text
                  </button>

                  <button
                    onClick={() =>
                      setMode({ ...mode, [a.id]: "image" })
                    }
                    className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                      mode[a.id] === "image"
                        ? "bg-blue-500"
                        : "bg-white/5"
                    }`}
                  >
                    <Image size={16} />
                    Image
                  </button>

                </div>
              )}

              {/* TEXT */}
              {!isDone && mode[a.id] === "text" && (
                <textarea
                  placeholder="Write your answer..."
                  value={textAnswers[a.id] || ""}
                  onChange={(e) =>
                    setTextAnswers({
                      ...textAnswers,
                      [a.id]: e.target.value,
                    })
                  }
                  className="w-full mt-4 bg-white/5 border border-white/10 p-4 rounded-xl"
                  rows={5}
                />
              )}

              {/* IMAGE */}
              {!isDone && mode[a.id] === "image" && (
                <div className="mt-4">

                  <label className="cursor-pointer flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl w-fit border border-white/10">

                    <Upload size={16} />
                    Upload Image

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileChange(e, a.id)}
                    />

                  </label>

                  {files[a.id] && (
                    <p className="text-gray-400 text-sm mt-2">
                      Selected: {files[a.id].name}
                    </p>
                  )}

                </div>
              )}

              {/* SUBMITTED */}
              {isDone && (
                <div className="mt-4 space-y-3">

                  {submitted[a.id].text && (
                    <p className="text-gray-300 bg-white/5 p-3 rounded-xl">
                      {submitted[a.id].text}
                    </p>
                  )}

                  {submitted[a.id].fileUrl && (
                    <img
                      src={submitted[a.id].fileUrl}
                      className="w-40 rounded-xl border border-white/10"
                    />
                  )}

                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={18} />
                    Submitted
                  </div>

                </div>
              )}

              {/* BUTTON */}
              {!isDone && (
                <button
                  onClick={() => handleSubmit(a.id)}
                  className="mt-5 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                >
                  <Upload size={18} />
                  Submit
                </button>
              )}

            </div>

          );

        })}

      </div>

    </div>

  );
}

export default AssignmentPage;