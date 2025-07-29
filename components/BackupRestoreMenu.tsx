"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, DatabaseBackup } from "lucide-react";
import { exportBackup, importBackup, parseBackupFile, ImportOptions } from "@/lib/backup-restore";
import { useToast } from "@/components/ui/use-toast";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BackupRestoreMenu() {
  const [isImporting, setIsImporting] = useState(false);
  const [importStrategy, setImportStrategy] = useState<'merge' | 'replace'>('merge');
  const { toast } = useToast();

  // Handle backup export
  const handleBackupExport = async () => {
    try {
      await exportBackup();
      toast({
        title: "Backup exported successfully",
        description: "Your editor data has been exported as a JSON file.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export backup data. Please try again.",
      });
    }
  };

  // Handle backup import
  const handleBackupImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const backupData = await parseBackupFile(file);
      const options: ImportOptions = {
        strategy: importStrategy,
        skipDuplicates: true
      };

      const results = await importBackup(backupData, options);

      toast({
        title: "Backup imported successfully",
        description: `Imported ${results.imported} tabs, skipped ${results.skipped} duplicates${results.errors > 0 ? `, ${results.errors} errors` : ''}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import backup data.",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2"
              >
                <DatabaseBackup className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Backup & Restore</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-64" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium leading-none mb-2">Backup & Restore</h4>
              <p className="text-sm text-muted-foreground">
                Export or import all your editor tabs
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleBackupExport}
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Tabs
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Backup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Backup Data</DialogTitle>
                    <DialogDescription>
                      Choose how to handle the imported data and select your backup file.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="import-strategy">Import Strategy</Label>
                      <Select value={importStrategy} onValueChange={(value: 'merge' | 'replace') => setImportStrategy(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select import strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merge">
                            Merge with existing data (skip duplicates)
                          </SelectItem>
                          <SelectItem value="replace">
                            Replace all existing data
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {importStrategy === 'merge'
                          ? 'New tabs will be added alongside existing ones. Tabs with duplicate names will be skipped.'
                          : 'All existing tabs will be deleted and replaced with the imported data.'
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-file">Backup File</Label>
                      <div className='relative'>
                        <input
                          type='file'
                          id='backup-file'
                          name='backup-file'
                          className='w-full p-2 border rounded-md cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                          onChange={handleBackupImport}
                          accept='.json'
                          disabled={isImporting}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogTrigger asChild>
                      <Button variant="ghost">Cancel</Button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
