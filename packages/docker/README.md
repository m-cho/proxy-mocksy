# Proxy Mocksy

A lightweight local mock server perfect for frontend development, API testing, and prototyping. Quickly set up mock API endpoints with JSON configuration and dynamic response templates.

## Features

- 🚀 **Quick Setup**: Start mocking APIs in seconds
- 📝 **JSON Configuration**: Simple endpoint configuration
- 🎨 **Template Variables**: Dynamic responses using request data
- 🔄 **All HTTP Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- 💻 **Lightweight**: Based on Node.js and Koa.js
- 🐳 **Docker Ready**: Easy deployment and consistency across environments

## Quick Start

### Docker Run

```bash
# Pull the latest image
docker pull milancho/proxy-mocksy:latest

# Run with your config file
docker run -p 8888:80 \
  -v $(pwd)/proxy-mocksy.config.json:/app/config/proxy-mocksy.config.json \
  milancho/proxy-mocksy:latest

# Your mock server is now running at http://localhost:8888
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  proxy-mocksy:
    image: milancho/proxy-mocksy:latest
    container_name: proxy-mocksy-server
    ports:
      - "8888:80"
    volumes:
      - ./proxy-mocksy.config.json:/app/config/proxy-mocksy.config.json
```

Then run:

```bash
# Start the service
docker compose up -d

# View logs
docker compose logs -f

# Stop the service
docker compose down
```

## Configuration Example

```json
{
  "version": "1.0",
  "port": 80,
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

## Links

- **GitHub**: [proxy-mocksy](https://github.com/yourusername/proxy-mocksy)
- **CLI Package**: [@proxy-mocksy/cli](https://www.npmjs.com/package/@proxy-mocksy/cli)
