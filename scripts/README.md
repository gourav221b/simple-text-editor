# 🎨 Theme Generator

This script automatically generates CSS classes and updates configuration files based on themes defined in `lib/themes.ts`.

## 🚀 Quick Start

### Method 1: Using npm script (Recommended)
```bash
pnpm run generate-themes
```

### Method 2: Direct execution
```bash
node scripts/generate-themes.js
```

## 📝 How It Works

The script automatically:

1. **Reads** all themes from `lib/themes.ts`
2. **Generates** CSS classes in `app/globals.css`
3. **Updates** theme arrays in `app/config-provider.tsx`
4. **Preserves** existing code structure

## 🎯 Adding New Themes

### Step 1: Add Theme to `lib/themes.ts`

Simply add your new theme to the `EDITOR_THEMES` object:

```typescript
export const EDITOR_THEMES: Record<string, EditorTheme> = {
  // ... existing themes ...
  
  'my-awesome-theme': {
    id: 'my-awesome-theme',
    name: 'my-awesome-theme',
    displayName: 'My Awesome Theme',
    description: 'A really cool theme',
    colors: {
      // Required colors for CSS generation
      background: '#1a1a1a',
      foreground: '#ffffff',
      muted: '#2a2a2a',
      mutedForeground: '#888888',
      accent: '#0066cc',
      accentForeground: '#ffffff',
      border: '#333333',
      
      // Editor specific colors
      editorBackground: '#1a1a1a',
      editorForeground: '#ffffff',
      // ... other editor colors
      
      syntax: {
        // ... syntax highlighting colors
      },
    },
  },
};
```

### Step 2: Run the Generator

```bash
pnpm run generate-themes
```

That's it! Your theme is now fully functional.

## 🔧 What Gets Generated

### CSS Classes in `app/globals.css`
```css
/* AUTO-GENERATED THEMES - START */
/* My Awesome Theme */
.my-awesome-theme {
  --background: #1a1a1a;
  --foreground: #ffffff;
  --card: #2a2a2a;
  /* ... all CSS variables */
}
/* AUTO-GENERATED THEMES - END */
```

### Updated Arrays in `app/config-provider.tsx`
```typescript
const themeClasses = ['light', 'dark', 'my-awesome-theme', /* ... */];
```

## 🛡️ Safety Features

- **Preserves existing code** - Only updates auto-generated sections
- **Backup-friendly** - Uses clear markers for generated content
- **Error handling** - Validates files and provides helpful error messages
- **Non-destructive** - Won't break your existing themes

## 📊 Output Example

```
🚀 Starting theme generation...

📖 Reading themes from lib/themes.ts...
✅ Found 19 themes: light, dark, vscode-dark, monokai, dracula, iron-man, captain-america, hulk, spider-man, matrix, neon-nights, ocean-deep, sunset-vibes, midnight-purple, forest-green, tanjiro, rengoku, zenitsu, tengen

🎨 Extracting theme details for CSS generation...
✅ Extracted details for 19 themes

🎨 Updating app/globals.css...
✅ Added 19 theme classes to globals.css

⚙️ Updating app/config-provider.tsx...
✅ Updated theme class arrays in config-provider.tsx

🎉 Theme generation completed successfully!
📊 Generated 19 themes:
   • light
   • dark
   • vscode-dark
   • monokai
   • dracula
   • iron-man
   • captain-america
   • hulk
   • spider-man
   • matrix
   • neon-nights
   • ocean-deep
   • sunset-vibes
   • midnight-purple
   • forest-green
   • tanjiro
   • rengoku
   • zenitsu
   • tengen

💡 Your themes are now ready to use!
```

## 🎨 Theme Requirements

For the generator to work properly, each theme must have these colors defined:

- `background` - Main background color
- `foreground` - Main text color  
- `muted` - Muted background color
- `mutedForeground` - Muted text color
- `accent` - Accent/primary color
- `accentForeground` - Accent text color
- `border` - Border color

## 🔄 Workflow

1. Add themes to `lib/themes.ts`
2. Run `pnpm run generate-themes`
3. Test your themes in the editor
4. Commit your changes

## 🐛 Troubleshooting

**Theme not appearing?**
- Check that the theme is properly formatted in `lib/themes.ts`
- Ensure all required colors are defined
- Run the generator again

**CSS not applying?**
- Restart your dev server after running the generator
- Check browser console for any CSS errors

**Generator failing?**
- Ensure `lib/themes.ts` has the correct `EDITOR_THEMES` export
- Check that file paths are correct
- Verify Node.js is installed

## 🎉 Benefits

- **Zero manual work** - Just add themes and run the script
- **Consistent structure** - All themes follow the same pattern
- **Error-free** - No typos in theme names or CSS
- **Fast iteration** - Add multiple themes quickly
- **Maintainable** - Easy to update all themes at once
