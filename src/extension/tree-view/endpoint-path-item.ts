import * as vscode from 'vscode';
import { Config } from '../../core/config-manipulator';

export class EndpointPathItem extends vscode.TreeItem {
  constructor(
    public readonly path: string,
    public readonly methods: Config['endpoints'][string],
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    const label = path;
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }

  contextValue = 'endpointPathItem';
}