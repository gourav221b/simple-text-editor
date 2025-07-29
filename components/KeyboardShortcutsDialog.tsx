"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatShortcut } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsDialogProps) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const shortcutCategories = [
    {
      category: "Tab Management",
      shortcuts: [
        {
          keys: isMac ? "⌘T" : "Ctrl+T",
          description: "New Blank Tab",
        },
        {
          keys: isMac ? "⌘W" : "Ctrl+W",
          description: "Close Current Tab",
        },
        {
          keys: isMac ? "⌘⇥" : "Ctrl+Tab",
          description: "Next Tab",
        },
        {
          keys: isMac ? "⌘⇧⇥" : "Ctrl+Shift+Tab",
          description: "Previous Tab",
        },
        {
          keys: isMac ? "⌘D" : "Ctrl+D",
          description: "Duplicate Current Tab",
        },
        {
          keys: isMac ? "⌘⇧P" : "Ctrl+Shift+P",
          description: "Pin/Unpin Current Tab",
        },
      ],
    },
    {
      category: "File Operations",
      shortcuts: [
        {
          keys: isMac ? "⌘S" : "Ctrl+S",
          description: "Save Current File",
        },
      ],
    },
    {
      category: "Search & Navigation",
      shortcuts: [
        {
          keys: isMac ? "^F" : "Ctrl+F",
          description: "Find in Current File",
        },
        {
          keys: isMac ? "^⇧F" : "Ctrl+Shift+F",
          description: "Global Search (across all files)",
        },
      ],
    },
    {
      category: "Interface",
      shortcuts: [
        {
          keys: isMac ? "⌘B" : "Ctrl+B",
          description: "Toggle Sidebar (when available)",
        },
      ],
    },
  ];

  const contextMenuShortcuts = [
    {
      action: "Right-click on tab",
      description: "Open tab context menu (rename, duplicate, pin, color, etc.)",
    },
    {
      action: "Click color dot",
      description: "Quick access to tab color options",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 p-1">
            {/* Keyboard Shortcuts */}
            {shortcutCategories.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.keys}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Context Menu Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Mouse Actions
              </h3>
              <div className="space-y-2">
                {contextMenuShortcuts.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm">{action.description}</span>
                    <Badge variant="secondary" className="text-xs">
                      {action.action}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Features
              </h3>
              <div className="space-y-2">
                <div className="py-2 px-3 rounded-md bg-accent/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Auto-Save</span>
                    <Badge variant="default" className="text-xs">Enabled</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Files are automatically saved every 30 seconds
                  </p>
                </div>
                <div className="py-2 px-3 rounded-md bg-accent/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Version History</span>
                    <Badge variant="default" className="text-xs">Available</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click the history icon in the header to view/restore previous versions
                  </p>
                </div>
                <div className="py-2 px-3 rounded-md bg-accent/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">File Templates</span>
                    <Badge variant="default" className="text-xs">Available</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose from built-in templates when creating new files
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Tips
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="py-2 px-3 rounded-md border border-dashed border-border">
                  <p>💡 <strong>Pinned tabs</strong> stay at the beginning and are marked with a pin icon</p>
                </div>
                <div className="py-2 px-3 rounded-md border border-dashed border-border">
                  <p>💡 <strong>Tab colors</strong> help organize your files - set them via right-click menu</p>
                </div>
                <div className="py-2 px-3 rounded-md border border-dashed border-border">
                  <p>💡 <strong>Global search</strong> supports regular expressions for advanced pattern matching</p>
                </div>
                <div className="py-2 px-3 rounded-md border border-dashed border-border">
                  <p>💡 <strong>Find & Replace</strong> works within individual files with regex support</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
