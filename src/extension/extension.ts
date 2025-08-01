import "reflect-metadata";
import * as vscode from 'vscode';
import { container } from 'tsyringe'; 
import { EndpointsProvider } from './tree-view/endpoints-provider';
import { Logger } from "../core/logger";
import { SERVER_PORT_CONTEXT, SERVER_RUNNING_CONTEXT } from "./context";
import { ConfigManipulator } from "../core/config-manipulator";
import { EventManager } from "./event-manager";
import { OPEN_CONFIG_COMMAND, REFRESH_COMMAND, SHOW_OUTPUT_COMMAND, START_SERVER_COMMAND, STOP_SERVER_COMMAND } from "./commands";
import { createStatusBarItem, getStatusBarToolbarText, getStatusBarCommand, getStatusBarText } from "./status-bar";

export function createOutputChannel(name: string, logger: Logger): vscode.OutputChannel {
  const outputChannel = vscode.window.createOutputChannel(name);
  logger.registerOutputChannel(outputChannel);
  return outputChannel;
}

export function activate({ subscriptions }: vscode.ExtensionContext) {
	console.log('proxy-mocksy is now active!');

	const endpointsProvider = container.resolve(EndpointsProvider);
	const logger = container.resolve(Logger);
	const configManipulator = container.resolve(ConfigManipulator);
	const eventManager = container.resolve(EventManager);

	// Set initial context variables
	vscode.commands.executeCommand('setContext', SERVER_RUNNING_CONTEXT, false);
	vscode.commands.executeCommand('setContext', SERVER_PORT_CONTEXT, configManipulator.defaultConfig.PORT);

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
			() => endpointsProvider.refresh()
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
