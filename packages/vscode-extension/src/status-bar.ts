import * as vscode from 'vscode';
import { STOP_SERVER_COMMAND, START_SERVER_COMMAND } from "./commands.js";

export function getStatusBarText(isRunning: boolean, port?: number): string {
  if (isRunning) {
    return `$(link) Proxy Mocksy: Running on port ${port}`;
  } else {
    return '$(link) Proxy Mocksy: Stopped';
  }
}

export function getStatusBarToolbarText(isRunning: boolean, port?: number): string {
  if (isRunning) {
    return `Proxy Mocksy is running on port ${port}. Click to stop the server.`;
  } else {
    return 'Proxy Mocksy is stopped. Click to start the server.';
  }
}

export function getStatusBarCommand(isRunning: boolean): string {
  return isRunning ? STOP_SERVER_COMMAND : START_SERVER_COMMAND;
}

export function createStatusBarItem(): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = getStatusBarText(false);
  statusBarItem.tooltip = getStatusBarToolbarText(false);
  statusBarItem.command = getStatusBarCommand(false);
  statusBarItem.show();
  return statusBarItem;
}
