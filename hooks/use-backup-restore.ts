"use client";

import { useState, ChangeEvent } from "react";
import { exportBackup, importBackup, parseBackupFile, ImportOptions } from "@/lib/backup-restore";
import { useToast } from "@/components/ui/use-toast";

export interface BackupRestoreState {
  isImporting: boolean;
  isExporting: boolean;
  importStrategy: 'merge' | 'replace';
}

export interface BackupRestoreActions {
  handleExport: () => Promise<void>;
  handleImport: (file: File) => Promise<void>;
  setImportStrategy: (strategy: 'merge' | 'replace') => void;
  resetImportState: () => void;
}

// Toast helper functions
const createToast = (toast: any) => ({
  success: (title: string, description: string) => {
    toast({
      title,
      description,
    });
  },
  error: (title: string, description: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  },
});

export function useBackupRestore(): BackupRestoreState & BackupRestoreActions {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importStrategy, setImportStrategy] = useState<'merge' | 'replace'>('merge');
  const { toast } = useToast();
  const toastHelper = createToast(toast);

  const handleExport = async (): Promise<void> => {
    setIsExporting(true);
    try {
      await exportBackup();
      toastHelper.success(
        "Backup exported successfully",
        "Your editor data has been exported as a JSON file."
      );
    } catch (error) {
      toastHelper.error(
        "Export failed",
        "Failed to export backup data. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: File): Promise<void> => {
    setIsImporting(true);
    try {
      const backupData = await parseBackupFile(file);
      const options: ImportOptions = {
        strategy: importStrategy,
        skipDuplicates: true
      };

      const results = await importBackup(backupData, options);

      toastHelper.success(
        "Backup imported successfully",
        `Imported ${results.imported} tabs, skipped ${results.skipped} duplicates${
          results.errors > 0 ? `, ${results.errors} errors` : ''
        }.`
      );
    } catch (error) {
      toastHelper.error(
        "Import failed",
        error instanceof Error ? error.message : "Failed to import backup data."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const resetImportState = () => {
    setIsImporting(false);
    setImportStrategy('merge');
  };

  return {
    // State
    isImporting,
    isExporting,
    importStrategy,
    // Actions
    handleExport,
    handleImport,
    setImportStrategy,
    resetImportState,
  };
}
