import Router from "@koa/router";
import { ConfigManipulator } from "./config-manipulator.js";
import { injectable, inject } from "@needle-di/core";
import { ResponseBodyParser } from "./response-body-parser.js";
import { Logger } from "./logger.js";

@injectable()
export class ServerHandler {
  constructor (
    private readonly configManipulator: ConfigManipulator = inject(ConfigManipulator),
    private readonly logger: Logger = inject(Logger),
  ) {}

  public async getRoutes(): Promise<Router.Middleware> {
    const router = new Router();

    const config = await this.configManipulator.getConfig();
    if (!config) {
      return router.routes();
    }

    for (const [url, methods] of Object.entries(config.endpoints)) {
      for (const [httpMethod, endpointConfig] of Object.entries(methods)) {
        try {
          this.assertHttpMethod(httpMethod);

          router[httpMethod](url, async (ctx) => {
            this.logger.log(`Handling [${ctx.method.toUpperCase()}] ${ctx.url} => [${httpMethod.toUpperCase()}] ${url}`);
            const body = new ResponseBodyParser(
              ctx.params,
              ctx.query || {},
              ctx.request.body || {},
              endpointConfig.response.body,
            ).parse();
            ctx.body = body;
            ctx.status = endpointConfig.response?.status || this.configManipulator.defaultConfig.ENDPOINT.STATUS_CODE;
            ctx.set(endpointConfig.response?.headers || {});
          });
        } catch {
          console.warn(`Unsupported HTTP method: ${httpMethod} for URL: ${url}`);
        }
      }
    }

    return router.routes();
  }

  private assertHttpMethod(method: string): asserts method is 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' {
    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options'];
    
    if (!validMethods.includes(method)) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}