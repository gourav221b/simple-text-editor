"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Archive, Loader2 } from "lucide-react";
import { useBackupRestore } from "@/hooks/use-backup-restore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function BackupRestoreMenu() {
  const {
    isImporting,
    isExporting,
    importStrategy,
    handleExport,
    handleImport,
    setImportStrategy,
  } = useBackupRestore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection for import
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleImport(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
          title="Backup & Restore"
        >
          <Archive className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Backup & Restore</p>
          <p className="text-xs text-muted-foreground">
            Manage your editor data
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full justify-start h-auto p-2"
            variant="ghost"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export All Tabs
          </Button>
        </DropdownMenuItem>

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Upload className="w-4 h-4 mr-2" />
              Import Backup
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Backup</DialogTitle>
              <DialogDescription>
                Select your backup file and choose how to handle the data.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-strategy">Import Strategy</Label>
                <Select
                  value={importStrategy}
                  onValueChange={setImportStrategy}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merge">
                      Merge with existing tabs
                    </SelectItem>
                    <SelectItem value="replace">
                      Replace all existing tabs
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {importStrategy === 'merge'
                    ? 'Add new tabs alongside existing ones. Duplicates will be skipped.'
                    : 'Delete all current tabs and replace with backup data.'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-file">Select Backup File</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="backup-file"
                  accept=".json"
                  onChange={handleFileSelect}
                  disabled={isImporting}
                  className="w-full p-2 text-sm border rounded-md cursor-pointer
                           file:mr-4 file:py-1 file:px-2 file:rounded file:border-0
                           file:text-sm file:font-medium file:bg-primary
                           file:text-primary-foreground hover:file:bg-primary/90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isImporting}>
                  Cancel
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
