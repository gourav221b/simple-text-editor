# Editor Theme System

This document describes the comprehensive theme system implemented for the Simple Text Editor.

## Overview

The theme system provides a unified interface for managing multiple editor themes, including popular coding themes like VS Code Dark, GitHub Light, Monokai, and Dracula. Each theme includes complete color schemes for both the editor and UI components.

## Architecture

### Core Components

1. **Theme Interface** (`lib/themes.ts`)
   - Defines the `EditorTheme` interface with comprehensive color schemes
   - Includes editor-specific colors, UI colors, and syntax highlighting colors
   - Provides theme management functions

2. **Theme Hook** (`hooks/use-editor-theme.ts`)
   - Custom React hook for theme management
   - Provides theme application utilities
   - Handles CSS custom property injection

3. **Theme Components**
   - `ThemePreview.tsx`: Visual theme preview with code samples
   - `ThemeSelector.tsx`: Enhanced theme selection dialog
   - Updated `EditorConfigMenu.tsx`: Integrated theme selection

### Available Themes

1. **Light** - Clean light theme for daytime coding
2. **Dark** - Modern dark theme for nighttime coding
3. **VS Code Dark** - Popular VS Code dark theme
4. **Monokai** - Classic Monokai theme with vibrant colors
5. **GitHub Light** - Clean GitHub-inspired light theme
6. **Dracula** - Popular dark theme with purple accents

## Usage

### Selecting Themes

Users can select themes through two methods:

1. **Quick Selection**: Use the dropdown in the Editor Config Menu
2. **Theme Browser**: Click "Browse All Themes" to open the theme selector dialog with previews

### Theme Structure

Each theme includes:

```typescript
interface EditorTheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: {
    // Editor specific colors
    editorBackground: string;
    editorForeground: string;
    editorSelection: string;
    // ... more editor colors
    
    // UI colors
    background: string;
    foreground: string;
    // ... more UI colors
    
    // Syntax highlighting
    syntax: {
      comment: string;
      keyword: string;
      string: string;
      // ... more syntax colors
    };
  };
}
```

### Adding New Themes

To add a new theme:

1. Add the theme definition to `EDITOR_THEMES` in `lib/themes.ts`
2. Add corresponding CSS classes in `app/globals.css`
3. The theme will automatically appear in the theme selector

### CSS Integration

Themes are integrated through:

1. **CSS Custom Properties**: Each theme defines CSS variables
2. **Dynamic Styling**: React components apply theme styles dynamically
3. **UI Synchronization**: UI theme automatically matches editor theme

## Implementation Details

### Theme Application

The theme system applies colors through multiple methods:

1. **CSS Custom Properties**: For consistent styling across components
2. **Inline Styles**: For dynamic theme switching
3. **CSS Classes**: For theme-specific styling

### Performance Considerations

- Themes are loaded once and cached
- CSS custom properties provide efficient theme switching
- Minimal re-renders when switching themes

### Accessibility

- High contrast ratios maintained across all themes
- Color combinations tested for readability
- Consistent visual hierarchy preserved

## Future Enhancements

Potential improvements:

1. **Custom Theme Creation**: Allow users to create custom themes
2. **Theme Import/Export**: Save and share theme configurations
3. **Syntax Highlighting**: Enhanced syntax highlighting with theme colors
4. **Theme Scheduling**: Automatic theme switching based on time
5. **More Themes**: Additional popular coding themes

## Technical Notes

- Themes are type-safe with TypeScript interfaces
- CSS variables provide consistent theming
- React Context manages theme state
- Local storage persists theme preferences
- UI theme automatically syncs with editor theme
