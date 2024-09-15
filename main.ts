import { App, Editor, EditorPosition, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { FileSuggest } from './file-suggester'
import { summary } from 'summary';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	openAPIKey?: string;
	instructionPath?: string;
	instruction: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	instruction: 'summarize the content',
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'summarize-this-note',
			name: 'Summarize this note',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const anchor = 'summarizing...\n'
				editor.replaceSelection(anchor);
				const instruction = await this.readInstruction();

				const summarized = await summary(this.settings.openAPIKey!, instruction, view.file?.name || 'untitled.md', view.data);
				const text = editor.getValue();
				const offset = text.indexOf(anchor)
				const startPos = getEditorPositionFromIndex(text, offset);
				const endPos = getEditorPositionFromIndex(text, offset + anchor.length-1);
				editor.replaceRange(summarized, startPos, endPos);
				// editor.replaceSelection(summarized + '\n');
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async readInstruction() {
		const defaultInstruction = 'summarize the given content';
		if (!this.settings.instructionPath) return defaultInstruction;

		const file = this.app.vault.getFileByPath(this.settings.instructionPath);
		if (!file) return defaultInstruction;

		return await this.app.vault.cachedRead(file)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

function getEditorPositionFromIndex(
content: string,
index: number
): EditorPosition {
	const substr = content.substr(0, index);

	let l = 0;
	let offset = -1;
	let r = -1;
	for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r);
	offset += 1;

	const ch = content.substr(offset, index - offset).length;

	return { line: l, ch: ch };
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('OpenAI key')
			.setDesc('Bring your OpenAI key')
			.addSearch(cb => {
				cb.setPlaceholder('Example: sk-proj-rxxLFnjNb4FYNnSg4CiaD80ypRtYd2DXljzBFepk6L0t4BH9')
					.setValue(this.plugin.settings.openAPIKey || '')
					.onChange(path => {
						this.plugin.settings.openAPIKey = path;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Instruction File')
			.setDesc('Choose your instruction file')
			.addSearch(cb => {
				try {
					new FileSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder('Example: templates/template-file')
					.setValue(this.plugin.settings.instructionPath || '')
					.onChange(path => {
						this.plugin.settings.instructionPath = path;
						this.plugin.saveSettings();
					});
			});
	}
}
