import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="text-center md:text-left">
          <h1 className="text-2xl text-gray-900 dark:text-white font-light tracking-wide">
            Edunova<span className="text-blue-400 font-semibold">.AI</span>
          </h1>
          <p className="mt-2 text-sm">AI-powered learning for the future.</p>
        </div>

        <div className="flex gap-6 text-sm">
          <p className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">Home</p>
          <p className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">Features</p>
          <p className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">Contact</p>
        </div>

      </div>
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
        © 2026 Edunova.AI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
