import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-light tracking-wide text-white cursor-pointer">
            Edunova
            <span className="text-blue-400 font-semibold">
              .AI
            </span>
          </h1>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-8 text-gray-300">

         <li
  onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  className="hover:text-white transition cursor-pointer"
>
  Home
</li>

          <li
  onClick={() =>
    window.scrollTo({
      top: document.getElementById("features").offsetTop,
      behavior: "smooth",
    })
  }
  className="hover:text-white transition cursor-pointer"
>
  Features
</li>

          <li
  onClick={() =>
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="hover:text-white transition cursor-pointer"
>
About
</li>

        </ul>

        {/* Login Button */}
        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 px-5 py-2 rounded-full text-white hover:scale-105">
            Login
          </button>
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;