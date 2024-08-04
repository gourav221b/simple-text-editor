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

const EditorConfigContext = createContext<EditorConfigContextProps | undefined>(
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
      setEditorConfig(JSON.parse(storedConfig));
    } else {
      setEditorConfig({
        fontSize: 20,
        fontFamily: "system-ui, sans-serif",

        theme: currentTheme || "dark",
      });
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
    setTheme("light");
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
