// Predefined tab colors
export const TAB_COLORS = [
  { name: 'Blue', value: '#3b82f6', light: '#dbeafe' },
  { name: 'Green', value: '#10b981', light: '#d1fae5' },
  { name: 'Purple', value: '#8b5cf6', light: '#ede9fe' },
  { name: 'Pink', value: '#ec4899', light: '#fce7f3' },
  { name: 'Yellow', value: '#f59e0b', light: '#fef3c7' },
  { name: 'Red', value: '#ef4444', light: '#fee2e2' },
  { name: 'Indigo', value: '#6366f1', light: '#e0e7ff' },
  { name: 'Orange', value: '#f97316', light: '#fed7aa' },
  { name: 'Teal', value: '#14b8a6', light: '#ccfbf1' },
  { name: 'Gray', value: '#6b7280', light: '#f3f4f6' },
] as const;

// File type to color mapping
export const FILE_TYPE_COLORS: Record<string, string> = {
  // Web technologies
  '.html': '#e34c26', // HTML orange
  '.htm': '#e34c26',
  '.css': '#1572b6', // CSS blue
  '.scss': '#cf649a', // Sass pink
  '.sass': '#cf649a',
  '.less': '#1d365d', // Less dark blue
  '.js': '#f7df1e', // JavaScript yellow
  '.jsx': '#61dafb', // React cyan
  '.ts': '#3178c6', // TypeScript blue
  '.tsx': '#3178c6',
  '.vue': '#4fc08d', // Vue green
  '.svelte': '#ff3e00', // Svelte orange

  // Backend languages
  '.py': '#3776ab', // Python blue
  '.java': '#ed8b00', // Java orange
  '.php': '#777bb4', // PHP purple
  '.rb': '#cc342d', // Ruby red
  '.go': '#00add8', // Go cyan
  '.rs': '#dea584', // Rust orange
  '.cpp': '#00599c', // C++ blue
  '.c': '#a8b9cc', // C gray-blue
  '.cs': '#239120', // C# green
  '.swift': '#fa7343', // Swift orange
  '.kt': '#7f52ff', // Kotlin purple

  // Data formats
  '.json': '#000000', // JSON black
  '.xml': '#0060ac', // XML blue
  '.yaml': '#cb171e', // YAML red
  '.yml': '#cb171e',
  '.toml': '#9c4221', // TOML brown
  '.csv': '#217346', // CSV green

  // Documentation
  '.md': '#083fa1', // Markdown blue
  '.mdx': '#1f6feb', // MDX blue
  '.txt': '#6b7280', // Text gray
  '.rtf': '#6b7280',
  '.doc': '#2b579a', // Word blue
  '.docx': '#2b579a',
  '.pdf': '#dc2626', // PDF red

  // Configuration
  '.env': '#ecd53f', // Environment yellow
  '.config': '#6b7280', // Config gray
  '.ini': '#6b7280',
  '.conf': '#6b7280',
  '.gitignore': '#f05032', // Git orange
  '.dockerfile': '#2496ed', // Docker blue
  '.docker': '#2496ed',

  // Shell scripts
  '.sh': '#89e051', // Shell green
  '.bash': '#89e051',
  '.zsh': '#89e051',
  '.fish': '#89e051',
  '.ps1': '#012456', // PowerShell blue

  // Default fallback
  'default': '#6b7280', // Gray
};

// Get color for file extension
export function getFileTypeColor(filename: string): string {
  const extension = getFileExtension(filename);
  return FILE_TYPE_COLORS[extension] || FILE_TYPE_COLORS.default;
}

// Extract file extension from filename
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot).toLowerCase();
}

// Get file type display name
export function getFileTypeName(filename: string): string {
  const extension = getFileExtension(filename);
  const typeNames: Record<string, string> = {
    '.html': 'HTML',
    '.css': 'CSS',
    '.js': 'JavaScript',
    '.jsx': 'React',
    '.ts': 'TypeScript',
    '.tsx': 'React TypeScript',
    '.py': 'Python',
    '.java': 'Java',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.txt': 'Text',
    '.sh': 'Shell Script',
    '.env': 'Environment',
  };

  return typeNames[extension] || extension.substring(1).toUpperCase() || 'File';
}

// Convert hex color to RGB with alpha
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Get a lighter version of a color for inactive tabs
export function getLighterColor(hex: string, amount: number = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
  const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
  const newB = Math.min(255, Math.floor(b + (255 - b) * amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Get contrasting text color (black or white) for a background color
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}
