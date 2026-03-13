import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, ThemeColors } from "../ui/theme/colors";

const STORAGE_KEY = "app-theme";
type Scheme = "light" | "dark";

type ThemeContextType = {
  Colors: ThemeColors;
  scheme: Scheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() ?? "light";
  const [scheme, setScheme] = useState<Scheme>(systemScheme);

  useEffect(() => {
    setScheme(systemScheme);
  }, [systemScheme]);

  const toggleTheme = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    setScheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        Colors: scheme === "dark" ? darkColors : lightColors,
        scheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
