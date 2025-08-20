import { injectable } from "@needle-di/core";

export enum RunningMode {
  CLI = "cli",
  EXTENSION = "extension",
}

@injectable()
export class AppConfig {
  #runningMode?: RunningMode;

  get runningMode(): RunningMode {
    if (!this.#runningMode) {
      throw new Error("Running mode is not set. Please register the running mode first.");
    }
    return this.#runningMode;
  }

  registerConfig(runningMode: RunningMode): void {
    this.#runningMode = runningMode;
  }
}