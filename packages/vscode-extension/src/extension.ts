import * as vscode from 'vscode';
import { Container } from '@needle-di/core';
import { EndpointsProvider } from './tree-view/endpoints-provider.js';
import { Logger, ConfigManipulator, AppConfig, RunningMode } from "@proxy-mocksy/core";
import { HAS_CONFIG, SERVER_PORT_CONTEXT, SERVER_RUNNING_CONTEXT } from "./context.js";
import { EventManager } from "./event-manager.js";
import { OPEN_CONFIG_COMMAND, REFRESH_COMMAND, SHOW_OUTPUT_COMMAND, START_SERVER_COMMAND, STOP_SERVER_COMMAND } from "./commands.js";
import { createStatusBarItem, getStatusBarToolbarText, getStatusBarCommand, getStatusBarText } from "./status-bar.js";

const container = new Container();

export function createOutputChannel(name: string, logger: Logger): vscode.OutputChannel {
  const outputChannel = vscode.window.createOutputChannel(name);
  logger.registerOutputChannel(outputChannel);
  return outputChannel;
}

const getConfigPath = (rootPath: string) => `${rootPath}/proxy-mocksy.config.json`;

type LocalContext = {
	[SERVER_RUNNING_CONTEXT]: boolean;
	[key: string]: unknown;
};

export async function activate({ subscriptions }: vscode.ExtensionContext) {
	let ctx: LocalContext = {
		[SERVER_RUNNING_CONTEXT]: false,
	};
	console.log('proxy-mocksy is now active!');

	const appConfig = container.get(AppConfig);
	appConfig.registerConfig(RunningMode.EXTENSION);
	const endpointsProvider = container.get(EndpointsProvider);
	const logger = container.get(Logger);
	const configManipulator = container.get(ConfigManipulator);
	const eventManager = container.get(EventManager);

	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	
	if (rootPath) {
		configManipulator.setConfigPath(getConfigPath(rootPath));
	}

	// Set initial context variables
	vscode.commands.executeCommand('setContext', SERVER_RUNNING_CONTEXT, false);
	vscode.commands.executeCommand('setContext', SERVER_PORT_CONTEXT, configManipulator.defaultConfig.PORT);
	vscode.commands.executeCommand('setContext', HAS_CONFIG, !!await configManipulator.getConfig());

	const outputChannel = createOutputChannel('Proxy Mocksy', logger);
	subscriptions.push(outputChannel);

	const statusBarItem = createStatusBarItem();
	subscriptions.push(statusBarItem);

	subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'proxy-mocksy.view',
			endpointsProvider,
		),
	);
	subscriptions.push(
    vscode.commands.registerCommand(
			SHOW_OUTPUT_COMMAND,
			() => outputChannel.show()
    ),
	);
	subscriptions.push(
		vscode.commands.registerCommand(
			REFRESH_COMMAND,
			async () => {
				await endpointsProvider.refresh();
				vscode.commands.executeCommand('setContext', HAS_CONFIG, !!await configManipulator.getConfig());
			}
		),
	);
	subscriptions.push(
		vscode.commands.registerCommand(
			START_SERVER_COMMAND,
			() => endpointsProvider.startServer()
		),
	);
	subscriptions.push(
		vscode.commands.registerCommand(
			STOP_SERVER_COMMAND,
			() => endpointsProvider.stopServer()
		),
	);
	subscriptions.push(
		vscode.commands.registerCommand(
			OPEN_CONFIG_COMMAND,
			async () => {
				if (await configManipulator.getConfig()) {
					await endpointsProvider.openConfig();
				} else if (rootPath) {
					await endpointsProvider.createConfig(getConfigPath(rootPath));
					await endpointsProvider.openConfig();
				}
			}
		),
	);
	subscriptions.push(
		eventManager.onServerStatusChanged(({ isRunning, port }) => {
			vscode.commands.executeCommand('setContext', SERVER_RUNNING_CONTEXT, isRunning);
			ctx[SERVER_RUNNING_CONTEXT] = isRunning;
			if (port) {
				vscode.commands.executeCommand('setContext', SERVER_PORT_CONTEXT, port);
			}

			statusBarItem.text = getStatusBarText(isRunning, port);
			statusBarItem.tooltip = getStatusBarToolbarText(isRunning, port);
			statusBarItem.command = getStatusBarCommand(isRunning);
		}),
	);

	if (rootPath && configManipulator.configPath) {
		const configFileWatcher = vscode.workspace.createFileSystemWatcher(configManipulator.configPath);
		configFileWatcher.onDidChange(async () => {
			// If the server is not running, refresh will restart the server after config changes.
			await endpointsProvider.refresh(
				!ctx[SERVER_RUNNING_CONTEXT],
			);
			vscode.commands.executeCommand('setContext', HAS_CONFIG, !!await configManipulator.getConfig());
		});
		configFileWatcher.onDidCreate(async () => {
			await endpointsProvider.refresh(true);
			vscode.commands.executeCommand('setContext', HAS_CONFIG, !!await configManipulator.getConfig());
		});
		configFileWatcher.onDidDelete(async () => {
			await endpointsProvider.stopServer();
			vscode.commands.executeCommand('setContext', HAS_CONFIG, !!await configManipulator.getConfig());
		});
		subscriptions.push(
			configFileWatcher,
		);
	}
}

export async function deactivate() {
	const endpointsProvider = container.get(EndpointsProvider);
	await endpointsProvider.stopServer();
}
