"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import useRemoveSearchParams from "@/components/useRemoveParams";
import { cn, debounce, saveAs, toLines } from "@/lib/utils";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Markdown from "react-markdown";
import { useEditorConfigContext } from "./config-provider";

import { db, Editor } from "@/config/db";
import EditorConfigMenu from "@/components/EditorConfigMenu";
import BackupRestoreMenu from "@/components/BackupRestoreMenu";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";


import { Button } from "@/components/ui/button";

interface View {
  getCursor(): [number, number];
  getContent(): string;
  setCursor(start: number, end: number): void;
}

const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export default function Editor2({
  name = "new-tab",
  editor,
}: {
  name: string;
  editor: Editor;
}) {
  const [text, setText] = useState(() => {
    if (editor.content !== "") return editor.content;
    return "";
  });
  const [filename, setFilename] = useState(() => {
    if (editor.name !== "") return editor.name;
    return "simple-text.txt";
  });
  useEffect(() => {
    setFilename(editor.name !== "" ? editor.name : "simple-text.txt");
  }, [editor.id, editor.name]);

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

  const { editorConfig } = useEditorConfigContext();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
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
        editor.removeEventListener("keydown", () => { });
      }
    };
  }, []);

  // handle file load
  const handleLoad = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          await db.editors.update(editor.id, {
            name: file.name.trim(),
            content: event.target.result.toString(),
          });
          setIsSaving(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const resetEditor = async () => {
    await db.editors.update(editor.id, {
      name: "Untitled.txt",
      content: "",
    });
  };

  const handleExport = (
    type = "text/plain;charset=utf-8",
    extension = ".txt"
  ) => {
    const downloadName = filename.replace(/\.[^/.]+$/, "") + extension;
    const blob = new Blob([text], { type });
    saveAs(blob, downloadName);
  };


  // Debounced update function
  const debouncedUpdateFile = useCallback(
    debounce(async (newFilename: string) => {
      await db.editors
        .update(editor.id, {
          name: newFilename.trim() === "" ? "New Tab" : newFilename.trim(),
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error updating filename",
            description: JSON.stringify(err),
          });
          console.log(err);
        });
    }, 50),
    []
  );
  const debouncedUpdateContent = useCallback(
    debounce(async (newContent: string) => {
      setIsSaving(true);
      await db.editors
        .update(editor.id, {
          content: newContent.trim(),
        })
        .then(() => {
          setIsSaving(false);
        })
        .catch((err) => {
          setIsSaving(false);
          toast({
            variant: "destructive",
            title: "Error saving document",
            description: JSON.stringify(err),
          });
          console.log(err);
        });
    }, 50),
    []
  );

  useEffect(() => {
    if (filename !== editor.name) {
      debouncedUpdateFile(filename);
    }
  }, [filename]);

  useEffect(() => {
    if (text !== editor.content) {
      debouncedUpdateContent(text);
    }
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
      className='flex flex-col relative h-full bg-background'
      onMouseUp={handleSelectionChange}
      key={editor.id}
    >
      <div className='py-2 sticky top-0 z-10 px-2 lg:px-6 bg-background'>
        <div className='flex flex-wrap justify-between items-center mb-4 gap-2'>
          <h1 className='text-2xl font-semibold'>
            Simple Text Editor{" "}
            {isSaving && (
              <Save className='size-4 animate-bounce inline-block ml-2 opacity-20' />
            )}
          </h1>
          <div className='ml-auto md:hidden flex items-center gap-2'>
            <BackupRestoreMenu />
            <EditorConfigMenu />
          </div>
          <div className='flex items-center gap-4 w-full md:w-1/2 ml-auto'>
            <input
              value={filename}
              disabled
              onChange={(e) => {
                setFilename(e.target.value);
              }}
              placeholder='file name goes here'
              className='md:text-right flex-1  bg-transparent focus:border-b focus:border-0 w-full md:w-auto text-muted-foreground focus:outline-none focus:border-none focus:text-foreground'
            />
            <div className='hidden md:flex items-center gap-2'>
              {" "}
              <BackupRestoreMenu />
              <EditorConfigMenu />
            </div>
          </div>
        </div>
        <Menubar className='border-0 bg-muted w-auto max-w-screen overflow-x-scroll no-scrollbar text-xs sm:text-base'>
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
                  accept='text/*, .md'
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
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className='hover:bg-background cursor-pointer'>
              <Dialog>
                <DialogTrigger>Reset</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Reset</DialogTitle>
                  </DialogHeader>
                  Resetting would erase data for {editor.name} irreversibly. Are
                  you sure you want to continue?
                  <DialogFooter className='flex items-center gap-2'>
                    <DialogTrigger asChild>
                      <Button variant={"ghost"}>Cancel</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button variant={"destructive"} onClick={resetEditor}>
                        Reset
                      </Button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* editor & preview section */}
      <div className='flex-1 flex flex-col grow overflow-scroll no-scrollbar px-2 lg:px-6 pb-6 editor'>
        {!preview && (
          <textarea
            id='editorTextArea'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={cn(
              "w-full h-[98%] editor bg-background text-foreground focus:border-0 focus:outline-none"
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
          <div className='w-full flex-1 flex flex-col grow editor bg-background text-foreground focus:border-0 focus:outline-none markdown-body'>
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
