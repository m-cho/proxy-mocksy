import Koa from 'koa';
import { Server } from 'http';
import { singleton } from 'tsyringe';
import { ConfigManipulator } from './config-manipulator';
import { ServerHandler } from './server-handler';
import bodyParser from '@koa/bodyparser';
import { Logger } from './logger';

@singleton()
export class ServerManager {
  private server: Server | null = null;

  constructor (
    private readonly configManipulator: ConfigManipulator,
    private readonly serverHandler: ServerHandler,
    private readonly logger: Logger,
  ) {}

  public async startServer(): Promise<number> {
    if (this.server) {
      this.logger.log('Server already running, stopping before restarting...');
      await this.stopServer();
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
          this.logger.error(`[ServerManager] Error starting server: ${(err as Error).message}`);
          reject(err);
        })
        .listen(port, () => {
          this.logger.log(`[ServerManager] Server is running on port ${port}`);
          resolve(port);
        });
    });

  }
}