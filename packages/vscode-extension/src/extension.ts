import "reflect-metadata";
import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { EndpointsProvider } from './tree-view/endpoints-provider';
import { Logger, ConfigManipulator, AppConfig, RunningMode } from "@proxy-mocksy/core";
import { HAS_CONFIG, SERVER_PORT_CONTEXT, SERVER_RUNNING_CONTEXT } from "./context";
import { EventManager } from "./event-manager";
import { OPEN_CONFIG_COMMAND, REFRESH_COMMAND, SHOW_OUTPUT_COMMAND, START_SERVER_COMMAND, STOP_SERVER_COMMAND } from "./commands";
import { createStatusBarItem, getStatusBarToolbarText, getStatusBarCommand, getStatusBarText } from "./status-bar";

export function createOutputChannel(name: string, logger: Logger): vscode.OutputChannel {
  const outputChannel = vscode.window.createOutputChannel(name);
  logger.registerOutputChannel(outputChannel);
  return outputChannel;
}

export async function activate({ subscriptions }: vscode.ExtensionContext) {
	console.log('proxy-mocksy is now active!');

	const appConfig = container.resolve(AppConfig);
	appConfig.registerConfig(RunningMode.EXTENSION);
	const endpointsProvider = container.resolve(EndpointsProvider);
	const logger = container.resolve(Logger);
	const configManipulator = container.resolve(ConfigManipulator);
	const eventManager = container.resolve(EventManager);

	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	
	if (rootPath) {
		configManipulator.setConfigPath(`${rootPath}/proxy-mocksy.config.json`);
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
			() => endpointsProvider.openConfig()
		),
	);
	subscriptions.push(
		eventManager.onServerStatusChanged(({ isRunning, port }) => {
			vscode.commands.executeCommand('setContext', SERVER_RUNNING_CONTEXT, isRunning);
			if (port) {
				vscode.commands.executeCommand('setContext', SERVER_PORT_CONTEXT, port);
			}

			statusBarItem.text = getStatusBarText(isRunning, port);
			statusBarItem.tooltip = getStatusBarToolbarText(isRunning, port);
			statusBarItem.command = getStatusBarCommand(isRunning);
		}),
	);
}

// This method is called when your extension is deactivated
export async function deactivate() {
	const endpointsProvider = container.resolve(EndpointsProvider);
	await endpointsProvider.stopServer();
}
