import React from "react";

function SubjectCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <h3 className="text-xl text-white font-medium">
        {title}
      </h3>

      <p className="text-gray-400 mt-2 text-sm">
        Open notes, quiz & assignments
      </p>
    </div>
  );
}

export default SubjectCard;