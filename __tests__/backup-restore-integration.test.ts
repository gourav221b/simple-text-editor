import { db } from '@/config/db';
import { exportBackup, importBackup, parseBackupFile, BackupData } from '@/lib/backup-restore';
import { createValidBackupData, createMockBackupFile } from './backup-restore.test';

// Mock the saveAs function
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  saveAs: jest.fn(),
}));

describe('Backup and Restore Integration Tests', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.editors.clear();
  });

  afterAll(async () => {
    // Clean up after all tests
    try {
      await db.editors.clear();
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Full Backup and Restore Workflow', () => {
    it('should export and import data successfully', async () => {
      // Setup: Add some test data to the database
      const testEditors = [
        { name: 'Test File 1.txt', content: 'Content of test file 1' },
        { name: 'Test File 2.md', content: '# Markdown Test\n\nThis is markdown content.' },
        { name: 'Empty File.txt', content: '' },
      ];

      // Add editors to database
      for (const editor of testEditors) {
        await db.editors.add(editor);
      }

      // Verify data was added
      const initialEditors = await db.editors.toArray();
      expect(initialEditors).toHaveLength(3);

      // Test export functionality
      const { saveAs } = require('@/lib/utils');
      await exportBackup();

      // Verify saveAs was called
      expect(saveAs).toHaveBeenCalledTimes(1);
      const [blob, filename] = saveAs.mock.calls[0];
      expect(blob).toBeInstanceOf(Blob);
      expect(filename).toMatch(/text-editor-backup-\d{4}-\d{2}-\d{2}\.json/);

      // Read the blob content to verify export data
      const exportedText = await blob.text();
      const exportedData = JSON.parse(exportedText);

      expect(exportedData.version).toBe('1.0.0');
      expect(exportedData.editors).toHaveLength(3);
      expect(exportedData.metadata.totalTabs).toBe(3);

      // Clear database to simulate fresh start
      await db.editors.clear();
      expect(await db.editors.count()).toBe(0);

      // Test import functionality
      const results = await importBackup(exportedData, { strategy: 'merge' });

      expect(results.imported).toBe(3);
      expect(results.skipped).toBe(0);
      expect(results.errors).toBe(0);

      // Verify data was imported correctly
      const importedEditors = await db.editors.toArray();
      expect(importedEditors).toHaveLength(3);

      // Check that content matches (order might be different due to auto-generated IDs)
      const importedNames = importedEditors.map(e => e.name).sort();
      const originalNames = testEditors.map(e => e.name).sort();
      expect(importedNames).toEqual(originalNames);
    });

    it('should handle merge strategy correctly', async () => {
      // Add initial data
      await db.editors.add({ name: 'Existing File.txt', content: 'Existing content' });

      // Create backup data with one duplicate and one new file
      const backupData = createValidBackupData(2);
      backupData.editors[0].name = 'Existing File.txt'; // Duplicate
      backupData.editors[1].name = 'New File.txt'; // New

      // Import with merge strategy
      const results = await importBackup(backupData, { strategy: 'merge', skipDuplicates: true });

      expect(results.imported).toBe(1); // Only new file imported
      expect(results.skipped).toBe(1); // Duplicate skipped
      expect(results.errors).toBe(0);

      // Verify final state
      const finalEditors = await db.editors.toArray();
      expect(finalEditors).toHaveLength(2);

      const names = finalEditors.map(e => e.name).sort();
      expect(names).toEqual(['Existing File.txt', 'New File.txt']);
    });

    it('should handle replace strategy correctly', async () => {
      // Add initial data
      await db.editors.add({ name: 'Existing File.txt', content: 'Existing content' });
      await db.editors.add({ name: 'Another File.txt', content: 'Another content' });

      expect(await db.editors.count()).toBe(2);

      // Create backup data with different files
      const backupData = createValidBackupData(1);
      backupData.editors[0].name = 'Replacement File.txt';

      // Import with replace strategy
      const results = await importBackup(backupData, { strategy: 'replace' });

      expect(results.imported).toBe(1);
      expect(results.skipped).toBe(0);
      expect(results.errors).toBe(0);

      // Verify all old data was replaced
      const finalEditors = await db.editors.toArray();
      expect(finalEditors).toHaveLength(1);
      expect(finalEditors[0].name).toBe('Replacement File.txt');
    });

    it('should handle file parsing errors gracefully', async () => {
      // Test with invalid JSON file
      const invalidFile = new File(['invalid json content'], 'invalid.json', { type: 'application/json' });

      await expect(parseBackupFile(invalidFile)).rejects.toThrow('Invalid JSON format');

      // Test with wrong file extension
      const wrongExtFile = new File(['{}'], 'backup.txt', { type: 'text/plain' });

      await expect(parseBackupFile(wrongExtFile)).rejects.toThrow('Invalid file type');

      // Test with empty file
      const emptyFile = new File([''], 'empty.json', { type: 'application/json' });

      await expect(parseBackupFile(emptyFile)).rejects.toThrow('Empty file');
    });

    it('should validate backup data structure', async () => {
      // Test with missing required fields
      const invalidBackupData = {
        version: '1.0.0',
        // missing timestamp and editors
      };

      await expect(importBackup(invalidBackupData as any, { strategy: 'merge' }))
        .rejects.toThrow('Invalid backup format');

      // Test with invalid editor data
      const invalidEditorData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        editors: [
          { id: 'invalid', name: 123, content: null } // Invalid types
        ],
        metadata: { totalTabs: 1, exportedBy: 'Test' }
      };

      await expect(importBackup(invalidEditorData as any, { strategy: 'merge' }))
        .rejects.toThrow('Invalid editor data');
    });

    it('should handle database errors during import', async () => {
      // Create valid backup data
      const backupData = createValidBackupData(1);

      // Mock database error
      const originalAdd = db.editors.add;
      db.editors.add = jest.fn().mockRejectedValue(new Error('Database error'));

      const results = await importBackup(backupData, { strategy: 'merge' });

      expect(results.imported).toBe(0);
      expect(results.errors).toBe(1);

      // Restore original method
      db.editors.add = originalAdd;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty backup data', async () => {
      const emptyBackupData = createValidBackupData(0); // No editors

      const results = await importBackup(emptyBackupData, { strategy: 'merge' });

      expect(results.imported).toBe(0);
      expect(results.skipped).toBe(0);
      expect(results.errors).toBe(0);
    });

    it('should handle large backup files', async () => {
      // Create backup with many editors
      const largeBackupData = createValidBackupData(100);

      const results = await importBackup(largeBackupData, { strategy: 'replace' });

      expect(results.imported).toBe(100);
      expect(results.errors).toBe(0);

      // Verify all were imported
      const finalCount = await db.editors.count();
      expect(finalCount).toBe(100);
    });

    it('should preserve content integrity', async () => {
      const specialContent = `
        Special characters: !@#$%^&*()
        Unicode: 🚀 ✨ 🎉
        Newlines and tabs:
        \tTabbed content
        
        Empty lines above
        
        Code block:
        \`\`\`javascript
        console.log('Hello, World!');
        \`\`\`
      `;

      // Add editor with special content
      await db.editors.add({ name: 'Special Content.md', content: specialContent });

      // Export and re-import
      const { saveAs } = require('@/lib/utils');
      await exportBackup();

      const [blob] = saveAs.mock.calls[saveAs.mock.calls.length - 1];
      const exportedText = await blob.text();
      const exportedData = JSON.parse(exportedText);

      await db.editors.clear();
      await importBackup(exportedData, { strategy: 'merge' });

      // Verify content integrity
      const importedEditors = await db.editors.toArray();
      expect(importedEditors).toHaveLength(1);
      expect(importedEditors[0].content).toBe(specialContent);
    });
  });
});
