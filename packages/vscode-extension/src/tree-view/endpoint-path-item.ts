import * as vscode from 'vscode';
import { Config } from '@proxy-mocksy/core';

export class EndpointPathItem extends vscode.TreeItem {
  constructor(
    public readonly path: string,
    public readonly methods: Config['endpoints'][string],
    public override readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    const label = path;
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }

  override contextValue = 'endpointPathItem';
}