# @proxy-mocksy/vscode-extension

VS Code extension for Proxy Mocksy. Provides visual management of mock API endpoints directly within VS Code with tree view, status bar integration, and command palette support.

## Features

### Visual Interface
- **Activity Bar Panel**: Dedicated Proxy Mocksy section in VS Code activity bar
- **Tree View**: Hierarchical display of endpoints organized by path and HTTP method
- **Welcome View**: Helpful message and config creation button when no config exists
- **Status Bar**: Real-time server status and port information
- **Output Channel**: Server logs and debugging information

### JSON Schema Validation
- **IntelliSense**: Auto-completion and validation for configuration files
- **Error Detection**: Real-time validation of configuration syntax and structure
- **Documentation**: Inline help and examples for all configuration properties
- **Type Safety**: Ensures correct data types and required fields

### Commands
- **Start/Stop Server**: One-click server management
- **Refresh Endpoints**: Reload configuration and restart server
- **Open/Create Config**: Quick access to configuration file or create new one if missing
- **Show Output**: View server logs and debug information

### Smart Context & Hot Reload
- **Context Awareness**: Buttons and commands adapt based on configuration file presence
- **File Watching**: Automatic detection of configuration changes with smart restart logic
- **Real-time Updates**: Server status and tree view refresh automatically
- **Auto-detection**: Workspace configuration files detected automatically

## Installation

*Note: This extension is not yet published to the VS Code marketplace.*

For development/testing:
1. Clone the repository
2. Open in VS Code
3. Press `F5` to run the extension in a new Extension Development Host window

## Getting Started

1. **Open Workspace**: Open any folder in VS Code as your workspace
2. **Create Configuration**: 
   - If no config exists, the extension shows a welcome message with "Create Config" button
   - Click the button or use "Proxy Mocksy: Open Config" command to create a new configuration
   - The extension looks for `proxy-mocksy.config.json` in your workspace root
3. **JSON Schema Benefits**: Enjoy auto-completion, validation, and inline documentation
4. **Manage Server**: Use the Proxy Mocksy activity bar panel to start/stop the server
5. **View Endpoints**: Browse your configured endpoints in the tree view

## Configuration

Create a `proxy-mocksy.config.json` file in your workspace root. The extension provides JSON schema validation with auto-completion and inline documentation:

```json
{
  "version": "1.0",
  "port": 8888,
  "endpoints": {
    "/api/users": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "users": [
              {"id": 1, "name": "John"},
              {"id": 2, "name": "Jane"}
            ]
          }
        }
      }
    },
    "/api/users/:id": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "id": "{{params.id}}",
            "name": "User {{params.id}}"
          }
        }
      },
      "patch": {
        "response": {
          "status": 200,
          "body": {
            "id": "{{params.id}}",
            "name": "{{body.name}}",
            "updated": true
          }
        }
      }
    }
  }
}
```

### JSON Schema Features
- **Auto-completion**: Type-ahead suggestions for all properties
- **Validation**: Real-time error detection and highlighting
- **Documentation**: Hover tooltips with property descriptions and examples
- **Type Safety**: Ensures correct data types for all configuration values

## Commands

All commands are available via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Proxy Mocksy: Start Server` | Start the mock server |
| `Proxy Mocksy: Stop Server` | Stop the mock server |
| `Proxy Mocksy: Refresh Mocked Endpoints` | Reload configuration and restart server |
| `Proxy Mocksy: Show Output` | Open the output channel with server logs |
| `Proxy Mocksy: Open Config` | Open existing config file or create new one if missing |

## Tree View

The tree view displays:
- **Endpoint Paths**: Root nodes showing API paths (e.g., `/api/users`, `/api/users/:id`)
- **HTTP Methods**: Child nodes showing supported methods with status codes and response previews
- **Response Info**: Method descriptions include status code and response body preview

Example tree structure:
```
📁 /api/users
  🔗 [GET] Status 200 • {"users":[...]}
  🔗 [POST] Status 201 • {"id":"{{body.id}}"}
📁 /api/users/:id  
  🔗 [GET] Status 200 • {"id":"{{params.id}}"}
  🔗 [PATCH] Status 200 • {"id":"{{params.id}}"}
```

## Status Bar

The status bar shows:
- **Server Status**: Running/Stopped indicator
- **Port Information**: Current server port when running
- **Click Action**: Click to start/stop server

Examples:
- `🔗 Proxy Mocksy: Running on port 8888` (click to stop)
- `🔗 Proxy Mocksy: Stopped` (click to start)

## Template Variables

Support for dynamic responses using:
- `{{params.name}}` - URL parameters
- `{{query.name}}` - Query string parameters
- `{{body.name}}` - Request body fields

Flexible spacing supported: `{{params.id}}`, `{{ params.id }}`, etc.

## Alternative Deployment Options

For headless or production deployments, consider:

### CLI Alternative
```bash
# Install and run via CLI
npm install -g @proxy-mocksy/cli
proxy-mocksy --config ./proxy-mocksy.config.json --port 8888
```

### Docker Alternative
```bash
# Run in Docker container
docker run -p 8888:80 \
  -v $(pwd)/proxy-mocksy.config.json:/app/config/proxy-mocksy.config.json \
  milancho/proxy-mocksy:latest
```

See [@proxy-mocksy/cli](../cli/README.md) and [@proxy-mocksy/docker](../docker/README.md) for more options.

## Context Awareness & Hot Reload

The extension intelligently adapts to your workspace:
- **Welcome View**: Shows helpful message and "Create Config" button when no configuration exists
- **Dynamic UI**: Start/Stop buttons and commands appear only when configuration file exists
- **File Watching**: Automatically detects configuration file changes and hot-reloads
- **Smart Restart**: Server restarts automatically on config changes (when not manually stopped)
- **Real-time Updates**: Status bar and tree view refresh automatically with server state changes

## Event System

Internal event management for:
- Server status changes
- Configuration file updates
- Tree view refresh triggers
- Status bar updates

## Architecture

### Key Components
- [`EndpointsProvider`](src/tree-view/endpoints-provider.ts) - Tree view data provider and server management
- [`EventManager`](src/event-manager.ts) - Internal event system for status updates
- [`StatusBar`](src/status-bar.ts) - Status bar management utilities
- [`Commands`](src/commands.ts) - Command definitions and constants

### Integration
- Uses `@proxy-mocksy/core` for server logic
- @needle-di/core lightweight dependency injection
- VS Code Extension API integration

## Requirements

- VS Code 1.102.0 or higher
- Node.js (bundled with VS Code)

## Known Issues

- Server restart may take a few seconds on some systems
- Large configuration files may cause brief delays during validation

## Development

```bash
# Build the extension
npm run build

# Watch for changes during development
npm run watch

# Run tests
npm run test
```

## License

LGPL-2.1-only