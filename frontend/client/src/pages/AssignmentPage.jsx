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
  const handleFileChange = (e, title) => {

    const file = e.target.files[0];

    if (!file) return;

    setFiles({
      ...files,
      [title]: file,
    });

  };

  // SUBMIT
  const handleSubmit = async (title) => {

    const hasText = textAnswers[title]?.trim();
    const hasImage = files[title];

    if (!hasText && !hasImage) {
      alert("Please write answer or upload image 📌");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      
      if (hasText) {
        formData.append("text_answer", hasText);
      }
      if (hasImage) {
        formData.append("file", hasImage);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/submit-assignment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updated = {
          ...submitted,
          [title]: {
            submitted: true,
            text: hasText || null,
            fileUrl: hasImage ? URL.createObjectURL(hasImage) : null,
            fileName: hasImage ? hasImage.name : null,
          },
        };

        setSubmitted(updated);

        localStorage.setItem(
          "submittedAssignments",
          JSON.stringify(updated)
        );

        alert("Assignment Submitted 🚀");
      } else {
        alert(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }

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

          const isDone = submitted[a.title]?.submitted;

          return (

            <div
              key={a.title}
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
                      setMode({ ...mode, [a.title]: "text" })
                    }
                    className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                      mode[a.title] === "text"
                        ? "bg-blue-500"
                        : "bg-white/5"
                    }`}
                  >
                    <Type size={16} />
                    Text
                  </button>

                  <button
                    onClick={() =>
                      setMode({ ...mode, [a.title]: "image" })
                    }
                    className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                      mode[a.title] === "image"
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
              {!isDone && mode[a.title] === "text" && (
                <textarea
                  placeholder="Write your answer..."
                  value={textAnswers[a.title] || ""}
                  onChange={(e) =>
                    setTextAnswers({
                      ...textAnswers,
                      [a.title]: e.target.value,
                    })
                  }
                  className="w-full mt-4 bg-white/5 border border-white/10 p-4 rounded-xl"
                  rows={5}
                />
              )}

              {/* IMAGE */}
              {!isDone && mode[a.title] === "image" && (
                <div className="mt-4">

                  <label className="cursor-pointer flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl w-fit border border-white/10">

                    <Upload size={16} />
                    Upload Image

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileChange(e, a.title)}
                    />

                  </label>

                  {files[a.title] && (
                    <p className="text-gray-400 text-sm mt-2">
                      Selected: {files[a.title].name}
                    </p>
                  )}

                </div>
              )}

              {/* SUBMITTED */}
              {isDone && (
                <div className="mt-4 space-y-3">

                  {submitted[a.title].text && (
                    <p className="text-gray-300 bg-white/5 p-3 rounded-xl">
                      {submitted[a.title].text}
                    </p>
                  )}

                  {submitted[a.title].fileUrl && (
                    <img
                      src={submitted[a.title].fileUrl}
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
                  onClick={() => handleSubmit(a.title)}
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