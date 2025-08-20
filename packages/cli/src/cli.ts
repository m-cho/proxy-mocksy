#!/usr/bin/env node
import { program } from "commander";
import { Container } from '@needle-di/core';
import { AppConfig, ConfigManipulator, ServerManager, RunningMode } from "@proxy-mocksy/core";
import { resolve } from "node:path";

const container = new Container();

const cliMetadata = {
  name: "@proxy-mocksy/cli",
  version: "0.0.15",
  description: "CLI tool for running local mock API servers with JSON configuration"
};

program
  .name(cliMetadata.name)
  .description(cliMetadata.description)
  .version(cliMetadata.version)
  .option("-c, --config <path>", "Path to the configuration file", "./proxy-mocksy.config.json")
  .option("-p, --port <number>", "Port to run the server on")
  .action(async (options) => {
    const appConfig = container.get(AppConfig);

    appConfig.registerConfig(RunningMode.CLI);

    const configManipulator = container.get(ConfigManipulator);
    configManipulator.setConfigPath(resolve(options.config));

    try {
      await configManipulator.getConfig();
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }

    const serverManager = container.get(ServerManager);

    await serverManager.startServer(options.port ? parseInt(options.port, 10) : undefined);
  });
    

program.parse(process.argv);