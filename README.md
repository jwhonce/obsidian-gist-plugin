# Gist Fetch Plugin for Obsidian

A plugin for [Obsidian](https://obsidian.md) that fetches GitHub gists and imports them into your vault as organized Markdown files.

This plugin allows you to easily sync your GitHub gists into your Obsidian vault, making them searchable and linkable within your knowledge management system. Each gist is downloaded with proper formatting and metadata, and organized into folders based on gist descriptions.

## Features

- **Fetch GitHub Gists**: Download all public gists from a specified GitHub username
- **Organized Storage**: Creates folders based on gist descriptions for better organization
- **Markdown Conversion**: Converts non-markdown files to markdown with proper syntax highlighting
- **Metadata Preservation**: Adds front matter with creation date, modification date, file size, and tags
- **Easy Access**: Ribbon icon for quick gist fetching
- **Configurable**: Settings for username, storage path, and private gist inclusion
- **Desktop Only**: Optimized for desktop Obsidian usage

## How to Use

### Quick Start

1. Install and enable the plugin in Obsidian settings
2. Configure your GitHub username in the plugin settings
3. Set the vault folder where you want gists to be stored
4. Click the cloud download icon in the ribbon or use the command palette to fetch gists

### Detailed Usage

- **Fetch Gists**: Click the cloud download ribbon icon to fetch all gists from the configured GitHub username
- **View Results**: Gists will be organized into folders based on their descriptions
- **File Format**:
  - Markdown files are preserved as-is
  - Other file types are wrapped in code blocks with syntax highlighting
  - All files include front matter with metadata (creation date, modification date, size, tags)

## Configuration

Access plugin settings through: Settings → Community Plugins → Gist Fetch → Settings

### Available Settings

- **GitHub Username**: The GitHub username whose gists you want to fetch
- **Vault Folder**: The folder path in your vault where gists will be stored (default: "/")
- **Include Private Gists**: Toggle to include private gists (⚠️ Not yet implemented)

## Installation

### From Obsidian Community Plugins (Recommended)

> Note: **This plugin is not yet available in the community plugin directory.**

### Using BRAT (Beta Reviewers Auto-update Tester)

BRAT allows you to install plugins directly from GitHub repositories. This is the easiest way to install and keep the plugin updated until it's available in the community plugin directory.

1. **Install BRAT plugin:**
   - Go to Settings → Community Plugins
   - Search for "BRAT" and install it
   - Enable the BRAT plugin

2. **Install Gist Fetch using BRAT:**
   - Open Command Palette (Ctrl/Cmd + P)
   - Run command: "BRAT: Add a beta plugin for testing"
   - Enter the repository URL: `https://github.com/jwhonce/obsidian-gist-plugin`
   - Click "Add Plugin"
   - Enable "Gist Fetch" in Settings → Community Plugins

3. **Updates:** BRAT will automatically check for updates and notify you when new versions are available.

### Manual Installation

1. Download the latest release from [GitHub releases](https://github.com/jwhonce/obsidian-gist-plugin/releases)
2. Extract the files to your vault's plugins folder: `VaultFolder/.obsidian/plugins/gist-fetch/`
3. Ensure the following files are present:
   - `main.js`
   - `manifest.json`
   - `styles.css` (if available)
4. Restart Obsidian
5. Enable the plugin in Settings → Community Plugins

### Development Installation

1. Clone this repository: `git clone https://github.com/jwhonce/obsidian-gist-plugin.git`
2. Navigate to your vault's plugins folder: `cd /path/to/vault/.obsidian/plugins/`
3. Create plugin directory: `mkdir gist-fetch && cd gist-fetch`
4. Copy or symlink the cloned repository contents
5. Install dependencies: `npm install`
6. Build the plugin: `npm run build`
7. Restart Obsidian and enable the plugin

## Development

### Prerequisites

- Node.js v16 or higher (`node --version`)
- npm or yarn package manager

### Development Setup

1. Clone the repository: `git clone https://github.com/jwhonce/obsidian-gist-plugin.git`
2. Install dependencies: `npm install`
3. Start development build: `npm run dev` (watches for changes and rebuilds)
4. For production build: `npm run build`

### Code Quality

This project uses ESLint for code quality analysis:

- Install ESLint: `npm install -g eslint`
- Run analysis: `eslint main.ts`
- For folder analysis: `eslint ./src/`

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to the [GitHub repository](https://github.com/jwhonce/obsidian-gist-plugin).

## Author

Created by **jwhonce**

- GitHub: [jwhonce](https://github.com/jwhonce)
- Repository: [obsidian-gist-plugin](https://github.com/jwhonce/obsidian-gist-plugin)

## License

BSD Zero Clause License (0BSD)

## API Documentation

For Obsidian plugin development, see the [Obsidian API documentation](https://github.com/obsidianmd/obsidian-api)
