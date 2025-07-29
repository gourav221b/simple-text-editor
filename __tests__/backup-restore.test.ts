import { validateBackupData, parseBackupFile, BackupData } from '@/lib/backup-restore';

// Mock data for testing
const validBackupData: BackupData = {
  version: '1.0.0',
  timestamp: '2024-01-01T00:00:00.000Z',
  editors: [
    {
      id: 1,
      name: 'Test File 1.txt',
      content: 'This is test content for file 1'
    },
    {
      id: 2,
      name: 'Test File 2.md',
      content: '# Test Markdown\n\nThis is test markdown content.'
    }
  ],
  metadata: {
    totalTabs: 2,
    exportedBy: 'Simple Text Editor'
  }
};

describe('Backup and Restore Functionality', () => {
  describe('validateBackupData', () => {
    it('should validate correct backup data', () => {
      expect(() => validateBackupData(validBackupData)).not.toThrow();
    });

    it('should throw error for null data', () => {
      expect(() => validateBackupData(null)).toThrow('Invalid file format: File must contain valid JSON data');
    });

    it('should throw error for missing version', () => {
      const invalidData = { ...validBackupData };
      delete (invalidData as any).version;
      expect(() => validateBackupData(invalidData)).toThrow('Invalid backup format: Missing version information');
    });

    it('should throw error for missing timestamp', () => {
      const invalidData = { ...validBackupData };
      delete (invalidData as any).timestamp;
      expect(() => validateBackupData(invalidData)).toThrow('Invalid backup format: Missing timestamp information');
    });

    it('should throw error for invalid editors array', () => {
      const invalidData = { ...validBackupData, editors: 'not an array' };
      expect(() => validateBackupData(invalidData)).toThrow('Invalid backup format: Missing or invalid editors data');
    });

    it('should throw error for invalid editor object', () => {
      const invalidData = { 
        ...validBackupData, 
        editors: [{ id: 1, name: 'test' }] // missing content
      };
      expect(() => validateBackupData(invalidData)).toThrow('Invalid editor data at position 1: Missing or invalid content');
    });

    it('should throw error for invalid editor ID', () => {
      const invalidData = { 
        ...validBackupData, 
        editors: [{ id: 'invalid', name: 'test', content: 'content' }]
      };
      expect(() => validateBackupData(invalidData)).toThrow('Invalid editor data at position 1: Missing or invalid ID');
    });

    it('should throw error for invalid editor name', () => {
      const invalidData = { 
        ...validBackupData, 
        editors: [{ id: 1, name: 123, content: 'content' }]
      };
      expect(() => validateBackupData(invalidData)).toThrow('Invalid editor data at position 1: Missing or invalid name');
    });
  });

  describe('parseBackupFile', () => {
    it('should reject non-JSON files', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      await expect(parseBackupFile(file)).rejects.toThrow('Invalid file type: Please select a JSON backup file');
    });

    it('should reject empty files', async () => {
      const file = new File([''], 'test.json', { type: 'application/json' });
      await expect(parseBackupFile(file)).rejects.toThrow('Empty file: Please select a valid backup file');
    });

    it('should reject files that are too large', async () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const file = new File([largeContent], 'test.json', { type: 'application/json' });
      await expect(parseBackupFile(file)).rejects.toThrow('File too large: Backup file must be smaller than 10MB');
    });

    it('should reject invalid JSON', async () => {
      const file = new File(['invalid json'], 'test.json', { type: 'application/json' });
      await expect(parseBackupFile(file)).rejects.toThrow('Invalid JSON format: The file does not contain valid JSON data');
    });

    it('should parse valid backup file', async () => {
      const jsonContent = JSON.stringify(validBackupData);
      const file = new File([jsonContent], 'backup.json', { type: 'application/json' });
      const result = await parseBackupFile(file);
      expect(result).toEqual(validBackupData);
    });
  });
});

// Integration test helper
export function createMockBackupFile(data: any): File {
  const jsonContent = JSON.stringify(data);
  return new File([jsonContent], 'test-backup.json', { type: 'application/json' });
}

// Test data generators
export function createValidBackupData(editorCount: number = 2): BackupData {
  const editors = Array.from({ length: editorCount }, (_, i) => ({
    id: i + 1,
    name: `Test File ${i + 1}.txt`,
    content: `This is test content for file ${i + 1}`
  }));

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    editors,
    metadata: {
      totalTabs: editorCount,
      exportedBy: 'Simple Text Editor'
    }
  };
}

export function createInvalidBackupData(type: 'missing-version' | 'missing-editors' | 'invalid-editor'): any {
  const base = createValidBackupData(1);
  
  switch (type) {
    case 'missing-version':
      delete (base as any).version;
      return base;
    case 'missing-editors':
      delete (base as any).editors;
      return base;
    case 'invalid-editor':
      base.editors[0] = { id: 'invalid', name: 123, content: null } as any;
      return base;
    default:
      return base;
  }
}
