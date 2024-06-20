import { Poppins } from "next/font/google";

export const fontPoppins = Poppins({
    weight: "400",
    style: "normal",
    display: "swap",
    subsets: ["latin"],
})

export interface FontFamily {
    id: string;
    fontName: string;
    font: string;
}
export const fontFamilies: FontFamily[] = [
    {
        "id": "system",
        "fontName": "System",
        "font": "system-ui, sans-serif"
    }, {
        "id": "arial",
        "fontName": "Arial",
        "font": "Arial, sans-serif"
    },
    {
        "id": "poppins-variable",
        "fontName": "Poppins",
        "font": "Poppins, sans-serif"
    },
    {
        "id": "helvetica-variable",
        "fontName": "Helvetica",
        "font": "Helvetica, sans-serif",

    }, {
        "id": "times New Roman",
        "fontName": "Times New Roman",
        "font": "'Times New Roman', Times, serif",

    },
    {
        "id": "georgia",
        "fontName": "Georgia",
        "font": "Georgia, 'Times New Roman', Times, serif",

    },
    {
        "id": "pacifico-regular",
        "fontName": "Cursive",
        "font": "cursive",

    },

    {
        "id": "mono-variable",
        "fontName": "Consolas",
        "font": "consolas, monospace"
    }



]