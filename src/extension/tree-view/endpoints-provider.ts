import * as vscode from 'vscode';
import { singleton } from 'tsyringe';
import { EndpointPathItem } from './endpoint-path-item';
import { ConfigManipulator } from '../../core/config-manipulator';
import { EndpointMethodItem } from './endpoint-method-item';
import { ServerManager } from '../../core/server-manager';
import { EventManager } from '../event-manager';

type EndpointTreeItem = EndpointPathItem | EndpointMethodItem;

@singleton()
export class EndpointsProvider implements vscode.TreeDataProvider<EndpointTreeItem> {
  constructor (
    private readonly configManipulator: ConfigManipulator,
    private readonly serverManager: ServerManager,
    private readonly eventManager: EventManager,
  ) {}

  private _onDidChangeTreeData: vscode.EventEmitter<EndpointTreeItem | undefined | null | void> = new vscode.EventEmitter<EndpointTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<EndpointTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  getTreeItem(element: EndpointTreeItem) {
    return element;
  }

  async getChildren(element?: EndpointTreeItem | undefined): Promise<EndpointTreeItem[]> {
    if (element && element instanceof EndpointPathItem) {
      const methods = element.methods;
      return Promise.resolve(Object.entries(methods).map(([method, config]) => {
        return new EndpointMethodItem(
          element.path,
          method,
          config,
          vscode.TreeItemCollapsibleState.None
        );
      }));
    } else if (element && element instanceof EndpointMethodItem) {
      // EndpointMethodItem has no children
      return Promise.resolve([]);
    } else {
      // If no element is provided, return the root items
      return this.getEndpointConfiguration();
    }
  }

  public async refresh(): Promise<void> {
    this._onDidChangeTreeData.fire();
    this.eventManager.emitServerStatusChanged(false);
    const port = await this.serverManager.restartServer();
    this.eventManager.emitServerStatusChanged(true, port);
  }

  public async startServer(): Promise<void> {
    try {
      const port = await this.serverManager.startServer();
      vscode.window.showInformationMessage(`Server started on port ${port}`);
      this.eventManager.emitServerStatusChanged(true, port);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      vscode.window.showErrorMessage(`Failed to start server: ${errorMessage}`);
      this.eventManager.emitServerStatusChanged(false);
    }
  }

  public async stopServer(): Promise<void> {
    await this.serverManager.stopServer();
    vscode.window.showInformationMessage('Server stopped.');
    this.eventManager.emitServerStatusChanged(false);
  }

  public async openConfig(): Promise<void> {
    const configPath = this.configManipulator.configPath;
    if (configPath) {
      const doc = await vscode.workspace.openTextDocument(configPath);
      await vscode.window.showTextDocument(doc);
    } else {
      vscode.window.showErrorMessage('No configuration file found.');
    }
  }

  private async getEndpointConfiguration() {
    const config = await this.configManipulator.getConfig();
    if (!config) {
      return Promise.resolve([]);
    }

    return Promise.resolve(Object.entries(config.endpoints).map(([url, methods]) => {
      const collapsibleState = Object.keys(methods).length > 0
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None;
      return new EndpointPathItem(
        url,
        methods,
        collapsibleState,
      );
    }));
  }
}