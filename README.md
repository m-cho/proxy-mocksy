# Proxy Mocksy

A local mock server with VS Code integration and CLI support for accelerated development. Proxy Mocksy allows you to quickly set up mock API endpoints both within VS Code and as a standalone CLI tool, perfect for frontend development, API testing, automation, and prototyping.

## Features

- 🚀 **Quick Setup**: Start a mock server instantly from VS Code or command line
- 🎯 **Visual Management**: Tree view showing all configured endpoints and methods
- 📝 **JSON Configuration**: Simple JSON-based endpoint configuration
- 🔄 **Hot Reload**: Automatic server restart when configuration changes
- 📊 **Status Integration**: Server status visible in VS Code status bar
- 🎨 **Template Variables**: Dynamic responses using request data
- 🛠️ **Development Focused**: Built for both interactive and headless workflows
- 💻 **CLI Support**: Run as standalone tool for automation and CI/CD

### Visual Interface (VS Code Extension)

- **Activity Bar Integration**: Dedicated Proxy Mocksy panel in the activity bar
- **Tree View**: Organized display of endpoints grouped by path and HTTP method
- **Status Bar**: Real-time server status and port information
- **Command Palette**: All commands accessible via `Ctrl+Shift+P`

### Supported HTTP Methods

- GET, POST, PUT, PATCH, DELETE, OPTIONS

## Getting Started

### CLI Usage
```bash
# Install globally
npm install -g @proxy-mocksy/cli

# Or run it using using npx
npx @proxy-mocksy/cli

# CLI options
proxy-mocksy --config ./proxy-mocksy-config.json
proxy-mocksy --config ./proxy-mocksy-config.json --port 3000
proxy-mocksy --help
```

**CLI Options:**
- `-c, --config <path>`: Path to configuration file (default: `./proxy-mocksy.config.json`)
- `-p, --port <number>`: Port to run the server on (overrides config file)
- `-h, --help`: Show help information
- `-V, --version`: Show version number


### VS Code Extension (_It's not published yet_)
1. **Install the Extension**: Install Proxy Mocksy from the VS Code marketplace
2. **Open Your Project**: Open any workspace folder in VS Code
3. **Start the Server**: Click the play button in the Proxy Mocksy activity bar panel
4. **Configure Endpoints**: A `proxy-mocksy.config.json` file will be created automatically

## Configuration

Both the VS Code extension and CLI use a `proxy-mocksy.config.json` file:

```json
{
  "version": "1.0",
  "port": 8888,
  "endpoints": {
    "/example": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "message": "This is a mock response"
          }
        }
      },
      "post": {
        "response": {
          "status": 201,
          "body": {
            "message": "Resource created successfully"
          }
        }
      },
      "put": {
        "response": {
          "status": 200,
          "body": {
            "message": "This is big mock response with a lot of details",
            "details": {
              "id": 12345,
              "name": "Sample Item",
              "description": "This item is a sample for testing purposes.",
              "attributes": {
                "color": "blue",
                "size": "large",
                "tags": ["mock", "test", "example"]
              },
              "created_at": "2023-10-01T12:00:00Z",
              "updated_at": "2023-10-01T12:00:00Z"
            }
          }
        }
      }
    },
    "/example/:id": {
      "get": {
        "response": {
          "status": 200,
          "body": {
            "message": "Resource details for ID {{params.id}}",
            "id": "{{params.id}}"
          }
        }
      },
      "patch": {
        "response": {
          "status": 200,
          "body": {
            "message": "Field {{ body.field }} of resource with ID {{ params.id }} updated successfully"
          }
        }
      },
      "delete": {
        "response": {
          "status": 204
        }
      }
    }
  }
}
```

## Template Variables

Use template variables in your response bodies to create dynamic responses:

- `{{params.paramName}}` - URL parameters (e.g., `/example/:id` → `{{params.id}}`)
- `{{query.queryName}}` - Query string parameters (e.g., `?search=term` → `{{query.search}}`)
- `{{body.fieldName}}` - Request body fields (e.g., POST data → `{{body.name}}`)

**Flexible spacing**: Template variables support flexible spacing:
- `{{params.id}}` - no spaces
- `{{ params.id }}` - spaces around content
- `{{params.id }}` - space after
- `{{ params.id}}` - space before

## Commands

All commands are available through the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Proxy Mocksy: Start Server** - Start the mock server
- **Proxy Mocksy: Stop Server** - Stop the mock server  
- **Proxy Mocksy: Refresh Mocked Endpoints** - Reload configuration and restart server
- **Proxy Mocksy: Show Output** - Show server logs and debug information
- **Proxy Mocksy: Open Config** - Open the configuration file for editing

## Usage Examples

### Basic Example Endpoint
```json
{
  "/example": {
    "get": {
      "response": {
        "status": 200,
        "body": {
          "message": "This is a mock response"
        }
      }
    }
  }
}
```

### Dynamic Path and PATCH/DELETE Example
```json
{
  "/example/:id": {
    "get": {
      "response": {
        "status": 200,
        "body": {
          "message": "Resource details for ID {{params.id}}",
          "id": "{{params.id}}"
        }
      }
    },
    "patch": {
      "response": {
        "status": 200,
        "body": {
          "message": "Field {{ body.field }} of resource with ID {{ params.id }} updated successfully"
        }
      }
    },
    "delete": {
      "response": {
        "status": 204
      }
    }
  }
}
```

### CLI Usage Example
```bash
# Start with custom config
proxy-mocksy --config ./api-mocks.json --port 3000

# Start with custom config and port
proxy-mocksy --config ./api-mocks.json --port 3000

# Use default config file (proxy-mocksy.config.json)
proxy-mocksy
```

## Requirements

**VS Code Extension:**
- VS Code 1.102.0 or higher
- Node.js (bundled with VS Code)

**CLI:**
- Node.js 20+ (for Commander.js support)
- npm or yarn for installation

## Extension Settings

This extension doesn't add any VS Code settings through the configuration extension point. All configuration is done through the `proxy-mocksy.config.json` file.

## Known Issues

- Configuration changes require manual refresh using the refresh button (VS Code extension)
- Server restart may take a few seconds on some systems
- CLI mode doesn't support hot-reload (restart required for config changes)

---

## Development and Contributing

This project is built with TypeScript and uses:
- **Koa.js** for the HTTP server
- **TSyringe** for dependency injection  
- **VS Code Extension API** for editor integration
- **Commander.js** for CLI argument parsing
- **Dual-mode architecture** supporting both extension and CLI operation

## Credits

- Extension logo and icons generated using AI
- Built with love for the development community

## Support

For issues, feature requests, or contributions, please visit our repository.

**Happy Mocking!** 🎭