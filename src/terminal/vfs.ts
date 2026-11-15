/** Sistema de archivos virtual en memoria (spec 009). Inmutable y sin Phaser. */

export const HOME = '/home/dev';

export interface Vfs {
  cwd: string;
  files: Readonly<Record<string, string>>;
  /** Directorios explícitos (además de los que se deducen de los archivos). */
  dirs: readonly string[];
}

export function resolvePath(cwd: string, input: string): string {
  let path = input;
  if (path === '~' || path.startsWith('~/')) path = HOME + path.slice(1);
  const base = path.startsWith('/') ? [] : cwd.split('/').filter((p) => p.length > 0);
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') base.pop();
    else base.push(part);
  }
  return `/${base.join('/')}`;
}

export function shortPath(path: string): string {
  if (path === HOME) return '~';
  if (path.startsWith(`${HOME}/`)) return `~${path.slice(HOME.length)}`;
  return path;
}

function parentDirs(path: string): string[] {
  const parts = path.split('/').filter((p) => p.length > 0);
  const out: string[] = [];
  for (let i = 1; i < parts.length; i += 1) out.push(`/${parts.slice(0, i).join('/')}`);
  return out;
}

export function createVfs(files: Record<string, string>, cwd: string): Vfs {
  return { cwd, files: { ...files }, dirs: [...new Set([cwd, ...Object.keys(files).flatMap(parentDirs)])] };
}

export function allDirs(vfs: Vfs): Set<string> {
  const dirs = new Set<string>(['/', ...vfs.dirs]);
  for (const dir of vfs.dirs) parentDirs(dir).forEach((d) => dirs.add(d));
  for (const file of Object.keys(vfs.files)) parentDirs(file).forEach((d) => dirs.add(d));
  return dirs;
}

export function isDir(vfs: Vfs, path: string): boolean {
  return allDirs(vfs).has(path);
}

export function exists(vfs: Vfs, path: string): boolean {
  return isDir(vfs, path) || path in vfs.files;
}

export function readFile(vfs: Vfs, path: string): string | null {
  return vfs.files[path] ?? null;
}

/** Entradas de un directorio: subdirectorios con `/` primero y luego archivos, cada grupo ordenado. `null` si no es un directorio. */
export function listDir(vfs: Vfs, path: string): string[] | null {
  if (!isDir(vfs, path)) return null;
  const prefix = path === '/' ? '/' : `${path}/`;
  const dirs = new Set<string>();
  const files: string[] = [];
  for (const dir of allDirs(vfs)) {
    if (dir !== path && dir.startsWith(prefix) && !dir.slice(prefix.length).includes('/')) dirs.add(`${dir.slice(prefix.length)}/`);
  }
  for (const file of Object.keys(vfs.files)) {
    if (file.startsWith(prefix) && !file.slice(prefix.length).includes('/')) files.push(file.slice(prefix.length));
  }
  return [...[...dirs].sort(), ...files.sort()];
}

export function mkdir(vfs: Vfs, path: string): Vfs {
  return { ...vfs, dirs: [...new Set([...vfs.dirs, path])] };
}

export function writeFile(vfs: Vfs, path: string, content: string): Vfs {
  return { ...vfs, files: { ...vfs.files, [path]: content } };
}

export function chdir(vfs: Vfs, path: string): Vfs {
  return { ...vfs, cwd: path };
}
