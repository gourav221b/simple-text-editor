#!/usr/bin/env node

/**
 * Theme Generator Script
 * 
 * This script automatically generates:
 * 1. CSS classes in app/globals.css
 * 2. Updates theme class arrays in app/config-provider.tsx
 * 
 * Usage: node scripts/generate-themes.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const THEMES_FILE = path.join(__dirname, '../lib/themes.ts');
const GLOBALS_CSS_FILE = path.join(__dirname, '../app/globals.css');
const CONFIG_PROVIDER_FILE = path.join(__dirname, '../app/config-provider.tsx');

// Extract themes from themes.ts file
function extractThemes() {
  console.log('📖 Reading themes from lib/themes.ts...');

  const themesContent = fs.readFileSync(THEMES_FILE, 'utf8');

  // Extract theme IDs using regex
  const themeMatches = themesContent.match(/'([^']+)':\s*{[^}]*id:\s*'([^']+)'/g);

  if (!themeMatches) {
    console.error('❌ No themes found in themes.ts');
    process.exit(1);
  }

  const themes = themeMatches.map(match => {
    const [, themeId] = match.match(/'([^']+)':/);
    return themeId;
  });

  console.log(`✅ Found ${themes.length} themes:`, themes.join(', '));
  return themes;
}

// Extract theme details for CSS generation
function extractThemeDetails() {
  console.log('🎨 Extracting theme details for CSS generation...');

  const themesContent = fs.readFileSync(THEMES_FILE, 'utf8');

  // Extract the EDITOR_THEMES object
  const editorThemesMatch = themesContent.match(/export const EDITOR_THEMES[\s\S]*?= {([\s\S]*?)};/);

  if (!editorThemesMatch) {
    console.error('❌ Could not find EDITOR_THEMES object');
    process.exit(1);
  }

  const themesObjectContent = editorThemesMatch[1];

  // Extract individual theme objects
  const themeRegex = /'([^']+)':\s*{[\s\S]*?colors:\s*{([\s\S]*?)syntax:/g;
  const themes = [];
  let match;

  while ((match = themeRegex.exec(themesObjectContent)) !== null) {
    const [, id, colorsContent] = match;

    // Extract color values
    const extractColor = (colorName) => {
      const colorMatch = colorsContent.match(new RegExp(`${colorName}:\\s*'([^']+)'`));
      return colorMatch ? colorMatch[1] : '#000000';
    };

    themes.push({
      id,
      background: extractColor('background'),
      foreground: extractColor('foreground'),
      muted: extractColor('muted'),
      mutedForeground: extractColor('mutedForeground'),
      accent: extractColor('accent'),
      accentForeground: extractColor('accentForeground'),
      border: extractColor('border')
    });
  }

  console.log(`✅ Extracted details for ${themes.length} themes`);
  return themes;
}

// Generate CSS class for a theme
function generateThemeCSS(theme) {
  const { id, background, foreground, muted, mutedForeground, accent, accentForeground, border } = theme;

  // Convert theme name to display name
  const displayName = id.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return `  /* ${displayName} Theme */
  .${id} {
    --background: ${background};
    --foreground: ${foreground};
    --card: ${muted};
    --card-foreground: ${foreground};
    --popover: ${muted};
    --popover-foreground: ${foreground};
    --primary: ${accent};
    --primary-foreground: ${accentForeground};
    --secondary: ${border};
    --secondary-foreground: ${foreground};
    --muted: ${muted};
    --muted-foreground: ${mutedForeground};
    --accent: ${accent};
    --accent-foreground: ${accentForeground};
    --destructive: #ef4444;
    --destructive-foreground: #ffffff;
    --border: ${border};
    --input: ${muted};
    --ring: ${accent};
    --sidebar-background: ${background};
    --sidebar-foreground: ${foreground};
    --sidebar-primary: ${accent};
    --sidebar-primary-foreground: ${accentForeground};
    --sidebar-accent: ${border};
    --sidebar-accent-foreground: ${foreground};
    --sidebar-border: ${border};
    --sidebar-ring: ${accent};
  }`;
}

// Update globals.css with theme classes
function updateGlobalsCSS(themes) {
  console.log('🎨 Updating app/globals.css...');

  let cssContent = fs.readFileSync(GLOBALS_CSS_FILE, 'utf8');

  // Find the insertion point (before .editor textarea)
  const insertionPoint = cssContent.indexOf('  .editor textarea {');

  if (insertionPoint === -1) {
    console.error('❌ Could not find insertion point in globals.css');
    process.exit(1);
  }

  // Remove existing auto-generated theme classes
  const startMarker = '  /* AUTO-GENERATED THEMES - START */';
  const endMarker = '  /* AUTO-GENERATED THEMES - END */';

  const startIndex = cssContent.indexOf(startMarker);
  const endIndex = cssContent.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    // Remove existing auto-generated section
    cssContent = cssContent.substring(0, startIndex) + cssContent.substring(endIndex + endMarker.length);
  }

  // Generate new theme CSS
  const themeCSS = themes.map(generateThemeCSS).join('\n\n');

  // Insert new theme classes
  const newInsertionPoint = cssContent.indexOf('  .editor textarea {');
  const newContent =
    cssContent.substring(0, newInsertionPoint) +
    `${startMarker}\n${themeCSS}\n\n${endMarker}\n\n  ` +
    cssContent.substring(newInsertionPoint);

  fs.writeFileSync(GLOBALS_CSS_FILE, newContent);
  console.log(`✅ Added ${themes.length} theme classes to globals.css`);
}

// Update config-provider.tsx with theme names
function updateConfigProvider(themeNames) {
  console.log('⚙️ Updating app/config-provider.tsx...');

  let configContent = fs.readFileSync(CONFIG_PROVIDER_FILE, 'utf8');

  // Create theme array string
  const themeArrayString = `['${themeNames.join("', '")}']`;

  // Update both theme class arrays
  const themeClassRegex = /const themeClasses = \[[\s\S]*?\];/g;

  let matchCount = 0;
  configContent = configContent.replace(themeClassRegex, (match) => {
    matchCount++;
    return `const themeClasses = ${themeArrayString};`;
  });

  if (matchCount !== 2) {
    console.warn(`⚠️ Expected to update 2 theme class arrays, but updated ${matchCount}`);
  }

  fs.writeFileSync(CONFIG_PROVIDER_FILE, configContent);
  console.log(`✅ Updated theme class arrays in config-provider.tsx`);
}

// Main function
function main() {
  console.log('🚀 Starting theme generation...\n');

  try {
    // Extract theme names
    const themeNames = extractThemes();

    // Extract theme details for CSS
    const themeDetails = extractThemeDetails();

    // Update CSS file
    updateGlobalsCSS(themeDetails);

    // Update config provider
    updateConfigProvider(themeNames);

    console.log('\n🎉 Theme generation completed successfully!');
    console.log(`📊 Generated ${themeNames.length} themes:`);
    themeNames.forEach(theme => console.log(`   • ${theme}`));
    console.log('\n💡 Your themes are now ready to use!');

  } catch (error) {
    console.error('❌ Error during theme generation:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, extractThemes, updateGlobalsCSS, updateConfigProvider };
