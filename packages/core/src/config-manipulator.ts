import * as fs from 'node:fs';
import { injectable } from '@needle-di/core';

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

type DefaultConfig = {
  VERSION: string;
  PORT: number;
  ENDPOINT: {
    STATUS_CODE: number;
  };
};

@injectable()
export class ConfigManipulator {
  #configPath?: string; // Configuration file path

  public get defaultConfig(): DefaultConfig {
    return {
      VERSION: '1.0',
      PORT: 8888,
      ENDPOINT: {
        STATUS_CODE: 200,
      },
    };
  }
  
  public get configPath(): string | undefined {
    return this.#configPath;
  }

  public setConfigPath(path: string): void {
    this.#configPath = path;
  }

  public async getConfig(): Promise<Config | null> {
    if (!this.configPath) {
      console.error('No workspace folder found. Cannot manipulate config.');
      return null;
    }
    
    if (!this.configPathExists()) {
      console.warn(`Config file not found at ${this.configPath}`);
      return null;
    }
    
    const configContent = await fs.promises.readFile(this.configPath, 'utf-8');
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
      return null;
    }
  }

  public async createConfig(path: string): Promise<void> {
    const defaultConfig: Config = {
      version: this.defaultConfig.VERSION,
      port: this.defaultConfig.PORT,
      endpoints: {},
    };
    await fs.promises.writeFile(path, JSON.stringify(defaultConfig, null, 2));
    this.setConfigPath(path);
  }

  private configPathExists(): boolean {
    if (!this.configPath) {
      return false;
    }
    try {
      fs.accessSync(this.configPath);
    } catch (err) {
      return false;
    }
    return true;
  }
}