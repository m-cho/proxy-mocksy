# @proxy-mocksy/core

[![npm version](https://img.shields.io/npm/v/@proxy-mocksy/core)](https://www.npmjs.com/package/@proxy-mocksy/core)
[![JSR](https://jsr.io/badges/@proxy-mocksy/core)](https://jsr.io/@proxy-mocksy/core)
[![JSR Score](https://jsr.io/badges/@proxy-mocksy/core/score)](https://jsr.io/@proxy-mocksy/core)
[![npm downloads](https://img.shields.io/npm/dm/@proxy-mocksy/core)](https://www.npmjs.com/package/@proxy-mocksy/core)

Internal library for [@proxy-mocksy/cli](https://www.npmjs.com/package/@proxy-mocksy/cli). This package provides the HTTP server, configuration management, dependency injection setup, and shared types used by the CLI, VS Code extension, and Docker container.

Available on:
- 📦 **npm**: [`@proxy-mocksy/core`](https://www.npmjs.com/package/@proxy-mocksy/core)
- 🦕 **JSR**: [`@proxy-mocksy/core`](https://jsr.io/@proxy-mocksy/core)

**Main Package:**
- 📦 **npm**: [`@proxy-mocksy/cli`](https://www.npmjs.com/package/@proxy-mocksy/cli)
- 🦕 **JSR**: [`@proxy-mocksy/cli`](https://jsr.io/@proxy-mocksy/cli)

## Features

- **Koa-based HTTP Server**: Robust server implementation with middleware support
- **Configuration Management**: JSON-based endpoint configuration with validation
- **Template Variables**: Dynamic response parsing with request data injection
- **Dependency Injection**: @needle-di/core lightweight DI container for modular architecture
- **Logger System**: Integrated logging with VS Code output channel support
- **Response Parsing**: Flexible template variable replacement in response bodies
- **Cross-Runtime Compatibility**: Works seamlessly with both Node.js and Deno

## Architecture

This package is the foundation of Proxy Mocksy and provides:

### Core Classes

- [`ServerManager`](src/server-manager.ts) - HTTP server lifecycle management
- [`ConfigManipulator`](src/config-manipulator.ts) - Configuration file handling and validation
- [`ServerHandler`](src/server-handler.ts) - Koa route setup and request handling
- [`ResponseBodyParser`](src/response-body-parser.ts) - Template variable processing
- [`Logger`](src/logger.ts) - Logging abstraction with multiple output support
- [`AppConfig`](src/app-config.ts) - Application mode configuration (CLI vs Extension)

### HTTP Methods Supported

- GET, POST, PUT, PATCH, DELETE, OPTIONS

### Template Variables

Dynamic response generation using:
- `{{params.name}}` - URL parameters
- `{{query.name}}` - Query string parameters  
- `{{body.name}}` - Request body fields

## Usage

This package is designed to be consumed by the CLI, VS Code extension, and Docker packages. It's not intended for direct usage but provides the core functionality.

### Configuration Format

```json
{
  "version": "1.0",
  "port": 8888,
  "endpoints": {
    "/api/users/:id": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "id": "{{params.id}}",
            "name": "User {{params.id}}"
          }
        }
      }
    }
  }
}
```

## Dependencies

- **koa**: HTTP server framework
- **@koa/router**: Routing middleware
- **@koa/bodyparser**: Request body parsing
- **@needle-di/core**: Lightweight dependency injection container

## Development

Built with TypeScript and compiled to ES2022 modules for modern runtime compatibility.

```bash
# Build the package
npm run build

# Clean build artifacts  
npm run clean
```

## License

LGPL-2.1-only