# @proxy-mocksy/cli

Command-line interface for Proxy Mocksy. Run a local mock server from the terminal with flexible configuration options.

## Installation

```bash
# Install globally
npm install -g @proxy-mocksy/cli

# Or use npx (no installation required)
npx @proxy-mocksy/cli
```

## Usage

```bash
# Specify custom configuration file
proxy-mocksy --config ./proxy-mocksy-config.json

# Use custom config and port
proxy-mocksy --config ./proxy-mocksy-config.json --port 3000

# Show help
proxy-mocksy --help

# Show version
proxy-mocksy --version
```

## CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--config` | `-c` | Path to configuration file | `./proxy-mocksy.config.json` |
| `--port` | `-p` | Port to run server on (overrides config) | From config file or 8888 |
| `--help` | `-h` | Show help information | - |
| `--version` | `-V` | Show version number | - |

## Configuration

Create a `proxy-mocksy.config.json` file in your project root:

```json
{
  "version": "1.0",
  "port": 8888,
  "endpoints": {
    "/api/users": {
      "get": {
        "response": {
          "status": 200,
          "body": [
            {"id": 1, "name": "John Doe"},
            {"id": 2, "name": "Jane Smith"}
          ]
        }
      },
      "post": {
        "response": {
          "status": 201,
          "body": {
            "id": "{{body.id}}",
            "name": "{{body.name}}",
            "message": "User created successfully"
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
      }
    }
  }
}
```

## Template Variables

Use template variables for dynamic responses:

- `{{params.name}}` - URL parameters (e.g., `/users/:id` → `{{params.id}}`)
- `{{query.name}}` - Query parameters (e.g., `?search=term` → `{{query.search}}`)
- `{{body.name}}` - Request body fields (e.g., POST data → `{{body.name}}`)

Template variables support flexible spacing:
- `{{params.id}}`, `{{ params.id }}`, `{{params.id }}`, `{{ params.id}}`

## Examples

### Basic API Mock
```bash
# Create config file
echo '{
  "version": "1.0",
  "port": 3000,
  "endpoints": {
    "/health": {
      "get": {
        "response": {
          "status": 200,
          "body": {"status": "ok"}
        }
      }
    }
  }
}' > api-config.json

# Start server
proxy-mocksy --config api-config.json
```

### Development Workflow
```bash
# Terminal 1: Start mock server
proxy-mocksy --config ./mocks/api.json --port 8080

# Terminal 2: Test endpoints
curl http://localhost:8080/api/users
curl -X POST http://localhost:8080/api/users -H "Content-Type: application/json" -d '{"name":"John"}'
```

## Error Handling

The CLI will exit with appropriate error codes:
- `0` - Success
- `1` - Configuration error (file not found, invalid JSON, etc.)

## Features

- ✅ All HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- ✅ Dynamic template variables in responses
- ✅ Custom configuration file path
- ✅ Port override via command line
- ✅ Comprehensive error handling
- ✅ Cross-platform compatibility

## Requirements

- Node.js 20+ (for Commander.js support)

## Dependencies

- **@proxy-mocksy/core**: Core server logic
- **commander**: CLI argument parsing
- **tsyringe**: Dependency injection
- **reflect-metadata**: Decorator support

## License

[LGPL-2.1-only](../../LICENSE)