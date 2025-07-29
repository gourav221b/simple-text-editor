"use client";

import { MAX_FONT_SIZE, MIN_FONT_SIZE } from "@/lib/constants";
import { useTheme } from "next-themes";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface EditorConfigProps {
  fontSize: number;
  fontFamily: string;
  theme: string;
}

interface EditorConfigContextProps {
  editorConfig: EditorConfigProps | null;
  setFontSize: (fontSize: number) => void;
  setFontFamily: (fontFamily: string) => void;
  setConfigTheme: (theme: string) => void;
}

export const EditorConfigContext = createContext<EditorConfigContextProps | undefined>(
  undefined
);

interface EditorConfigContextProviderProps {
  children: ReactNode;
}

export const EditorConfigProvider = ({
  children,
}: EditorConfigContextProviderProps) => {
  const [editorConfig, setEditorConfig] = useState<EditorConfigProps | null>(
    null
  );
  const { theme: currentTheme, setTheme } = useTheme();

  useEffect(() => {
    if (editorConfig) {
      localStorage.setItem("editorConfig", JSON.stringify(editorConfig));
    }
  }, [editorConfig]);

  useEffect(() => {
    const storedConfig = localStorage.getItem("editorConfig");
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      setEditorConfig(config);

      // Apply the stored theme class
      if (typeof document !== 'undefined' && config.theme) {
        const htmlElement = document.documentElement;
        const themeClasses = ['light', 'dark', 'vscode-dark', 'monokai', 'dracula', 'iron-man', 'captain-america', 'hulk', 'spider-man', 'matrix', 'neon-nights', 'ocean-deep', 'midnight-purple', 'forest-green', 'tanjiro', 'rengoku', 'zenitsu', 'tengen'];

        // Remove existing theme classes
        themeClasses.forEach(themeClass => {
          htmlElement.classList.remove(themeClass);
        });

        // Add the stored theme class
        htmlElement.classList.add(config.theme);
      }
    } else {
      const defaultTheme = currentTheme || "dark";
      setEditorConfig({
        fontSize: 20,
        fontFamily: "system-ui, sans-serif",
        theme: defaultTheme,
      });

      // Apply the default theme class
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add(defaultTheme);
      }
    }
  }, [currentTheme]);

  const setFontSize = (fontSize: number) => {
    setEditorConfig((prev) => ({
      ...prev!,
      fontSize: Math.min(Math.max(fontSize, MIN_FONT_SIZE), MAX_FONT_SIZE),
    }));
  };

  const setFontFamily = (fontFamily: string) => {
    setEditorConfig((prev) => ({
      ...prev!,
      fontFamily,
    }));
  };

  const setConfigTheme = (theme: string) => {
    // Set the Next.js theme to match our custom theme
    setTheme(theme);

    // Manually apply the theme class to the HTML element
    // This is needed because next-themes doesn't recognize custom theme names
    if (typeof document !== 'undefined') {
      // Remove all existing theme classes
      const htmlElement = document.documentElement;
      const existingClasses = htmlElement.className.split(' ');
      const themeClasses = ['light', 'dark', 'vscode-dark', 'monokai', 'dracula', 'iron-man', 'captain-america', 'hulk', 'spider-man', 'matrix', 'neon-nights', 'ocean-deep', 'midnight-purple', 'forest-green', 'tanjiro', 'rengoku', 'zenitsu', 'tengen'];

      // Remove existing theme classes
      themeClasses.forEach(themeClass => {
        htmlElement.classList.remove(themeClass);
      });

      // Add the new theme class
      htmlElement.classList.add(theme);

      console.log(`Applied theme class: ${theme}`);
    }

    setEditorConfig((prev) => ({
      ...prev!,
      theme,
    }));
  };

  return (
    <EditorConfigContext.Provider
      value={{ editorConfig, setFontFamily, setFontSize, setConfigTheme }}
    >
      {children}
    </EditorConfigContext.Provider>
  );
};

export function useEditorConfigContext(): EditorConfigContextProps {
  const context = useContext(EditorConfigContext);
  if (!context) {
    throw new Error(
      "useEditorConfigContext must be used within a EditorConfigProvider"
    );
  }
  return context;
}
