"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"


export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light")
                localStorage.setItem("gg-portfolio-logged-theme", theme === "light" ? "dark" : "light")
            }}
        >
            <Sun className=" h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
