# Docker Setup for Bank Client (React Frontend)

This document provides specific instructions for the React frontend component of the Bank Application.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+ (if using with full stack)

## Building the Image

### Development Build
```bash
docker build -t bank-client:dev .
```

### Production Build
```bash
docker build -t bank-client:latest --target production .
```

## Running the Container

### Standalone (Development)
```bash
docker run -p 3000:80 \
  -e REACT_APP_API_URL=http://localhost:4000/bank \
  bank-client:latest
```

### With Docker Compose
See the main README-Docker.md in the bank-server repository for full stack setup.

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:4000/bank` | Yes |

**Note:** Environment variables must be prefixed with `REACT_APP_` to be available in the React application.

## Configuration

### API Connection
The client connects to the backend API using the `REACT_APP_API_URL` environment variable. This should point to your bank-server instance:

- **Local development:** `http://localhost:4000/bank`
- **Docker Compose:** `http://localhost:4000/bank`
- **Production:** `https://your-api-domain.com/bank`

### Nginx Configuration
The production image uses nginx to serve static files with:
- Gzip compression
- Security headers
- Client-side routing support
- Static asset caching
- HTML caching

## Multi-stage Build Details

### Stage 1: Builder
- Uses Node.js 16 Alpine
- Installs dependencies with yarn
- Builds the React application
- Outputs to `/app/build`

### Stage 2: Production
- Uses nginx Alpine
- Copies built files from builder stage
- Configures nginx for SPA routing
- Runs as non-root user (nginx)
- Exposes port 80

## Security Features

- **Non-root user:** Container runs as nginx user
- **Security headers:** X-Frame-Options, X-XSS-Protection, etc.
- **Content Security Policy:** Restricts resource loading
- **Minimal base image:** Alpine Linux for smaller attack surface

## Health Checks

The container includes a health check that:
- Runs every 30 seconds
- Checks if nginx is serving content
- Has a 3-second timeout
- Retries 3 times before marking unhealthy

## Troubleshooting

### Common Issues

1. **API connection errors:**
   - Verify `REACT_APP_API_URL` is set correctly
   - Ensure backend server is accessible
   - Check network connectivity between containers

2. **Build failures:**
   - Ensure all dependencies are in package.json
   - Check for syntax errors in source code
   - Verify Node.js version compatibility

3. **Routing issues:**
   - nginx is configured for client-side routing
   - All routes should serve index.html
   - Check nginx configuration if custom routes needed

4. **Static asset loading:**
   - Assets are cached for 1 year
   - HTML files cached for 1 hour
   - Clear browser cache if assets not updating

### Debugging Commands

```bash
# View container logs
docker logs bank-client

# Execute shell in running container
docker exec -it bank-client sh

# Check nginx configuration
docker exec bank-client nginx -t

# View nginx access logs
docker exec bank-client tail -f /var/log/nginx/access.log

# View nginx error logs
docker exec bank-client tail -f /var/log/nginx/error.log
```

## Performance Optimization

The Docker image includes several optimizations:

1. **Multi-stage build:** Reduces final image size
2. **Gzip compression:** Reduces bandwidth usage
3. **Static asset caching:** Improves load times
4. **Webpack optimization:** Code splitting and minification
5. **Alpine base image:** Smaller image size

## Development Workflow

For development with hot reloading, you may want to:

1. **Mount source code as volume:**
   ```bash
   docker run -p 3000:80 \
     -v $(pwd)/app:/app/app:ro \
     -e REACT_APP_API_URL=http://localhost:4000/bank \
     bank-client:dev
   ```

2. **Use development server instead:**
   ```bash
   # Run locally with yarn
   yarn start
   ```

## Production Deployment

For production deployment:

1. **Build production image:**
   ```bash
   docker build -t bank-client:prod --target production .
   ```

2. **Set production API URL:**
   ```bash
   docker run -p 80:80 \
     -e REACT_APP_API_URL=https://api.yourdomain.com/bank \
     bank-client:prod
   ```

3. **Consider using reverse proxy** (nginx, Traefik) for:
   - SSL termination
   - Load balancing
   - Rate limiting
   - Additional security headers
