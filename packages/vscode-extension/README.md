# @proxy-mocksy/vscode-extension

VS Code extension for Proxy Mocksy. Provides visual management of mock API endpoints directly within VS Code with tree view, status bar integration, and command palette support.

## Features

### Visual Interface
- **Activity Bar Panel**: Dedicated Proxy Mocksy section in VS Code activity bar
- **Tree View**: Hierarchical display of endpoints organized by path and HTTP method
- **Status Bar**: Real-time server status and port information
- **Output Channel**: Server logs and debugging information

### Commands
- **Start/Stop Server**: One-click server management
- **Refresh Endpoints**: Reload configuration and restart server
- **Open Config**: Quick access to configuration file
- **Show Output**: View server logs and debug information

### Smart Context
- Buttons and commands only appear when configuration file exists
- Real-time status updates when server state changes
- Auto-detection of workspace configuration files

## Installation

*Note: This extension is not yet published to the VS Code marketplace.*

For development/testing:
1. Clone the repository
2. Open in VS Code
3. Press `F5` to run the extension in a new Extension Development Host window

## Getting Started

1. **Open Workspace**: Open any folder in VS Code as your workspace
2. **Create Configuration**: The extension will look for `proxy-mocksy.config.json` in your workspace root
3. **Manage Server**: Use the Proxy Mocksy activity bar panel to start/stop the server
4. **View Endpoints**: Browse your configured endpoints in the tree view

## Configuration

Create a `proxy-mocksy.config.json` file in your workspace root:

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

## Commands

All commands are available via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Proxy Mocksy: Start Server` | Start the mock server |
| `Proxy Mocksy: Stop Server` | Stop the mock server |
| `Proxy Mocksy: Refresh Mocked Endpoints` | Reload configuration and restart server |
| `Proxy Mocksy: Show Output` | Open the output channel with server logs |
| `Proxy Mocksy: Open Config` | Open the configuration file for editing |

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

## Context Awareness

The extension intelligently shows/hides UI elements:
- **Start/Stop buttons**: Only visible when configuration file exists
- **Config commands**: Only available when configuration is present
- **Status updates**: Real-time server state reflection

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
- TSyringe dependency injection
- VS Code Extension API integration

## Requirements

- VS Code 1.102.0 or higher
- Node.js (bundled with VS Code)

## Known Issues

- Configuration changes require manual refresh using the refresh button
- Server restart may take a few seconds on some systems

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