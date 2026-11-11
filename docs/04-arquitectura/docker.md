# Implementación en Docker

**Desarrollo:** local con `npm run dev` (Vite y recarga en caliente). Docker no hace falta para
programar, y con OneDrive y bind mounts la detección de cambios de archivos falla.
**Pruebas de producción y deploy:** Docker.

Estos archivos se crean en la raíz durante la spec 001. Se dejan acá como plantilla.

## `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1

# --- Etapa 1: build ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Etapa 2: servir (sin root, puerto 8080) ---
# Fijar un tag concreto al implementar (por ejemplo, 1.x.y-alpine)
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
```

## `nginx.conf`

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;

    # Las cabeceras se declaran solo aquí: si un location define su propio add_header, pierde estas.
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Los assets con hash de Vite y el audio se pueden cachear (expires no anula las add_header)
    location /assets/ {
        expires 7d;
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

## `docker-compose.yml`

```yaml
services:
  game:
    build: .
    image: sysrestore:local
    ports:
      - "8080:8080"
    read_only: true
    tmpfs:
      - /tmp          # nginx sin privilegios escribe ahí el pid y sus temporales
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    restart: unless-stopped
```

## `.dockerignore`

```
node_modules
dist
.git
.github
.claude
assets-src
docs
specs
tests
*.md
.env*
playwright-report
test-results
```

## Uso

```bash
docker compose up --build        # http://localhost:8080
docker compose down
docker build -t sysrestore:local . && docker run --rm -p 8080:8080 sysrestore:local
```

## Verificación (criterio de la spec 001)

1. `docker compose up --build` termina sin errores y el healthcheck queda en `healthy`.
2. http://localhost:8080 carga el juego y la consola del navegador no muestra violaciones de CSP.
3. `docker compose exec game id` muestra el UID 101, no root.
4. `curl -I http://localhost:8080` incluye las cabeceras CSP, `nosniff` y `Referrer-Policy`.
