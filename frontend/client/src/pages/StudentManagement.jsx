import React, { useEffect, useState } from "react";

import {
  Users,
  Trash2,
  Plus,
  GraduationCap,
  School,
  Mail
} from "lucide-react";

function StudentManagement() {

  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [studentClass, setStudentClass] = useState("");

  // Load Students
  useEffect(() => {

    const storedStudents =
      JSON.parse(localStorage.getItem("students")) || [];

    setStudents(storedStudents);

  }, []);

  // Add Student
  const handleAddStudent = () => {

    if (!name || !email || !studentClass) {

      alert("Please fill all fields");

      return;
    }

    const newStudent = {

      id: Date.now(),

      name,

      email,

      studentClass,

      joinedAt: new Date().toLocaleDateString()

    };

    const updatedStudents = [
      newStudent,
      ...students
    ];

    setStudents(updatedStudents);

    localStorage.setItem(
      "students",
      JSON.stringify(updatedStudents)
    );

    setName("");

    setEmail("");

    setStudentClass("");
  };

  // Delete Student
  const handleDelete = (id) => {

    const filteredStudents =
      students.filter((student) => student.id !== id);

    setStudents(filteredStudents);

    localStorage.setItem(
      "students",
      JSON.stringify(filteredStudents)
    );
  };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div>

        <h1 className="text-5xl font-light">
          Student Management
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Add and manage school students.
        </p>

      </div>

      {/* Form */}
      <div className="mt-10 bg-white/[0.04] border border-white/10 rounded-3xl p-8">

        <div className="grid md:grid-cols-3 gap-6">

          {/* Name */}
          <div>

            <p className="mb-3 text-gray-400">
              Student Name
            </p>

            <input
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Email */}
          <div>

            <p className="mb-3 text-gray-400">
              Email
            </p>

            <input
              type="email"
              placeholder="student@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-green-500"
            />

          </div>

          {/* Class */}
          <div>

            <p className="mb-3 text-gray-400">
              Class
            </p>

            <input
              type="text"
              placeholder="Class 10"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-purple-500"
            />

          </div>

        </div>

        {/* Button */}
        <button
          onClick={handleAddStudent}
          className="mt-8 bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-8 py-4 rounded-2xl flex items-center gap-3"
        >

          <Plus size={22} />

          Add Student

        </button>

      </div>

      {/* Student List */}
      <div className="mt-14">

        <h2 className="text-3xl font-light">
          All Students
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

          {students.length === 0 && (

            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center col-span-full">

              <Users
                size={60}
                className="mx-auto text-gray-500"
              />

              <h3 className="text-2xl mt-5">
                No Students Added
              </h3>

              <p className="text-gray-400 mt-3">
                Add your first student.
              </p>

            </div>

          )}

          {students.map((student) => (

            <div
              key={student.id}
              className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 hover:border-green-500 transition-all duration-300"
            >

              {/* Top */}
              <div className="flex items-center justify-between">

                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">

                  <GraduationCap
                    className="text-green-400"
                    size={28}
                  />

                </div>

                <button
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-500 hover:bg-red-600 transition p-3 rounded-2xl"
                >

                  <Trash2 size={18} />

                </button>

              </div>

              {/* Details */}
              <h3 className="text-2xl mt-6">
                {student.name}
              </h3>

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3 text-gray-400">

                  <Mail size={18} />

                  <p>{student.email}</p>

                </div>

                <div className="flex items-center gap-3 text-gray-400">

                  <School size={18} />

                  <p>{student.studentClass}</p>

                </div>

              </div>

              <p className="text-gray-500 mt-6 text-sm">
                Joined: {student.joinedAt}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentManagement;