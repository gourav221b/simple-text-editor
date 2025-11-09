"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Copy,
  Pin,
  PinOff,
  X,
  Edit2,
  Trash2
} from "lucide-react";
import { db, Editor } from "@/config/db";
import { useToast } from "@/components/ui/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TAB_COLORS, getFileTypeColor } from "@/lib/tab-colors";

interface TabContextMenuProps {
  editor: Editor;
  children: React.ReactNode;
  onClose?: () => void;
  onDuplicate?: () => void;
}

export default function TabContextMenu({
  editor,
  children,
  onClose,
  onDuplicate
}: TabContextMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(editor.name);
  const { toast } = useToast();

  useEffect(() => {
    setNewName(editor.name);
  }, [editor.name]);

  const openRenameDialog = () => {
    // Defer dialog opening so the menu can close and release pointer events.
    requestAnimationFrame(() => {
      setNewName(editor.name);
      setIsRenaming(true);
    });
  };

  const handleColorChange = async (color: string) => {
    try {
      await db.editors.update(editor.id, {
        color,
        updatedAt: new Date()
      });

      toast({
        title: "Tab color updated",
        description: `"${editor.name}" color has been changed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tab color.",
      });
    }
  };

  const handleTogglePin = async () => {
    try {
      await db.editors.update(editor.id, {
        isPinned: !editor.isPinned,
        updatedAt: new Date()
      });

      toast({
        title: editor.isPinned ? "Tab unpinned" : "Tab pinned",
        description: `"${editor.name}" has been ${editor.isPinned ? 'unpinned' : 'pinned'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tab pin status.",
      });
    }
  };



  const handleDuplicate = async () => {
    try {
      const maxOrder = await db.editors.orderBy('order').last();
      const duplicateName = `${editor.name} (Copy)`;

      await db.editors.add({
        name: duplicateName,
        content: editor.content,
        color: editor.color,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: (maxOrder?.order || 0) + 1,
      });

      toast({
        title: "Tab duplicated",
        description: `"${duplicateName}" has been created.`,
      });

      onDuplicate?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate tab.",
      });
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Tab name cannot be empty.",
      });
      return;
    }

    try {
      const trimmedName = newName.trim();

      await db.editors.update(editor.id, {
        name: trimmedName,
        updatedAt: new Date()
      });

      setNewName(trimmedName);
      setIsRenaming(false);

      toast({
        title: "Tab renamed",
        description: `Tab renamed to "${trimmedName}".`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to rename tab.",
      });
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const autoDetectedColor = getFileTypeColor(editor.name);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={openRenameDialog}>
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </ContextMenuItem>

          <ContextMenuItem onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </ContextMenuItem>

          <ContextMenuItem onClick={handleTogglePin}>
            {editor.isPinned ? (
              <>
                <PinOff className="w-4 h-4 mr-2" />
                Unpin Tab
              </>
            ) : (
              <>
                <Pin className="w-4 h-4 mr-2" />
                Pin Tab
              </>
            )}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Palette className="w-4 h-4 mr-2" />
              Change Color
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem onClick={() => handleColorChange(autoDetectedColor)}>
                <div
                  className="w-4 h-4 mr-2 rounded-full border"
                  style={{ backgroundColor: autoDetectedColor }}
                />
                Auto (File Type)
              </ContextMenuItem>
              <ContextMenuSeparator />
              {TAB_COLORS.map((color) => (
                <ContextMenuItem
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                >
                  <div
                    className="w-4 h-4 mr-2 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </ContextMenuItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => handleColorChange('')}>
                <div className="w-4 h-4 mr-2 rounded-full border bg-gray-300" />
                Default
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={handleClose}
            className="text-red-600 focus:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Close Tab
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tab</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tab-name">Tab Name</Label>
              <Input
                id="tab-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter tab name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
      setIsRenaming(false);
    }}>
      Cancel
    </Button>
            <Button onClick={handleRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
