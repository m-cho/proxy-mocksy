import { injectable } from "@needle-di/core";
import type * as vscode from "vscode";

@injectable()
export class Logger {
  private outputChannel?: vscode.OutputChannel;

  log(message: string): void {
    console.log(message);

    if (this.outputChannel) {
      this.outputChannel.appendLine(message);
    }
  }

  error(message: string): void {
    console.error(message);
    if (this.outputChannel) {
      this.outputChannel.appendLine(`Error: ${message}`);
    }
  }

  registerOutputChannel(channel: vscode.OutputChannel): void {
    this.outputChannel = channel;
  }
}