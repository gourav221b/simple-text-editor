// Built-in file templates
export const BUILT_IN_TEMPLATES = [
  {
    name: "HTML Document",
    fileExtension: ".html",
    description: "Basic HTML5 document structure",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Welcome to your new HTML document!</p>
</body>
</html>`,
    isBuiltIn: true,
  },
  {
    name: "React Component",
    fileExtension: ".tsx",
    description: "React functional component with TypeScript",
    content: `import React from 'react';

interface {{COMPONENT_NAME}}Props {
  // Add your props here
}

const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = () => {
  return (
    <div>
      <h1>{{COMPONENT_NAME}}</h1>
      <p>Your component content goes here</p>
    </div>
  );
};

export default {{COMPONENT_NAME}};`,
    isBuiltIn: true,
  },
  {
    name: "JavaScript Module",
    fileExtension: ".js",
    description: "ES6 JavaScript module",
    content: `/**
 * {{DESCRIPTION}}
 * @author {{AUTHOR}}
 * @date {{DATE}}
 */

// Your code here
export default function {{FUNCTION_NAME}}() {
  console.log('Hello from {{FUNCTION_NAME}}!');
}

// Named exports
export const utils = {
  // Add utility functions here
};`,
    isBuiltIn: true,
  },
  {
    name: "TypeScript Interface",
    fileExtension: ".ts",
    description: "TypeScript interface definition",
    content: `/**
 * {{DESCRIPTION}}
 * @author {{AUTHOR}}
 * @date {{DATE}}
 */

export interface {{INTERFACE_NAME}} {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add more properties here
}

export type {{INTERFACE_NAME}}Input = Omit<{{INTERFACE_NAME}}, 'id' | 'createdAt' | 'updatedAt'>;

export type {{INTERFACE_NAME}}Update = Partial<{{INTERFACE_NAME}}Input>;`,
    isBuiltIn: true,
  },
  {
    name: "CSS Stylesheet",
    fileExtension: ".css",
    description: "CSS stylesheet with common patterns",
    content: `/**
 * {{TITLE}} Stylesheet
 * @author {{AUTHOR}}
 * @date {{DATE}}
 */

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center {
  text-align: center;
}

.hidden {
  display: none;
}

/* Your custom styles here */`,
    isBuiltIn: true,
  },
  {
    name: "Python Script",
    fileExtension: ".py",
    description: "Python script template",
    content: `#!/usr/bin/env python3
"""
{{DESCRIPTION}}

Author: {{AUTHOR}}
Date: {{DATE}}
"""

import sys
import os
from typing import List, Dict, Optional


def main() -> None:
    """Main function."""
    print("Hello from {{SCRIPT_NAME}}!")
    
    # Your code here
    pass


if __name__ == "__main__":
    main()`,
    isBuiltIn: true,
  },
  {
    name: "Markdown Document",
    fileExtension: ".md",
    description: "Markdown document template",
    content: `# {{TITLE}}

> {{DESCRIPTION}}

**Author:** {{AUTHOR}}  
**Date:** {{DATE}}

## Overview

Brief description of the document content.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)

## Getting Started

Instructions for getting started.

## Usage

Examples and usage instructions.

\`\`\`javascript
// Code example
console.log('Hello World!');
\`\`\`

## Contributing

Guidelines for contributing to this project.

---

*Last updated: {{DATE}}*`,
    isBuiltIn: true,
  },
  {
    name: "JSON Configuration",
    fileExtension: ".json",
    description: "JSON configuration file",
    content: `{
  "name": "{{PROJECT_NAME}}",
  "version": "1.0.0",
  "description": "{{DESCRIPTION}}",
  "author": "{{AUTHOR}}",
  "license": "MIT",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {},
  "devDependencies": {},
  "keywords": [],
  "repository": {
    "type": "git",
    "url": ""
  }
}`,
    isBuiltIn: true,
  },
  {
    name: "README Template",
    fileExtension: ".md",
    description: "Project README template",
    content: `# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/{{AUTHOR}}/{{PROJECT_NAME}}.git

# Navigate to project directory
cd {{PROJECT_NAME}}

# Install dependencies
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## API Reference

### Endpoints

- \`GET /api/endpoint\` - Description
- \`POST /api/endpoint\` - Description

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

{{AUTHOR}} - [email@example.com](mailto:email@example.com)

Project Link: [https://github.com/{{AUTHOR}}/{{PROJECT_NAME}}](https://github.com/{{AUTHOR}}/{{PROJECT_NAME}})`,
    isBuiltIn: true,
  },
];

// Template variable replacements
export function processTemplate(content: string, variables: Record<string, string> = {}): string {
  let processedContent = content;
  
  // Default variables
  const defaultVariables = {
    DATE: new Date().toLocaleDateString(),
    DATETIME: new Date().toLocaleString(),
    YEAR: new Date().getFullYear().toString(),
    AUTHOR: 'Your Name',
    TITLE: 'Untitled',
    DESCRIPTION: 'Add description here',
    PROJECT_NAME: 'my-project',
    COMPONENT_NAME: 'MyComponent',
    INTERFACE_NAME: 'MyInterface',
    FUNCTION_NAME: 'myFunction',
    SCRIPT_NAME: 'my-script',
  };
  
  // Merge with provided variables
  const allVariables = { ...defaultVariables, ...variables };
  
  // Replace all template variables
  for (const [key, value] of Object.entries(allVariables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processedContent = processedContent.replace(regex, value);
  }
  
  return processedContent;
}

// Get template suggestions based on file extension
export function getTemplateSuggestions(filename: string) {
  const extension = filename.substring(filename.lastIndexOf('.'));
  return BUILT_IN_TEMPLATES.filter(template => template.fileExtension === extension);
}

// Extract variables from template content
export function extractTemplateVariables(content: string): string[] {
  const regex = /{{([^}]+)}}/g;
  const variables = new Set<string>();
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    variables.add(match[1]);
  }
  
  return Array.from(variables);
}
