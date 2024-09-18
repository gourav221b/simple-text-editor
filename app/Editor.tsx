"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { useToast } from "@/components/ui/use-toast";
import useRemoveSearchParams from "@/components/useRemoveParams";
import { cn, saveAs, toLines } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import { useEditorConfigContext } from "./config-provider";

import EditorConfigMenu from "@/components/EditorConfigMenu";

interface View {
  getCursor(): [number, number];
  getContent(): string;
  setCursor(start: number, end: number): void;
}

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export default function Editor({
  prev_text = "",
  prev_filename = "",
  share,
}: {
  prev_text?: string;
  prev_filename?: string;
  share: any;
}) {
  const [text, setText] = useState(() => {
    if (prev_text !== "") return prev_text;
    return localStorage?.getItem("local_text") ?? "";
  });
  const [filename, setFilename] = useState(() => {
    if (prev_filename !== "") return prev_filename;
    return localStorage?.getItem("local_filename") ?? "simple-text.txt";
  });

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString();
      setTextAnalytics((prev) => ({
        ...prev,
        selectedCharacters: selectedText.length,
      }));
    } else {
      setTextAnalytics((prev) => ({
        ...prev,
        selectedCharacters: 0,
      }));
    }
  };
  const [textAnalytics, setTextAnalytics] = useState({
    lines: 0,
    characters: 0,
    words: 0,
    selectedCharacters: 0,
  });
  const [preview, setPreview] = useState(false);
  const [sharingLoader, setSharingLoader] = useState(false);
  const { toast } = useToast();

  const { editorConfig } = useEditorConfigContext();

  // remove the existing search params to retain changes made
  useRemoveSearchParams();

  useLayoutEffect(() => {
    const editor = document.getElementById(
      "editorTextArea"
    ) as HTMLTextAreaElement;

    if (editor) {
      const view: View = {
        getCursor: (): [number, number] => [
          editor.selectionStart,
          editor.selectionEnd,
        ],
        getContent: (): string => editor.value,
        setCursor: (start: number, end: number): void => {
          editor.setSelectionRange(start, end);
          editor.focus();
        },
      };

      // since tab works for accessibility, we capture it to avoid disruptions while typing
      const handleInsertTab = (event: CustomEvent): void => {
        const [cursorStart, cursorEnd] = view.getCursor();
        const text = view.getContent();
        const tab = "    ";

        if (cursorStart === cursorEnd) {
          document.execCommand("insertText", undefined, tab);
        } else {
          const lines = toLines(text);
          let newText = "";
          let lastLineEnd = 0;
          let tabsInserted = 0;
          let startOnLineBreak = false;

          for (let i = 0; i < lines.length; i++) {
            const start = lastLineEnd;
            const end = lastLineEnd + lines[i].length + 1;

            if (i > 0) {
              newText += "\n";
            }

            if (end > cursorStart && start < cursorEnd) {
              newText += tab;
              tabsInserted++;
            }

            if (start === cursorStart) {
              startOnLineBreak = true;
            }

            newText += lines[i];
            lastLineEnd = end;
          }

          document.execCommand("selectAll");
          document.execCommand("insertText", undefined, newText);

          const nextCursorStart = startOnLineBreak
            ? cursorStart
            : cursorStart + tab.length;
          const nextCursorEnd = cursorEnd + tabsInserted * tab.length;
          view.setCursor(nextCursorStart, nextCursorEnd);
        }
      };

      const handleUninsertTab = (event: CustomEvent): void => {
        const [cursorStart, cursorEnd] = view.getCursor();
        const text = view.getContent();
        const initialSpaces = /^ {4}/g;

        if (cursorStart !== cursorEnd) {
          const lines = toLines(text);
          let newText = "";
          let lastLineEnd = 0;
          let spacesRemoved = 0;
          let startOnLineBreak = false;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const start = lastLineEnd;
            const end = lastLineEnd + line.length + 1;

            let lineTransformed = line;

            if (i > 0) {
              newText += "\n";
            }

            if (end > cursorStart && start < cursorEnd) {
              lineTransformed = line.replace(initialSpaces, "");
            }

            if (start === cursorStart) {
              startOnLineBreak = true;
            }

            newText += lineTransformed;
            spacesRemoved += line.length - lineTransformed.length;
            lastLineEnd = end;
          }

          document.execCommand("selectAll");
          document.execCommand("insertText", undefined, newText);

          const nextCursorStart = startOnLineBreak
            ? cursorStart
            : cursorStart - 4;
          const nextCursorEnd = cursorEnd - spacesRemoved;
          view.setCursor(nextCursorStart, nextCursorEnd);
        }
      };

      editor.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          event.preventDefault();
          if (event.shiftKey) {
            handleUninsertTab(new CustomEvent("uninsertTab"));
          } else {
            handleInsertTab(new CustomEvent("insertTab"));
          }
        }
      });
    }

    return () => {
      if (editor) {
        editor.removeEventListener("keydown", () => {});
      }
    };
  }, []);

  // handle file load
  const handleLoad = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setText(event.target.result.toString());
          setFilename(file.name.trim());
        }
      };
      reader.readAsText(file);
    }
  };

  const resetEditor = () => {
    setText("");
    setFilename("simple-text.txt");
  };

  const handleExport = (
    type = "text/plain;charset=utf-8",
    extension = ".txt"
  ) => {
    const downloadName = filename.replace(/\.[^/.]+$/, "") + extension;
    const blob = new Blob([text], { type });
    saveAs(blob, downloadName);
  };

  const handleShare = async () => {
    try {
      setSharingLoader(true);
      let content = await share(text, filename);

      if (content.hasOwnProperty("error")) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: `${content.error}`,
        });
        setSharingLoader(false);
        return;
      }

      if (navigator.share) {
        const title = filename;
        const url = `${window.location.origin}${window.location.pathname}?text=${content.token}`;
        navigator
          .share({
            title,
            url,
            text: `Here is a temporary link to ${title}. The link expires in 1 day`,
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Something went wrong while sharing!",
              description: `${error}`,
            });
          });
      } else {
        toast({
          variant: "destructive",
          description: "Web Share API is not supported in this browser.",
        });
      }
      setSharingLoader(false);
    } catch (error) {
      setSharingLoader(false);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: JSON.stringify(error),
      });
    }
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (filename.trim() == "") setFilename("simple-text.txt");
    }, 700);
    if (filename.trim() !== "") {
      clearTimeout(timeout);
    }
    localStorage?.setItem("local_filename", filename.trim());
    return () => {
      clearTimeout(timeout);
    };
  }, [filename]);

  useEffect(() => {
    localStorage?.setItem("local_text", text.trim());
    setTextAnalytics((prev) => ({
      ...prev,
      lines: text.split("\n").length,
      characters: text.length,
      words: text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    }));
    if (
      filename?.toLowerCase() == "untitled.txt" &&
      text.split(" ").length > 3
    ) {
      debouncedUpdateFile(text.split(" ").slice(0, 4).join(" ") + ".txt");
    }
  }, [text]);

  return (
    <section
      className='flex flex-col relative h-screen'
      onMouseUp={handleSelectionChange}
    >
      <div className='py-5 sticky top-0 z-10 px-2 lg:px-6'>
        <div className='flex flex-wrap justify-between items-center mb-4 gap-2'>
          <h1 className='text-2xl font-semibold'>
            Simple Text Editor{" "}
            {isSaving && (
              <Save className='size-4 animate-bounce inline-block ml-2 opacity-20' />
            )}
          </h1>
          <div className='ml-auto md:hidden flex items-center gap-2'>
            <EditorConfigMenu />
          </div>
          <div className='flex items-center gap-4 w-full md:w-1/2 ml-auto'>
            <input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder='file name goes here'
              className='md:text-right flex-1  bg-transparent focus:border-b focus:border-0 w-full md:w-auto text-muted-foreground focus:outline-none focus:border-none focus:text-foreground'
            />
            <div className='hidden md:flex items-center gap-2'>
              {" "}
              <EditorConfigMenu />
            </div>
          </div>
        </div>
        <Menubar className='border-0 bg-muted w-auto max-w-screen overflow-x-scroll no-scrollbar text-xs sm:text-base'>
          <MenubarMenu>
            <MenubarTrigger
              onClick={resetEditor}
              className='hover:bg-background cursor-pointer'
            >
              New
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <div className='relative cursor-pointer hover:bg-background'>
                <label htmlFor='file-upload'>
                  <span>Load</span>
                </label>
                <input
                  type='file'
                  id='file-upload'
                  name='file-upload'
                  className='absolute left-0 w-full h-full opacity-0'
                  onChange={handleLoad}
                  accept='text/*'
                />
              </div>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className='cursor-pointer hover:bg-background'>
              Export
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleExport()}>
                Text (.txt)
              </MenubarItem>
              <MenubarItem
                onClick={() => handleExport("text/csv;charset=utf-8", ".csv")}
              >
                CSV
              </MenubarItem>
              <MenubarItem onClick={() => handleExport("text/markdown", ".md")}>
                Markdown
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              onClick={() => setPreview((prev) => !prev)}
              className='hover:bg-background cursor-pointer'
            >
              {preview ? "Edit" : "Preview"}
            </MenubarTrigger>
            <MenubarTrigger
              onClick={handleShare}
              className='hover:bg-background cursor-pointer'
              disabled={sharingLoader}
            >
              {sharingLoader && (
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
              )}{" "}
              Share
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* editor & preview section */}
      <div className='flex-1 overflow-scroll no-scrollbar px-2 lg:px-6'>
        {!preview && (
          <textarea
            id='editorTextArea'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={cn(
              "w-full h-[98%] editor bg-transparent focus:border-0 focus:outline-none"
            )}
            style={{
              fontSize: editorConfig?.fontSize,
              fontFamily: editorConfig?.fontFamily
                ? editorConfig?.fontFamily
                : "Inter, sans-serif",
            }}
            autoFocus={true}
          />
        )}
        {preview && (
          <div className='w-full h-[98%] editor bg-transparent focus:border-0 focus:outline-none markdown-body'>
            <Markdown>{text}</Markdown>
            <br />
          </div>
        )}
      </div>

      <div className='bg-analytics w-full absolute bottom-0 flex items-center gap-2 justify-end px-2 lg:px-6 text-sm py-1'>
        <span>Lines: {textAnalytics.lines}</span>
        <span>Characters: {textAnalytics.characters}</span>
        {textAnalytics.selectedCharacters > 0 && (
          <span>({textAnalytics.selectedCharacters} selected)</span>
        )}
        <span>Words: {textAnalytics.words}</span>
      </div>
    </section>
  );
}
