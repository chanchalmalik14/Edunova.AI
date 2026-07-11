import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white cursor-pointer">
            Edunova<span className="text-blue-400 font-semibold">.AI</span>
          </h1>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300">
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">Home</li>
          <li onClick={() => window.scrollTo({ top: document.getElementById("features").offsetTop, behavior: "smooth" })} className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">Features</li>
          <li onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-gray-900 dark:hover:text-white transition cursor-pointer">About</li>
        </ul>

        {/* Right: Theme Toggle + Login */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 transition-all duration-300"
          >
            {theme === "dark"
              ? <Sun size={18} className="text-yellow-400" />
              : <Moon size={18} className="text-blue-500" />
            }
          </button>
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-5 py-2 rounded-full text-white hover:scale-105">
              Login
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
