import Koa from 'koa';
import { Server } from 'node:http';
import { injectable, inject } from "@needle-di/core";
import { ConfigManipulator } from './config-manipulator.js';
import { ServerHandler } from './server-handler.js';
import bodyParser from '@koa/bodyparser';
import { Logger } from './logger.js';

@injectable()
export class ServerManager {
  private server: Server | null = null;
  private portOverride?: number;

  constructor (
    private readonly configManipulator: ConfigManipulator = inject(ConfigManipulator),
    private readonly serverHandler: ServerHandler = inject(ServerHandler),
    private readonly logger: Logger = inject(Logger),
  ) {}

  public async startServer(portOverride?: number): Promise<number> {
    if (this.server) {
      this.logger.log('Server already running, stopping before restarting...');
      await this.stopServer();
    }

    if (portOverride) {
      this.portOverride = portOverride;
    }

    return this.initServer();
  }

  public async stopServer(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => {
          if (err) {
            this.logger.log(`Error stopping server: ${(err as Error).message}`);
            reject(err);
          } else {
            this.logger.log('Server stopped.');
            this.server = null;
            resolve();
          }
        });
      });
    } else {
      this.logger.log('Server not running.');
    }
  }

  public async restartServer(): Promise<number> {
    await this.stopServer();
    return await this.startServer();
  }

  public getServerStatus(): "running" | "stopped" {
    return this.server ? "running" : "stopped";
  }

  private async getPort() {
    if (this.portOverride) {
      return this.portOverride;
    }
    const config = await this.configManipulator.getConfig();
    return config?.port || this.configManipulator.defaultConfig.PORT;
  }

  private async initServer(): Promise<number> {
    const port = await this.getPort();

    return new Promise(async (resolve, reject) => {
      this.server = new Koa()
        .use(bodyParser())
        .use(await this.serverHandler.getRoutes())
        .on('error', (err) => {
          this.logger.error(`[ProxyMocksyServerManager] Error starting server: ${(err as Error).message}`);
          reject(err);
        })
        .listen(port, () => {
          this.logger.log(`[ProxyMocksyServerManager] Server is running on port ${port}`);
          resolve(port);
        });
    });

  }
}