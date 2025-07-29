export interface EditorTheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: {
    // Editor specific colors
    editorBackground: string;
    editorForeground: string;
    editorSelection: string;
    editorSelectionHighlight: string;
    editorCursor: string;
    editorLineNumber: string;
    editorActiveLineNumber: string;
    editorActiveLine: string;

    // UI colors (inherit from CSS variables but can be overridden)
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;

    // Syntax highlighting colors
    syntax: {
      comment: string;
      keyword: string;
      string: string;
      number: string;
      operator: string;
      function: string;
      variable: string;
      type: string;
      constant: string;
      tag: string;
      attribute: string;
    };
  };
}

export const EDITOR_THEMES: Record<string, EditorTheme> = {
  'light': {
    id: 'light',
    name: 'light',
    displayName: 'Light',
    description: 'Clean light theme for comfortable daytime coding',
    colors: {
      editorBackground: '#ffffff',
      editorForeground: '#24292f',
      editorSelection: '#0969da20',
      editorSelectionHighlight: '#0969da15',
      editorCursor: '#24292f',
      editorLineNumber: '#656d76',
      editorActiveLineNumber: '#24292f',
      editorActiveLine: '#f6f8fa',

      background: '#ffffff',
      foreground: '#24292f',
      muted: '#f6f8fa',
      mutedForeground: '#656d76',
      accent: '#f6f8fa',
      accentForeground: '#24292f',
      border: '#d1d9e0',

      syntax: {
        comment: '#6a737d',
        keyword: '#d73a49',
        string: '#032f62',
        number: '#005cc5',
        operator: '#d73a49',
        function: '#6f42c1',
        variable: '#24292f',
        type: '#005cc5',
        constant: '#005cc5',
        tag: '#22863a',
        attribute: '#6f42c1',
      },
    },
  },

  'dark': {
    id: 'dark',
    name: 'dark',
    displayName: 'Dark',
    description: 'Modern dark theme for comfortable nighttime coding',
    colors: {
      editorBackground: '#0d1117',
      editorForeground: '#e6edf3',
      editorSelection: '#1f6feb40',
      editorSelectionHighlight: '#1f6feb20',
      editorCursor: '#e6edf3',
      editorLineNumber: '#7d8590',
      editorActiveLineNumber: '#e6edf3',
      editorActiveLine: '#161b22',

      background: '#0d1117',
      foreground: '#e6edf3',
      muted: '#21262d',
      mutedForeground: '#7d8590',
      accent: '#21262d',
      accentForeground: '#e6edf3',
      border: '#30363d',

      syntax: {
        comment: '#7d8590',
        keyword: '#ff7b72',
        string: '#a5d6ff',
        number: '#79c0ff',
        operator: '#ff7b72',
        function: '#d2a8ff',
        variable: '#e6edf3',
        type: '#79c0ff',
        constant: '#79c0ff',
        tag: '#7ee787',
        attribute: '#d2a8ff',
      },
    },
  },

  'vscode-dark': {
    id: 'vscode-dark',
    name: 'vscode-dark',
    displayName: 'VS Code Dark',
    description: 'Popular VS Code dark theme with familiar colors',
    colors: {
      editorBackground: '#1e1e1e',
      editorForeground: '#d4d4d4',
      editorSelection: '#264f7840',
      editorSelectionHighlight: '#264f7820',
      editorCursor: '#d4d4d4',
      editorLineNumber: '#858585',
      editorActiveLineNumber: '#d4d4d4',
      editorActiveLine: '#2a2d2e',

      background: '#1e1e1e',
      foreground: '#d4d4d4',
      muted: '#2d2d30',
      mutedForeground: '#858585',
      accent: '#2d2d30',
      accentForeground: '#d4d4d4',
      border: '#3e3e42',

      syntax: {
        comment: '#6a9955',
        keyword: '#569cd6',
        string: '#ce9178',
        number: '#b5cea8',
        operator: '#d4d4d4',
        function: '#dcdcaa',
        variable: '#9cdcfe',
        type: '#4ec9b0',
        constant: '#4fc1ff',
        tag: '#92c5f8',
        attribute: '#9cdcfe',
      },
    },
  },

  'monokai': {
    id: 'monokai',
    name: 'monokai',
    displayName: 'Monokai',
    description: 'Classic Monokai theme with vibrant colors',
    colors: {
      editorBackground: '#272822',
      editorForeground: '#f8f8f2',
      editorSelection: '#49483e',
      editorSelectionHighlight: '#49483e80',
      editorCursor: '#f8f8f0',
      editorLineNumber: '#90908a',
      editorActiveLineNumber: '#f8f8f2',
      editorActiveLine: '#3e3d32',

      background: '#272822',
      foreground: '#f8f8f2',
      muted: '#3e3d32',
      mutedForeground: '#90908a',
      accent: '#3e3d32',
      accentForeground: '#f8f8f2',
      border: '#49483e',

      syntax: {
        comment: '#75715e',
        keyword: '#f92672',
        string: '#e6db74',
        number: '#ae81ff',
        operator: '#f92672',
        function: '#a6e22e',
        variable: '#f8f8f2',
        type: '#66d9ef',
        constant: '#ae81ff',
        tag: '#f92672',
        attribute: '#a6e22e',
      },
    },
  },

  'dracula': {
    id: 'dracula',
    name: 'dracula',
    displayName: 'Dracula',
    description: 'Popular dark theme with purple accents',
    colors: {
      editorBackground: '#282a36',
      editorForeground: '#f8f8f2',
      editorSelection: '#44475a',
      editorSelectionHighlight: '#44475a80',
      editorCursor: '#f8f8f0',
      editorLineNumber: '#6272a4',
      editorActiveLineNumber: '#f8f8f2',
      editorActiveLine: '#44475a',

      background: '#282a36',
      foreground: '#f8f8f2',
      muted: '#44475a',
      mutedForeground: '#6272a4',
      accent: '#44475a',
      accentForeground: '#f8f8f2',
      border: '#6272a4',

      syntax: {
        comment: '#6272a4',
        keyword: '#ff79c6',
        string: '#f1fa8c',
        number: '#bd93f9',
        operator: '#ff79c6',
        function: '#50fa7b',
        variable: '#f8f8f2',
        type: '#8be9fd',
        constant: '#bd93f9',
        tag: '#ff79c6',
        attribute: '#50fa7b',
      },
    },
  },

  // NEW THEMES START HERE

  'iron-man': {
    id: 'iron-man',
    name: 'iron-man',
    displayName: 'Iron Man',
    description: 'Arc reactor inspired theme with gold and red accents',
    colors: {
      editorBackground: '#0a0a0a',
      editorForeground: '#ffd700',
      editorSelection: '#dc143c40',
      editorSelectionHighlight: '#dc143c20',
      editorCursor: '#ffd700',
      editorLineNumber: '#8b4513',
      editorActiveLineNumber: '#ffd700',
      editorActiveLine: '#1a0000',

      background: '#0a0a0a',
      foreground: '#ffd700',
      muted: '#1a1a1a',
      mutedForeground: '#8b4513',
      accent: '#dc143c',
      accentForeground: '#ffd700',
      border: '#dc143c',

      syntax: {
        comment: '#8b4513',
        keyword: '#dc143c',
        string: '#ffa500',
        number: '#00bfff',
        operator: '#dc143c',
        function: '#ffd700',
        variable: '#fff8dc',
        type: '#00bfff',
        constant: '#ff6347',
        tag: '#dc143c',
        attribute: '#ffd700',
      },
    },
  },

  'captain-america': {
    id: 'captain-america',
    name: 'captain-america',
    displayName: 'Captain America',
    description: 'Stars and stripes theme with patriotic colors',
    colors: {
      editorBackground: '#0f1b3c',
      editorForeground: '#ffffff',
      editorSelection: '#b22234aa',
      editorSelectionHighlight: '#b2223440',
      editorCursor: '#ffffff',
      editorLineNumber: '#6b7db3',
      editorActiveLineNumber: '#ffffff',
      editorActiveLine: '#1e2a4a',

      background: '#0f1b3c',
      foreground: '#ffffff',
      muted: '#1e2a4a',
      mutedForeground: '#6b7db3',
      accent: '#b22234',
      accentForeground: '#ffffff',
      border: '#b22234',

      syntax: {
        comment: '#6b7db3',
        keyword: '#b22234',
        string: '#ffffff',
        number: '#4169e1',
        operator: '#b22234',
        function: '#87ceeb',
        variable: '#f0f8ff',
        type: '#4169e1',
        constant: '#dc143c',
        tag: '#b22234',
        attribute: '#87ceeb',
      },
    },
  },

  'hulk': {
    id: 'hulk',
    name: 'hulk',
    displayName: 'Hulk Smash',
    description: 'Gamma radiation green theme with purple accents',
    colors: {
      editorBackground: '#0d1b0d',
      editorForeground: '#00ff00',
      editorSelection: '#9932cc40',
      editorSelectionHighlight: '#9932cc20',
      editorCursor: '#00ff00',
      editorLineNumber: '#228b22',
      editorActiveLineNumber: '#00ff00',
      editorActiveLine: '#1a2e1a',

      background: '#0d1b0d',
      foreground: '#00ff00',
      muted: '#1a2e1a',
      mutedForeground: '#228b22',
      accent: '#9932cc',
      accentForeground: '#00ff00',
      border: '#32cd32',

      syntax: {
        comment: '#228b22',
        keyword: '#9932cc',
        string: '#adff2f',
        number: '#00bfff',
        operator: '#9932cc',
        function: '#32cd32',
        variable: '#98fb98',
        type: '#00bfff',
        constant: '#ff69b4',
        tag: '#9932cc',
        attribute: '#32cd32',
      },
    },
  },

  'spider-man': {
    id: 'spider-man',
    name: 'spider-man',
    displayName: 'Spider-Man',
    description: 'Web-slinging theme with classic red and blue colors',
    colors: {
      editorBackground: '#0a0a1a',
      editorForeground: '#ff3333',
      editorSelection: '#1e3a8a40',
      editorSelectionHighlight: '#1e3a8a20',
      editorCursor: '#ff3333',
      editorLineNumber: '#6b7280',
      editorActiveLineNumber: '#ff3333',
      editorActiveLine: '#1a1a2e',

      background: '#0a0a1a',
      foreground: '#ff3333',
      muted: '#1a1a2e',
      mutedForeground: '#6b7280',
      accent: '#1e3a8a',
      accentForeground: '#ffffff',
      border: '#dc2626',

      syntax: {
        comment: '#6b7280',
        keyword: '#1e3a8a',
        string: '#fbbf24',
        number: '#60a5fa',
        operator: '#dc2626',
        function: '#ef4444',
        variable: '#f3f4f6',
        type: '#3b82f6',
        constant: '#1d4ed8',
        tag: '#dc2626',
        attribute: '#ef4444',
      },
    },
  },

  'matrix': {
    id: 'matrix',
    name: 'matrix',
    displayName: 'Matrix',
    description: 'Digital rain theme inspired by The Matrix',
    colors: {
      editorBackground: '#000000',
      editorForeground: '#00ff41',
      editorSelection: '#003300aa',
      editorSelectionHighlight: '#00330040',
      editorCursor: '#00ff41',
      editorLineNumber: '#008000',
      editorActiveLineNumber: '#00ff41',
      editorActiveLine: '#001100',

      background: '#000000',
      foreground: '#00ff41',
      muted: '#001100',
      mutedForeground: '#008000',
      accent: '#003300',
      accentForeground: '#00ff41',
      border: '#008000',

      syntax: {
        comment: '#008000',
        keyword: '#00ff00',
        string: '#32cd32',
        number: '#00ff41',
        operator: '#00ff00',
        function: '#90ee90',
        variable: '#98fb98',
        type: '#00ff41',
        constant: '#00ff00',
        tag: '#00ff00',
        attribute: '#90ee90',
      },
    },
  },

  'neon-nights': {
    id: 'neon-nights',
    name: 'neon-nights',
    displayName: 'Neon Nights',
    description: 'Cyberpunk-inspired theme with vibrant neon colors',
    colors: {
      editorBackground: '#0a0a0a',
      editorForeground: '#ff00ff',
      editorSelection: '#00ffff40',
      editorSelectionHighlight: '#00ffff20',
      editorCursor: '#ff00ff',
      editorLineNumber: '#8a2be2',
      editorActiveLineNumber: '#ff00ff',
      editorActiveLine: '#1a0a1a',

      background: '#0a0a0a',
      foreground: '#ff00ff',
      muted: '#1a0a1a',
      mutedForeground: '#8a2be2',
      accent: '#00ffff',
      accentForeground: '#000000',
      border: '#ff00ff',

      syntax: {
        comment: '#8a2be2',
        keyword: '#ff1493',
        string: '#00ffff',
        number: '#ff69b4',
        operator: '#ff1493',
        function: '#ffd700',
        variable: '#dda0dd',
        type: '#00ff7f',
        constant: '#ff6347',
        tag: '#ff1493',
        attribute: '#ffd700',
      },
    },
  },

  'ocean-deep': {
    id: 'ocean-deep',
    name: 'ocean-deep',
    displayName: 'Ocean Deep',
    description: 'Deep sea theme with blues and aqua tones',
    colors: {
      editorBackground: '#001122',
      editorForeground: '#87ceeb',
      editorSelection: '#4682b440',
      editorSelectionHighlight: '#4682b420',
      editorCursor: '#87ceeb',
      editorLineNumber: '#4682b4',
      editorActiveLineNumber: '#87ceeb',
      editorActiveLine: '#002244',

      background: '#001122',
      foreground: '#87ceeb',
      muted: '#002244',
      mutedForeground: '#4682b4',
      accent: '#00bfff',
      accentForeground: '#ffffff',
      border: '#4682b4',

      syntax: {
        comment: '#4682b4',
        keyword: '#00bfff',
        string: '#87ceeb',
        number: '#40e0d0',
        operator: '#00bfff',
        function: '#20b2aa',
        variable: '#b0e0e6',
        type: '#40e0d0',
        constant: '#00ced1',
        tag: '#00bfff',
        attribute: '#20b2aa',
      },
    },
  },



  'midnight-purple': {
    id: 'midnight-purple',
    name: 'midnight-purple',
    displayName: 'Midnight Purple',
    description: 'Elegant dark theme with rich purple tones',
    colors: {
      editorBackground: '#1a0d26',
      editorForeground: '#dda0dd',
      editorSelection: '#9370db40',
      editorSelectionHighlight: '#9370db20',
      editorCursor: '#dda0dd',
      editorLineNumber: '#8a2be2',
      editorActiveLineNumber: '#dda0dd',
      editorActiveLine: '#2a1a36',

      background: '#1a0d26',
      foreground: '#dda0dd',
      muted: '#2a1a36',
      mutedForeground: '#8a2be2',
      accent: '#9370db',
      accentForeground: '#ffffff',
      border: '#8a2be2',

      syntax: {
        comment: '#8a2be2',
        keyword: '#9370db',
        string: '#ba55d3',
        number: '#da70d6',
        operator: '#9370db',
        function: '#dda0dd',
        variable: '#e6e6fa',
        type: '#da70d6',
        constant: '#ff69b4',
        tag: '#9370db',
        attribute: '#dda0dd',
      },
    },
  },

  'forest-green': {
    id: 'forest-green',
    name: 'forest-green',
    displayName: 'Forest Green',
    description: 'Natural forest theme with earthy green tones',
    colors: {
      editorBackground: '#0d1f0d',
      editorForeground: '#90ee90',
      editorSelection: '#32cd3240',
      editorSelectionHighlight: '#32cd3220',
      editorCursor: '#90ee90',
      editorLineNumber: '#228b22',
      editorActiveLineNumber: '#90ee90',
      editorActiveLine: '#1a331a',

      background: '#0d1f0d',
      foreground: '#90ee90',
      muted: '#1a331a',
      mutedForeground: '#228b22',
      accent: '#32cd32',
      accentForeground: '#ffffff',
      border: '#228b22',

      syntax: {
        comment: '#228b22',
        keyword: '#32cd32',
        string: '#98fb98',
        number: '#00ff7f',
        operator: '#32cd32',
        function: '#adff2f',
        variable: '#f0fff0',
        type: '#00ff7f',
        constant: '#00fa9a',
        tag: '#32cd32',
        attribute: '#adff2f',
      },
    },
  },

  // DEMON SLAYER THEMES

  'tanjiro': {
    id: 'tanjiro',
    name: 'tanjiro',
    displayName: 'Tanjiro Kamado',
    description: 'Water breathing theme with dark green and black checkered pattern vibes',
    colors: {
      editorBackground: '#0f1419',
      editorForeground: '#2dd4bf',
      editorSelection: '#15803d40',
      editorSelectionHighlight: '#15803d20',
      editorCursor: '#2dd4bf',
      editorLineNumber: '#6b7280',
      editorActiveLineNumber: '#2dd4bf',
      editorActiveLine: '#1f2937',

      background: '#0f1419',
      foreground: '#2dd4bf',
      muted: '#1f2937',
      mutedForeground: '#6b7280',
      accent: '#15803d',
      accentForeground: '#ffffff',
      border: '#374151',

      syntax: {
        comment: '#6b7280',
        keyword: '#dc2626',
        string: '#0ea5e9',
        number: '#06b6d4',
        operator: '#dc2626',
        function: '#10b981',
        variable: '#e5e7eb',
        type: '#0ea5e9',
        constant: '#f59e0b',
        tag: '#dc2626',
        attribute: '#10b981',
      },
    },
  },

  'rengoku': {
    id: 'rengoku',
    name: 'rengoku',
    displayName: 'Kyojuro Rengoku',
    description: 'Flame breathing theme with fiery oranges, reds, and yellows',
    colors: {
      editorBackground: '#1a0f0a',
      editorForeground: '#fbbf24',
      editorSelection: '#ea580c40',
      editorSelectionHighlight: '#ea580c20',
      editorCursor: '#fbbf24',
      editorLineNumber: '#d97706',
      editorActiveLineNumber: '#fbbf24',
      editorActiveLine: '#2d1b0f',

      background: '#1a0f0a',
      foreground: '#fbbf24',
      muted: '#2d1b0f',
      mutedForeground: '#d97706',
      accent: '#ea580c',
      accentForeground: '#ffffff',
      border: '#dc2626',

      syntax: {
        comment: '#d97706',
        keyword: '#dc2626',
        string: '#f59e0b',
        number: '#fb923c',
        operator: '#dc2626',
        function: '#fbbf24',
        variable: '#fef3c7',
        type: '#f97316',
        constant: '#ef4444',
        tag: '#dc2626',
        attribute: '#fbbf24',
      },
    },
  },

  'zenitsu': {
    id: 'zenitsu',
    name: 'zenitsu',
    displayName: 'Zenitsu Agatsuma',
    description: 'Thunder breathing theme with electric yellows and lightning blues',
    colors: {
      editorBackground: '#0f0f1a',
      editorForeground: '#facc15',
      editorSelection: '#1e40af40',
      editorSelectionHighlight: '#1e40af20',
      editorCursor: '#facc15',
      editorLineNumber: '#a855f7',
      editorActiveLineNumber: '#facc15',
      editorActiveLine: '#1e1b3a',

      background: '#0f0f1a',
      foreground: '#facc15',
      muted: '#1e1b3a',
      mutedForeground: '#a855f7',
      accent: '#1e40af',
      accentForeground: '#ffffff',
      border: '#eab308',

      syntax: {
        comment: '#a855f7',
        keyword: '#3b82f6',
        string: '#fde047',
        number: '#60a5fa',
        operator: '#3b82f6',
        function: '#facc15',
        variable: '#fefce8',
        type: '#8b5cf6',
        constant: '#2563eb',
        tag: '#3b82f6',
        attribute: '#facc15',
      },
    },
  },

  'tengen': {
    id: 'tengen',
    name: 'tengen',
    displayName: 'Tengen Uzui',
    description: 'Sound breathing theme with flashy magenta, cyan, and gold colors',
    colors: {
      editorBackground: '#1a0a1a',
      editorForeground: '#f0abfc',
      editorSelection: '#be185d40',
      editorSelectionHighlight: '#be185d20',
      editorCursor: '#f0abfc',
      editorLineNumber: '#8b5cf6',
      editorActiveLineNumber: '#f0abfc',
      editorActiveLine: '#2d1a2d',

      background: '#1a0a1a',
      foreground: '#f0abfc',
      muted: '#2d1a2d',
      mutedForeground: '#8b5cf6',
      accent: '#be185d',
      accentForeground: '#ffffff',
      border: '#ec4899',

      syntax: {
        comment: '#8b5cf6',
        keyword: '#ec4899',
        string: '#06d6a0',
        number: '#22d3ee',
        operator: '#ec4899',
        function: '#fbbf24',
        variable: '#fdf4ff',
        type: '#06d6a0',
        constant: '#f59e0b',
        tag: '#ec4899',
        attribute: '#fbbf24',
      },
    },
  },
};
export const THEME_NAMES = Object.keys(EDITOR_THEMES);

export function getTheme(themeId: string): EditorTheme {
  return EDITOR_THEMES[themeId] || EDITOR_THEMES.dark;
}

export function getThemeList(): EditorTheme[] {
  return Object.values(EDITOR_THEMES);
}
