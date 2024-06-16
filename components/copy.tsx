"use client"
import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";

export const CopyToClipboard = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        setCopied(true);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied(false);
        }, 500);
    };

    return (
        <span
            className="cursor-pointer"
            onClick={copy}
            data-clipboard-text={text}
        >
            {copied ? <CopyCheck className="h-4 w-4 animate-ping" /> : <Copy className="h-4 w-4" />}
        </span>
    );
};
