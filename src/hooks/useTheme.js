import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("theme")
      if (stored) return stored
    }
    // Fallback to system preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark"
    }
    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    // Save to localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
