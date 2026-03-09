"use client";
import { useEffect, useState } from "react";
import { tokens } from "@/tokens/colors";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <button
      onClick={toggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? tokens.colors.brandHover : tokens.colors.brand,
        color: "#FFFFFF",
        paddingLeft: tokens.spacing.btnPx,
        paddingRight: tokens.spacing.btnPx,
        paddingTop: tokens.spacing.btnPy,
        paddingBottom: tokens.spacing.btnPy,
        borderRadius: tokens.radius.full,
        boxShadow: tokens.effects.shadow,
        border: "none",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: 500,
        transition: "all 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}