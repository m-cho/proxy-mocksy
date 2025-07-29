import * as vscode from 'vscode';
import { EndpointConfig } from '../../core/config-manipulator';

export class EndpointMethodItem extends vscode.TreeItem {
  constructor(
    public readonly path: string,
    public readonly method: string,
    public readonly endpointConfig: EndpointConfig,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded
  ) {
    super(`[${method.toUpperCase()}]`, collapsibleState);
    this.tooltip = `${this.label} ${this.path}`;
    
    const status = this.endpointConfig.response.status;
    const body = this.endpointConfig.response.body;
    const bodyText = body ? JSON.stringify(body) : 'No body';
    
    this.description = `Status ${status} • ${bodyText}`;
  }

  contextValue = 'endpointMethodItem';
}