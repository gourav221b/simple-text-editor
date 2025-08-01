"use client";
import { Button } from "@/components/ui/button";
import { useEditorConfigContext } from "@/app/config-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Glasses, RotateCcw } from "lucide-react";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, THEMES } from "@/lib/constants";
import { getThemeList, EditorTheme } from "@/lib/themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FontFamily, fontFamilies } from "@/lib/fonts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTheme } from "next-themes";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

function EditorConfigMenu() {
  const localStorage =
    typeof window !== "undefined" ? window.localStorage : null;
  const { editorConfig, setFontFamily, setFontSize, setConfigTheme } =
    useEditorConfigContext();
  const { theme, setTheme } = useTheme();

  const [showReset, setShowReset] = useState(false);
  const resetEditor = () => {
    setFontSize(20);
    setFontFamily("system-ui, sans-serif");
  };

  useEffect(() => {
    if (
      editorConfig?.fontSize == 20 &&
      editorConfig?.fontFamily == "system-ui, sans-serif"
    ) {
      setShowReset(false);
    } else setShowReset(true);
  }, [editorConfig]);

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size={"icon"}>
            <Glasses />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Settings</h4>
              <p className='text-sm text-muted-foreground'>
                Set the configuration for your editor
              </p>
            </div>
            <div className='grid gap-2'>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='fontSize'>Font Size</Label>
                <div className='flex items-center gap-2 col-span-2'>
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    className='p-2 h-8'
                    disabled={editorConfig?.fontSize == MIN_FONT_SIZE}
                    onClick={() => {
                      if (editorConfig?.fontSize)
                        setFontSize(editorConfig?.fontSize - 1);
                    }}
                  >
                    -
                  </Button>
                  <Input
                    type='number'
                    id='fontSize'
                    min={2}
                    max={64}
                    value={editorConfig?.fontSize}
                    className='w-12 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                  <Button
                    variant={"secondary"}
                    className='p-2 h-8'
                    size={"icon"}
                    disabled={editorConfig?.fontSize == MAX_FONT_SIZE}
                    onClick={() => {
                      if (editorConfig?.fontSize)
                        setFontSize(editorConfig?.fontSize + 1);
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='font family'>Font Family</Label>
                <Select
                  name='font family'
                  onValueChange={(e) => setFontFamily(e)}
                  value={editorConfig?.fontFamily || fontFamilies[0].font}
                >
                  <SelectTrigger className='col-span-2'>
                    <SelectValue placeholder='Font family' />
                  </SelectTrigger>
                  <SelectContent className='flex-1'>
                    {fontFamilies.map((fontFamily: FontFamily) => (
                      <SelectItem
                        value={fontFamily.font}
                        key={fontFamily.id}
                        style={{ fontFamily: fontFamily.font }}
                      >
                        {fontFamily.fontName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='theme'>Theme</Label>
                <Select
                  onValueChange={(e) => setConfigTheme(e)}
                  value={editorConfig?.theme || THEMES[0]}
                >
                  <SelectTrigger className='col-span-2'>
                    <SelectValue placeholder='Select theme' />
                  </SelectTrigger>
                  <SelectContent className='flex-1 max-h-[300px]'>
                    {getThemeList().map((themeObj: EditorTheme) => (
                      <SelectItem
                        value={themeObj.id}
                        key={themeObj.id}
                        className='cursor-pointer'
                      >
                        <div className='flex items-center gap-3 w-full'>
                          <div
                            className='w-4 h-4 rounded border border-border flex-shrink-0'
                            style={{
                              backgroundColor: themeObj.colors.editorBackground,
                              border: `1px solid ${themeObj.colors.border}`
                            }}
                          />
                          <div className='flex flex-col items-start'>
                            <span className='font-medium'>{themeObj.displayName}</span>
                            <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                              {themeObj.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        </PopoverContent>
      </Popover>
      {showReset && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='outline'
                size={"icon"}
                onClick={() => {
                  if (editorConfig?.fontSize) resetEditor();
                }}
              >
                <RotateCcw className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset editor settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export default EditorConfigMenu;
