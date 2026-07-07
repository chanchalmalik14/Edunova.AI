import React from "react";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">

      <div className="text-center">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-400">
          Loading Edunova AI...
        </p>

      </div>

    </div>
  );
}

export default LoadingScreen;