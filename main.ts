import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface GistFetchSettings {
	ownerSetting: string;
	mirrorPath: string;
	includePrivate: boolean;
}

const DEFAULT_SETTINGS: GistFetchSettings = {
	ownerSetting: 'default',
	mirrorPath: '/',
	includePrivate: false,
}

export default class GistFetch extends Plugin {
	settings: GistFetchSettings;

	async fetchGists(): Promise<Array<any>> {
		try {
			const response = await requestUrl({
				url: `https://api.github.com/users/${this.settings.ownerSetting}/gists`,
				method: 'GET',
				headers: {
					'Accept': 'application/vnd.github.v3+json',
				}
			});
			return response.json;
		} catch (error) {
			console.error(error);
			new Notice('Failed to fetch gists!');
		}
		return [];
	}

	async onload() {
		await this.loadSettings();

		this.app.vault.createFolder(this.settings.mirrorPath)
			.then(() => { console.log(`${this.settings.mirrorPath} Folder created`); })
			.catch((error) => {
				if (!error.message.includes("already exists")) {
					console.error(error);
				}
			});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('cloud-download', 'Gist Fetch', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			const gistList = this.fetchGists();

			gistList.then((gists) => {
				gists.forEach((gist) => {
					const folder = `${this.settings.mirrorPath}/${gist.description}`;

					this.app.vault.createFolder(folder)
						.then(() => { console.log(`${folder} Folder created`) })
						.catch((error) => {
							if (!error.message.includes("already exists")) {
								console.error(error);
							}
						});

					for (const file of Object.values(gist.files) as Array<any>) {

						let path
						if (file.extension === "md") {
							path = `${folder}/${file.filename}`;
						} else {
							path = `${folder}/${file.filename}.md`;
						}

						this.app.vault.adapter.trashLocal(path)
							.then(() => { console.log(`${path} Note trashed`) })
							.catch((error) => { console.error(error); });

						let body = "";
						requestUrl({
							url: file.raw_url,
							method: 'GET',
							headers: {
								'Accept': 'application/vnd.github.raw',
							}
						})
							.then((response) => {
								body = response.text;

								const frontmatter = `---
created: ${gist.created_at}
filename: ${file.filename}
id: ${gist.id}
content-type: ${file.type}
modified: ${gist.updated_at}
size: ${file.size}
---\n\n`;

								let md;
								if (file.language === "Markdown") {
									md = frontmatter + body;
								} else {
									md = `${frontmatter}# ${file.filename}\n\n~~~${file.language}\n${body}\n~~~\n`;
								}
								this.app.vault.create(path, md,
									{
										ctime: new Date(gist.created_at).getTime(),
										mtime: new Date(gist.updated_at).getTime()
									}
								)
							});
					};
				})
				new Notice(`${gists.length} gists fetched!`);
			});
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('gist-fetch-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-gist-modal-simple',
		// 	name: 'Open Gist modal (simple)',
		// 	callback: () => {
		// 		new GistModal(this.app).open();
		// 	}
		// });

		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'gist-editor-command',
		// 	name: 'Gist editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Gist editor command');
		// 	}
		// });

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-gist-modal-complex',
		// 	name: 'Open Gist modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new GistModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GistSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	// onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class GistModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class GistSettingTab extends PluginSettingTab {
	plugin: GistFetch;

	constructor(app: App, plugin: GistFetch) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('GitHub Username')
			.setDesc('Username')
			.addText(text => text
				.setPlaceholder('Enter your GitHub username')
				.setValue(this.plugin.settings.ownerSetting)
				.onChange(async (value) => {
					this.plugin.settings.ownerSetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Vault Folder to receive fetched gists')
			.setDesc('Enter the path to the folder in the Vault where gists will be stored')
			.addText(text => text
				.setPlaceholder('Enter the Vault path to store gists')
				.setValue(this.plugin.settings.mirrorPath)
				.onChange(async (value) => {
					this.plugin.settings.mirrorPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Include Private Gists')
			.setDesc('Fetch both public and private gists (not implemented yet)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includePrivate)
				.onChange(async (value) => {
					this.plugin.settings.includePrivate = value;
					await this.plugin.saveSettings();
				}));
	}
}
