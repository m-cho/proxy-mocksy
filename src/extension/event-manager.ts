import { singleton } from "tsyringe";
import { EventEmitter } from "vscode";

export interface ServerStatusChangedEvent {
  isRunning: boolean;
  port?: number;
}

@singleton()
export class EventManager {
  private readonly _onServerStatusChanged = new EventEmitter<ServerStatusChangedEvent>();
  public readonly onServerStatusChanged = this._onServerStatusChanged.event;

  public emitServerStatusChanged(isRunning: boolean, port?: number) {
    this._onServerStatusChanged.fire({ isRunning, port });
  }

  public dispose() {
    this._onServerStatusChanged.dispose();
  }
}