import { singleton } from "tsyringe";
import type * as vscode from "vscode";

@singleton()
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