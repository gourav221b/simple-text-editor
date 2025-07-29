# 🎨 Example: Adding a New Theme

Here's a complete example of adding a new "Cyberpunk 2077" theme:

## Step 1: Add to `lib/themes.ts`

Add this to the `EDITOR_THEMES` object:

```typescript
'cyberpunk-2077': {
  id: 'cyberpunk-2077',
  name: 'cyberpunk-2077',
  displayName: 'Cyberpunk 2077',
  description: 'Neon-soaked Night City theme with electric blues and hot pinks',
  colors: {
    // Editor specific colors
    editorBackground: '#0a0a0f',
    editorForeground: '#00ffff',
    editorSelection: '#ff007740',
    editorSelectionHighlight: '#ff007720',
    editorCursor: '#00ffff',
    editorLineNumber: '#666699',
    editorActiveLineNumber: '#00ffff',
    editorActiveLine: '#1a1a2e',

    // UI colors (required for CSS generation)
    background: '#0a0a0f',
    foreground: '#00ffff',
    muted: '#1a1a2e',
    mutedForeground: '#666699',
    accent: '#ff0077',
    accentForeground: '#ffffff',
    border: '#333366',

    // Syntax highlighting colors
    syntax: {
      comment: '#666699',
      keyword: '#ff0077',
      string: '#00ff88',
      number: '#ffff00',
      operator: '#ff0077',
      function: '#00ffff',
      variable: '#e0e0ff',
      type: '#ff6600',
      constant: '#ff0077',
      tag: '#ff0077',
      attribute: '#00ffff',
    },
  },
},
```

## Step 2: Run the Generator

```bash
pnpm run generate-themes
```

## Step 3: Test Your Theme

1. Start the dev server: `pnpm dev`
2. Open the editor
3. Click the gear icon (⚙️)
4. Select "Cyberpunk 2077" from the theme dropdown
5. Enjoy your new theme!

## What Gets Generated

### CSS in `app/globals.css`:
```css
/* Cyberpunk 2077 Theme */
.cyberpunk-2077 {
  --background: #0a0a0f;
  --foreground: #00ffff;
  --card: #1a1a2e;
  --card-foreground: #00ffff;
  --popover: #1a1a2e;
  --popover-foreground: #00ffff;
  --primary: #ff0077;
  --primary-foreground: #ffffff;
  --secondary: #333366;
  --secondary-foreground: #00ffff;
  --muted: #1a1a2e;
  --muted-foreground: #666699;
  --accent: #ff0077;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #333366;
  --input: #1a1a2e;
  --ring: #ff0077;
  --sidebar-background: #0a0a0f;
  --sidebar-foreground: #00ffff;
  --sidebar-primary: #ff0077;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #333366;
  --sidebar-accent-foreground: #00ffff;
  --sidebar-border: #333366;
  --sidebar-ring: #ff0077;
}
```

### Updated Arrays in `app/config-provider.tsx`:
```typescript
const themeClasses = ['vscode-dark', 'iron-man', 'captain-america', 'hulk', 'spider-man', 'neon-nights', 'ocean-deep', 'sunset-vibes', 'midnight-purple', 'forest-green', 'tanjiro', 'rengoku', 'zenitsu', 'tengen', 'cyberpunk-2077'];
```

That's it! Your theme is now fully functional and will appear in the theme selector.

## 🎯 Pro Tips

1. **Use consistent naming**: Use kebab-case for theme IDs
2. **Test contrast**: Ensure text is readable on backgrounds
3. **Consider accessibility**: Use sufficient color contrast ratios
4. **Theme families**: Create variations of popular themes
5. **Color harmony**: Use color theory for pleasing combinations

## 🌈 Theme Ideas

- **Retro Wave**: Purple/pink synthwave aesthetic
- **Terminal Green**: Classic green-on-black terminal
- **Warm Coffee**: Brown/beige cozy coding theme
- **Arctic Blue**: Cool blues and whites
- **Sunset Orange**: Warm oranges and reds
- **Deep Ocean**: Dark blues and teals
- **Forest Night**: Dark greens and browns
