import React, { useEffect, useState } from "react";

import {
  GraduationCap,
  Trash2,
  Plus,
  BookOpen,
  School
} from "lucide-react";

function TeacherManagement() {

  const [teachers, setTeachers] = useState([]);

  const [name, setName] = useState("");

  const [subject, setSubject] = useState("");

  const [assignedClass, setAssignedClass] = useState("");

  // Load Teachers
  useEffect(() => {

    const storedTeachers =
      JSON.parse(localStorage.getItem("teachers")) || [];

    setTeachers(storedTeachers);

  }, []);

  // Add Teacher
  const handleAddTeacher = () => {

    if (!name || !subject || !assignedClass) {

      alert("Please fill all fields");

      return;
    }

    const newTeacher = {

      id: Date.now(),

      name,

      subject,

      assignedClass,

      joinedAt: new Date().toLocaleDateString()

    };

    const updatedTeachers = [
      newTeacher,
      ...teachers
    ];

    setTeachers(updatedTeachers);

    localStorage.setItem(
      "teachers",
      JSON.stringify(updatedTeachers)
    );

    setName("");

    setSubject("");

    setAssignedClass("");
  };

  // Delete Teacher
  const handleDelete = (id) => {

    const filteredTeachers =
      teachers.filter((teacher) => teacher.id !== id);

    setTeachers(filteredTeachers);

    localStorage.setItem(
      "teachers",
      JSON.stringify(filteredTeachers)
    );
  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div>

        <h1 className="text-5xl font-light">
          Teacher Management
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Add and manage school teachers.
        </p>

      </div>

      {/* Add Teacher Form */}
      <div className="mt-10 bg-white/[0.04] border border-white/10 rounded-3xl p-8">

        <div className="grid md:grid-cols-3 gap-6">

          {/* Name */}
          <div>

            <p className="mb-3 text-gray-400">
              Teacher Name
            </p>

            <input
              type="text"
              placeholder="Enter teacher name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Subject */}
          <div>

            <p className="mb-3 text-gray-400">
              Subject
            </p>

            <input
              type="text"
              placeholder="Physics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-green-500"
            />

          </div>

          {/* Class */}
          <div>

            <p className="mb-3 text-gray-400">
              Assigned Class
            </p>

            <input
              type="text"
              placeholder="Class 12"
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

        </div>

        {/* Button */}
        <button
          onClick={handleAddTeacher}
          className="mt-8 bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-2xl flex items-center gap-3"
        >

          <Plus size={22} />

          Add Teacher

        </button>

      </div>

      {/* Teachers List */}
      <div className="mt-14">

        <h2 className="text-3xl font-light">
          All Teachers
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

          {teachers.length === 0 && (

            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center col-span-full">

              <GraduationCap
                size={60}
                className="mx-auto text-gray-500"
              />

              <h3 className="text-2xl mt-5">
                No Teachers Added
              </h3>

              <p className="text-gray-400 mt-3">
                Add your first teacher.
              </p>

            </div>

          )}

          {teachers.map((teacher) => (

            <div
              key={teacher.id}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300"
            >

              {/* Top */}
              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                  <GraduationCap
                    className="text-blue-400"
                    size={28}
                  />

                </div>

                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="bg-red-500 hover:bg-red-600 transition p-3 rounded-2xl"
                >

                  <Trash2 size={18} />

                </button>

              </div>

              {/* Details */}
              <h3 className="text-2xl mt-6">
                {teacher.name}
              </h3>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3 text-gray-400">

                  <BookOpen size={18} />

                  <p>{teacher.subject}</p>

                </div>

                <div className="flex items-center gap-3 text-gray-400">

                  <School size={18} />

                  <p>{teacher.assignedClass}</p>

                </div>

              </div>

              <p className="text-gray-500 mt-6 text-sm">
                Joined: {teacher.joinedAt}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default TeacherManagement;