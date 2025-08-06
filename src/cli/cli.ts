#!/usr/bin/env node
import "reflect-metadata";
import { program } from "commander";
import { container } from 'tsyringe';
import { ConfigManipulator } from "../core/config-manipulator";
import { ServerManager } from "../core/server-manager";
import { AppConfig, RunningMode } from "../core/app-config";

const packageJson = require("../../package.json");

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .option("-c, --config <path>", "Path to the configuration file", "./proxy-mocksy.config.json")
  .option("-p, --port <number>", "Port to run the server on")
  .action(async (options) => {
    const appConfig = container.resolve(AppConfig);

    appConfig.registerConfig(RunningMode.CLI);

    const configManipulator = container.resolve(ConfigManipulator);
    configManipulator.setConfigPath(options.config);

    try {
      await configManipulator.getConfig();
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }

    const serverManager = container.resolve(ServerManager);

    await serverManager.startServer(options.port ? parseInt(options.port, 10) : undefined);
  });
    

program.parse(process.argv);