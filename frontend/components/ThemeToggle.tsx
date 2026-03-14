"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div
      onClick={toggle}
      className={`relative w-28 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-inner border border-gray-200 dark:border-gray-800 ${
        dark ? "bg-purple-500" : "bg-[#f3f3f3]"
      }`}
    >
      <span
        className={`absolute w-full px-4 font-bold text-[10px] uppercase tracking-wider transition-all duration-500 pointer-events-none ${
          dark ? "text-white text-left" : "text-black text-right"
        }`}
      >
        {dark ? "Dark" : "Light"}
      </span>

      <motion.div
        animate={{ x: dark ? 72 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        {dark ? (
          // Moon SVG
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          // Sun SVG
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </motion.div>
    </div>
  );
}