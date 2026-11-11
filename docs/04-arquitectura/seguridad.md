# Seguridad

Una web estática sin backend tiene poca superficie de ataque. Estos son los puntos que importan, ordenados por relevancia.

## 1. La terminal nunca ejecuta nada real (crítico)

- Los comandos que se escriben en el juego se interpretan contra un **registro fijo** de funciones TypeScript (`src/terminal/commands/`). Lo que no está registrado responde "comando no encontrado".
- **Prohibido:** `eval`, `new Function`, `setTimeout(string)` y `innerHTML` con texto que haya escrito quien juega.
- La salida se renderiza con `textContent` o como texto del canvas.
- Las líneas de entrada tienen un límite de 256 caracteres y el historial uno de 100 entradas.
- **Si en el futuro se usa Python real (Pyodide):** solo en el navegador, dentro de un **Web Worker**, con timeout (por ejemplo, 5 s, y después `worker.terminate()`), sin acceso a red y sirviendo Pyodide desde `/assets` (no desde un CDN). Nunca se ejecuta Python en un servidor.

## 2. Content Security Policy y cabeceras (nginx)

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self';
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
```
- `data:` en `img-src` hace falta porque Phaser genera texturas internas desde data URIs.
- Con Pyodide habría que agregar `'wasm-unsafe-eval'` a `script-src`, y solo en ese caso.
- Todos los recursos son locales: sin CDN, fuentes de Google, analítica ni terceros.

## 3. Contenedor

- Imagen base **nginx sin privilegios** (corre como el UID 101 y escucha en el puerto 8080, sin root).
- **Multi-stage:** la imagen final no lleva Node, `node_modules` ni código fuente, solo `dist/`.
- En compose: `read_only: true`, `tmpfs: /tmp`, `cap_drop: [ALL]` y `no-new-privileges`.
- Versiones de imagen **fijadas** (tag concreto; idealmente con digest en producción).
- `.dockerignore` excluye `.git`, `node_modules`, `assets-src`, `docs` y `.env`.
- `server_tokens off` en nginx.

## 4. Dependencias (cadena de suministro)

- `package-lock.json` versionado e instalación con `npm ci` en Docker y en CI.
- Pocas dependencias: `phaser` en runtime; Vite, TypeScript, Vitest, Playwright y ESLint en desarrollo.
- `npm audit --audit-level=high` en CI y **Dependabot** activado en GitHub.
- MCP en `.mcp.json`: se usan con `@latest` mientras se prueba; fijar una versión exacta cuando el flujo funcione.

## 5. Guardado local

- `localStorage` solo guarda progreso y opciones, nunca datos personales.
- Al cargar: `JSON.parse` dentro de `try/catch`, validar la forma y la versión, y descartar con aviso lo que sea inválido. Quien juega puede editarlo, y no pasa nada: no hay competencia ni dinero de por medio.

## 6. Repositorio

- Sin secretos en el repositorio: `.env` en `.gitignore` (hoy no hace falta ninguno).
- Assets de terceros solo con licencia compatible, registrada en `CREDITOS.md`.

## Checklist de revisión de seguridad (por PR)

- [ ] Nada de `eval`, `Function` ni `innerHTML` con entrada de quien juega
- [ ] Ningún recurso externo nuevo que rompa la CSP
- [ ] Dependencias nuevas justificadas en la spec
- [ ] Cambios en Dockerfile o nginx revisados contra este documento
