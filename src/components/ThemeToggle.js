"use client"

import { Sun, Moon } from "lucide-react"
import "../styles/ThemeToggle.css"

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button className={`theme-toggle ${darkMode ? "dark" : "light"}`} onClick={toggleDarkMode} title="Toggle theme">
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle
