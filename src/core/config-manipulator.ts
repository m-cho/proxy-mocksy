import * as fs from 'fs';
import { singleton } from 'tsyringe';
import * as vscode from 'vscode';

export type EndpointConfig = {
  response: {
    status: number;
    body: string;
    headers?: { [key: string]: string };
  };
}

export type Config = {
  version: string;
  port: number;
  endpoints: {
    [url: string]: {
      [httpMethod: string]: EndpointConfig
    };
  };
};

@singleton()
export class ConfigManipulator {
  private get rootPath(): string | undefined {
    const rootPath =
      vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    if (!rootPath) {
      return undefined;
    }
    return rootPath;
  }

  public get defaultConfig() {
    return {
      VERSION: '1.0',
      PORT: 8888,
      ENDPOINT: {
        STATUS_CODE: 200,
      },
    };
  }

  public async getConfig(): Promise<Config | null> {
    if (!this.rootPath) {
      console.error('No workspace folder found. Cannot manipulate config.');
      return null;
    }
    
    await this.ensureConfigPathExists();
    
    const configContent = await fs.promises.readFile(this.getConfigPath(), 'utf-8');
    try {
      const json = JSON.parse(configContent) as Config;
      const endpoints: Config['endpoints'] = {};
      for (const [url, methods] of Object.entries(json.endpoints)) {
        endpoints[url] = {};
        for (const [method, config] of Object.entries(methods)) {
          endpoints[url][method.toLowerCase()] = config;
        }
      }
      return {
        version: json.version,
        port: json.port,
        endpoints: endpoints,
      };
    } catch (error) {
      console.error('Error parsing config file:', error);
      return this.createDefaultConfig();
    }
  }
  
  public getConfigPath(): string {
    return `${this.rootPath}/proxy-mocksy.config.json`;
  }

  private async ensureConfigPathExists(): Promise<void> {
    if (!this.configPathExists()) {
      console.log('Config file does not exist, creating default config.');
      await this.createDefaultConfig();
    }
  }

  private configPathExists(): boolean {
    try {
      fs.accessSync(this.getConfigPath());
    } catch (err) {
      return false;
    }
    return true;
  }

  private async createDefaultConfig(): Promise<Config> {
    const defaultConfig: Config = {
      version: '1.0',
      port: this.defaultConfig.PORT,
      endpoints: {}
    };
    await fs.promises.writeFile(this.getConfigPath(), JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}