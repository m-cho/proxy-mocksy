# Changelog

## [Unreleased]

### Added
- **JSON Schema Validation**: Full schema support for `proxy-mocksy.config.json` with IntelliSense and validation
- **Config File Watching**: Automatic detection of configuration changes with hot-reload
- **Welcome View**: Helpful interface when no configuration exists with "Create Config" button
- **Config Creation**: Automatic config file creation through UI commands
- **Smart Context Management**: Context keys properly synchronized between extension and package.json

### VS Code Extension Features
- **JSON Schema**: Auto-completion, validation, and inline documentation for configuration files
- **File Watcher**: Real-time config file monitoring with intelligent server restart logic
- **Welcome Interface**: Shows helpful message and config creation option when no config exists
- **Context Awareness**: UI elements appear/disappear based on configuration file presence
- **Hot Reload**: Server automatically restarts on configuration changes (when not manually stopped)

### Core Package Features
- **Config Creation**: New `createConfig()` method in `ConfigManipulator` for generating default configurations
- **Enhanced Type Safety**: Improved TypeScript types for configuration structure

## [0.0.7] - 2025-08-12

### Added
- **Docker Package**: Containerized deployment with Docker Hub publishing
- **Docker Support**: Multi-stage Dockerfile for optimized production builds
- **Container Integration**: Volume mounting for configuration files
- **Turborepo Docker Tasks**: Build, publish, and run tasks for Docker workflow
- **Package-specific Docker documentation**: Individual README for Docker package

### Docker Features
- **Multi-stage Build**: Optimized Docker image with builder and runner stages
- **Volume Support**: Mount configuration files at runtime
- **Port Configuration**: Flexible port mapping (default: 80 in container, 8888 on host)
- **Docker Hub Ready**: Published as `milancho/proxy-mocksy` with versioned tags
- **Docker Compose Support**: Easy orchestration with compose files

## [0.0.5] - 2025-08-10

### Added
- **Monorepo Architecture**: Split project into three packages (`@proxy-mocksy/core`, `@proxy-mocksy/cli`, `@proxy-mocksy/vscode-extension`)
- **Core Package**: Shared logic for server management, configuration, and dependency injection
- **CLI Package**: Standalone command-line tool with Commander.js integration
- **VS Code Extension Package**: Visual interface with activity bar, tree view, and status bar integration
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
- **Package-specific documentation**: Individual README files for each package
- **Turborepo integration**: Build system and workspace management
- **TypeScript project references**: Proper dependency resolution between packages

### Architecture
- **@proxy-mocksy/core**: Koa server, config manipulation, logger, response parsing, DI container
- **@proxy-mocksy/cli**: Commander.js CLI with config and port options
- **@proxy-mocksy/vscode-extension**: Tree view provider, status bar, commands, event management
- **@proxy-mocksy/docker**: Multi-stage Docker build with optimized production runtime

### Features
- Server management with single-click start/stop
- JSON-based configuration with hot-reload capability
- Template variables for dynamic responses based on request data
- Native VS Code integration with visual management
- CLI usage for headless/local development and automation workflows
- Cross-platform executable via npm bin configuration
- Dependency injection architecture for extensibility
- Docker containerization for consistent deployment across environments
- Volume-mounted configuration for flexible Docker usage