# Changelog

## [Unreleased]

### Added
- Local mock server with configurable endpoints
- VS Code activity bar view for endpoint management
- Tree view displaying configured endpoints with HTTP methods
- Status bar integration showing server status and port
- Commands for starting/stopping the mock server
- Configuration file support (`proxy-mocksy.config.json`)
- Output channel for server logs and debugging
- Dynamic response body parsing with template variables
- Flexible HTTP method support (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- Customizable response status codes and headers
- CLI support with Commander.js for headless operation
- CLI options for custom config path (`--config`) and port (`--port`)
- Dual-mode operation: VS Code extension and standalone CLI
- Example configuration files with comprehensive endpoint examples
- Context-aware UI (buttons only show when configuration exists)
- App configuration system to distinguish between CLI and extension modes
- Port override functionality for CLI usage
- Example endpoints for `/example` and `/example/:id` with all major HTTP methods
- Support for PATCH and DELETE with dynamic and static responses
- Improved template variable usage with flexible spacing (e.g., `{{ body.field }}`, `{{ params.id }}`)

### Features
- Server management with single-click start/stop
- JSON-based configuration with hot-reload
- Template variables for dynamic responses
- Native VS Code integration
- CLI usage for headless/local development and automation
- Cross-platform executable via npm bin