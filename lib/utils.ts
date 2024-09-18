import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export enum ViewEvents {
  NEW_FILE = 'new_file',
  OPEN_FILE = 'open_file',
  SAVE_FILE = 'save_file',
  INSERT_TAB = 'insert_tab',
}

export enum LocalstorageItems {
  LOCAL_TEXT = 'simple-text',
  LOCAL_FILENAME = "simple-text-filename"
}
export const JWTMessage = {
  "jwt expired": "File link has expired",
  "invalid token": "Invalid file link"

}


export function saveAs(blob: Blob, filename = "Gg-Editor.txt") {
  const blobUrl = URL.createObjectURL(blob);
  let link = document.createElement("a"); // Or maybe get it from the current document
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click()
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl)
}
export function debounce(callback: Function, delay: number = 500) {
  let timeout: any
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => { callback(...args) }, delay)
  }
}

export function trimEnd(text: string) {
  const trimPoint = text.match(/(\s)+$/g);
  if (trimPoint) {
    return text.substring(0, trimPoint.index);
  } else {
    return text;
  }
}

export function toLines(text: string) {
  return text.split(/\r\n|\r|\n/);
}

export function toggleFullScreen() {
  if (typeof window == "undefined")
    return
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

