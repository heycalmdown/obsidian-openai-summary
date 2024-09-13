# OpenAI Summary Plugin for Obsidian

This plugin for Obsidian (https://obsidian.md) provides functionality to summarize notes using OpenAI's GPT models.

## Key Features

- Summarize Obsidian notes using OpenAI's GPT models
- Generate summaries as new notes or append to existing ones
- Easy note selection with file suggestion feature

## Manual Installation

As this plugin is not yet available in the Obsidian Community Plugins directory, follow these steps for manual installation:

1. Download the latest release from the GitHub releases page.
2. Extract the downloaded zip file.
3. Copy the extracted folder to your Obsidian vault's plugins folder: `<vault>/.obsidian/plugins/`
4. Reload Obsidian
5. Go to Settings > Community plugins and enable "OpenAI Summary"

## Usage

1. Open the command palette and select "OpenAI Summary: Summarize Note"
2. Choose the note you want to summarize
3. Once the summary is generated, you can save it as a new note or append it to an existing one

## Configuration

In the plugin settings, you can configure the following options:

- OpenAI API key
- GPT model to use
- Summary length and style settings

## For Developers

This project is developed using TypeScript. If you want to contribute:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development mode

## License

This project is distributed under the MIT License.

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.

## Contributing

Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.