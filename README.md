# Proxy Mocksy

A local mock server with VS Code integration and CLI support for accelerated development. Proxy Mocksy allows you to quickly set up mock API endpoints both within VS Code and as a standalone CLI tool, perfect for frontend development, API testing, automation, and prototyping.

## Packages

This is a monorepo containing four packages:

- **[@proxy-mocksy/core](packages/core/README.md)** – Core logic, server management, configuration handling, and shared types
- **[@proxy-mocksy/cli](packages/cli/README.md)** – Command-line interface for running the mock server
- **[@proxy-mocksy/vscode-extension](packages/vscode-extension/README.md)** – VS Code extension for visual management and integration
- **[@proxy-mocksy/docker](packages/docker/README.md)** – Docker containerization for easy deployment

## Features

- 🚀 **Quick Setup**: Start a mock server instantly from VS Code or command line
- 🎯 **Visual Management**: Tree view showing all configured endpoints and methods
- 📝 **JSON Configuration**: Simple JSON-based endpoint configuration
- 🔄 **Hot Reload**: Automatic server restart when configuration changes
- 📊 **Status Integration**: Server status visible in VS Code status bar
- 🎨 **Template Variables**: Dynamic responses using request data
- 🛠️ **Development Focused**: Built for both interactive and headless workflows
- 💻 **CLI Support**: Run as standalone tool for automation and CI/CD
- 🐳 **Docker Ready**: Containerized deployment for consistency across environments

## Quick Start

### CLI
```bash
# Install globally
npm install -g @proxy-mocksy/cli

# Run with default config
proxy-mocksy

# Or with custom config and port
proxy-mocksy --config ./proxy-mocksy-config.json --port 3000

# Or use npx (no installation required)
npx @proxy/mocksy/cli --config ./proxy-mocksy-config.json --port 3000
```

### Docker
```bash
# Pull and run with your config
docker pull milancho/proxy-mocksy:latest

docker run -p 8888:80 \
  -v $(pwd)/proxy-mocksy.config.json:/app/config/proxy-mocksy.config.json \
  milancho/proxy-mocksy:latest

# Your mock server is now running at http://localhost:8888
```

### VS Code Extension
1. Install the extension (not yet published)
2. Open a workspace folder
3. Use the Proxy Mocksy activity bar panel to manage your mock server

## Documentation

For detailed usage instructions, see the individual package READMEs:

- [Core Package Documentation](packages/core/README.md)
- [CLI Package Documentation](packages/cli/README.md)
- [VS Code Extension Documentation](packages/vscode-extension/README.md)
- [Docker Package Documentation](packages/docker/README.md)

## Development

This project uses:
- **TypeScript** for type safety
- **Turborepo** for monorepo management
- **TSyringe** for dependency injection
- **Koa.js** for the HTTP server
- **Docker** for containerization

### Building
```bash
npm run build:all
```

### Running CLI in development
```bash
npm run cli:start:withExample
```

### Docker Tasks
```bash
# Build Docker image
turbo run docker:build --filter=@proxy-mocksy/docker

# Start container with example config
turbo run docker:startWithExample --filter=@proxy-mocksy/docker
```

## License

LGPL-2.1-only

## Contributing

See individual package READMEs for development setup and contribution guidelines.

---

**Happy Mocking!** 🎭