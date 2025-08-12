# @proxy-mocksy/core

Core logic and shared functionality for Proxy Mocksy. This package provides the HTTP server, configuration management, dependency injection setup, and shared types used by both the CLI, VS Code extension, and Docker container.

## Features

- **Koa-based HTTP Server**: Robust server implementation with middleware support
- **Configuration Management**: JSON-based endpoint configuration with validation
- **Template Variables**: Dynamic response parsing with request data injection
- **Dependency Injection**: TSyringe-based DI container for modular architecture
- **Logger System**: Integrated logging with VS Code output channel support
- **Response Parsing**: Flexible template variable replacement in response bodies

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
- **tsyringe**: Dependency injection container
- **reflect-metadata**: Decorator metadata support

## Development

Built with TypeScript and compiled to CommonJS for compatibility.

```bash
# Build the package
npm run build

# Clean build artifacts  
npm run clean
```

## License

LGPL-2.1-only