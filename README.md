# Proxy Mocksy

A local mock server and flexible request proxy for accelerated development. Proxy Mocksy allows you to quickly set up mock API endpoints directly within VS Code, perfect for frontend development, API testing, and prototyping.

## Features

- 🚀 **Quick Setup**: Start a mock server instantly from VS Code
- 🎯 **Visual Management**: Tree view showing all configured endpoints and methods
- 📝 **JSON Configuration**: Simple JSON-based endpoint configuration
- 🔄 **Hot Reload**: Automatic server restart when configuration changes
- 📊 **Status Integration**: Server status visible in VS Code status bar
- 🎨 **Template Variables**: Dynamic responses using request data
- 🛠️ **Development Focused**: Built specifically for development workflows

### Visual Interface

- **Activity Bar Integration**: Dedicated Proxy Mocksy panel in the activity bar
- **Tree View**: Organized display of endpoints grouped by path and HTTP method
- **Status Bar**: Real-time server status and port information
- **Command Palette**: All commands accessible via `Ctrl+Shift+P`

### Supported HTTP Methods

- GET, POST, PUT, DELETE, PATCH, OPTIONS

## Getting Started

1. **Install the Extension**: Install Proxy Mocksy from the VS Code marketplace
2. **Open Your Project**: Open any workspace folder in VS Code
3. **Start the Server**: Click the play button in the Proxy Mocksy activity bar panel
4. **Configure Endpoints**: A `proxy-mocksy.config.json` file will be created automatically

## Configuration

The extension uses a `proxy-mocksy.config.json` file in your workspace root:

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
            "name": "John Doe",
            "email": "john@example.com"
          },
          "headers": {
            "Content-Type": "application/json"
          }
        }
      }
    },
    "/api/users": {
      "post": {
        "response": {
          "status": 201,
          "body": {
            "id": 123,
            "name": "{{body.name}}",
            "created": true
          }
        }
      }
    }
  }
}
```

## Template Variables

Use template variables in your response bodies to create dynamic responses:

- `{{params.paramName}}` - URL parameters (e.g., `/users/:id` → `{{params.id}}`)
- `{{query.queryName}}` - Query string parameters (e.g., `?search=term` → `{{query.search}}`)
- `{{body.fieldName}}` - Request body fields (e.g., POST data → `{{body.name}}`)

## Commands

All commands are available through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Proxy Mocksy: Start Server** - Start the mock server
- **Proxy Mocksy: Stop Server** - Stop the mock server  
- **Proxy Mocksy: Refresh Mocked Endpoints** - Reload configuration and restart server
- **Proxy Mocksy: Show Output** - Show server logs and debug information
- **Proxy Mocksy: Open Config** - Open the configuration file for editing

## Usage Examples

### Basic API Mock
```json
{
  "version": "1.0",
  "port": 8888,
  "endpoints": {
    "/api/status": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "status": "OK",
            "timestamp": "2024-01-01T00:00:00Z"
          }
        }
      }
    }
  }
}
```

### Dynamic User API
```json
{
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
```

## Requirements

- VS Code 1.102.0 or higher
- Node.js (bundled with VS Code)

## Extension Settings

This extension doesn't add any VS Code settings through the configuration extension point. All configuration is done through the `proxy-mocksy.config.json` file.

## Known Issues

- Configuration changes require manual refresh using the refresh button
- Server restart may take a few seconds on some systems

---

## Development and Contributing

This extension is built with TypeScript and uses:
- **Koa.js** for the HTTP server
- **TSyringe** for dependency injection
- **VS Code Extension API** for editor integration

## Credits

- Extension logo and icons generated using AI
- Built with love for the development community

## Support

For issues, feature requests, or contributions, please visit our repository.

**Happy Mocking!** 🎭