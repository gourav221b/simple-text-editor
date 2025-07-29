import { db, Editor } from '@/config/db';
import { saveAs } from '@/lib/utils';

// Interface for backup data structure
export interface BackupData {
  version: string;
  timestamp: string;
  editors: Editor[];
  metadata: {
    totalTabs: number;
    exportedBy: string;
  };
}

// Interface for import options
export interface ImportOptions {
  strategy: 'merge' | 'replace';
  skipDuplicates?: boolean;
}

/**
 * Export all editor data from IndexedDB as a JSON backup file
 */
export async function exportBackup(): Promise<void> {
  try {
    // Fetch all editor data from IndexedDB
    const editors = await db.editors.toArray();

    // Create backup data structure
    const backupData: BackupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      editors: editors,
      metadata: {
        totalTabs: editors.length,
        exportedBy: 'Simple Text Editor'
      }
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(backupData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const filename = `text-editor-backup-${new Date().toISOString().split('T')[0]}.json`;

    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting backup:', error);
    throw new Error('Failed to export backup data');
  }
}

/**
 * Validate backup file format
 */
export function validateBackupData(data: any): data is BackupData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid file format: File must contain valid JSON data');
  }

  // Check required fields
  if (!data.version) {
    throw new Error('Invalid backup format: Missing version information');
  }

  if (!data.timestamp) {
    throw new Error('Invalid backup format: Missing timestamp information');
  }

  if (!Array.isArray(data.editors)) {
    throw new Error('Invalid backup format: Missing or invalid editors data');
  }

  // Validate editors array
  for (let i = 0; i < data.editors.length; i++) {
    const editor = data.editors[i];
    if (!editor || typeof editor !== 'object') {
      throw new Error(`Invalid editor data at position ${i + 1}: Editor must be an object`);
    }

    // Check required editor fields
    if (typeof editor.id !== 'number') {
      throw new Error(`Invalid editor data at position ${i + 1}: Missing or invalid ID`);
    }

    if (typeof editor.name !== 'string') {
      throw new Error(`Invalid editor data at position ${i + 1}: Missing or invalid name`);
    }

    if (typeof editor.content !== 'string') {
      throw new Error(`Invalid editor data at position ${i + 1}: Missing or invalid content`);
    }
  }

  return true;
}

/**
 * Import backup data and restore to IndexedDB
 */
export async function importBackup(
  backupData: BackupData,
  options: ImportOptions = { strategy: 'merge', skipDuplicates: true }
): Promise<{ imported: number; skipped: number; errors: number }> {
  const results = { imported: 0, skipped: 0, errors: 0 };

  try {
    // If replace strategy, clear existing data
    if (options.strategy === 'replace') {
      await db.editors.clear();
    }

    // Get existing editors for duplicate checking
    const existingEditors = options.skipDuplicates ? await db.editors.toArray() : [];
    const existingNames = new Set(existingEditors.map(e => e.name));

    // Import each editor
    for (const editorData of backupData.editors) {
      try {
        // Skip duplicates if option is enabled
        if (options.skipDuplicates && existingNames.has(editorData.name)) {
          results.skipped++;
          continue;
        }

        // Create new editor (without id to let IndexedDB auto-generate)
        const { id, ...editorWithoutId } = editorData;
        await db.editors.add(editorWithoutId);
        results.imported++;
      } catch (error) {
        console.error(`Error importing editor "${editorData.name}":`, error);
        results.errors++;
      }
    }

    return results;
  } catch (error) {
    console.error('Error importing backup:', error);
    throw new Error('Failed to import backup data');
  }
}

/**
 * Parse backup file from File object
 */
export async function parseBackupFile(file: File): Promise<BackupData> {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.json')) {
    throw new Error('Invalid file type: Please select a JSON backup file');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large: Backup file must be smaller than 10MB');
  }

  if (file.size === 0) {
    throw new Error('Empty file: Please select a valid backup file');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;

        if (!jsonString || jsonString.trim() === '') {
          reject(new Error('Empty file: The selected file appears to be empty'));
          return;
        }

        let data;
        try {
          data = JSON.parse(jsonString);
        } catch (parseError) {
          reject(new Error('Invalid JSON format: The file does not contain valid JSON data'));
          return;
        }

        // Validate the backup data structure
        validateBackupData(data);

        resolve(data);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse backup file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file: There was an error reading the selected file'));
    };

    reader.readAsText(file);
  });
}
