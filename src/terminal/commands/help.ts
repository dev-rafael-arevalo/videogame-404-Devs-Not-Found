import type { Command } from './types';

const DESCRIPTIONS: Record<string, string> = {
  help: 'esta ayuda',
  ls: 'lista el directorio',
  cd: 'cambia de directorio (cd .. sube; cd solo vuelve a ~)',
  pwd: 'muestra el directorio actual',
  cat: 'muestra un archivo',
  echo: 'repite el texto',
  clear: 'limpia la pantalla',
  python: 'python --version | python -m venv .venv | python archivo.py',
  pip: 'pip install -r requirements.txt | pip install paquete | pip list',
  source: 'source .venv/bin/activate (activa el entorno virtual)',
};

export const help: Command = (_args, state, allowed) => ({
  output: [
    'Comandos disponibles en este ticket:',
    ...allowed.map((c) => `  ${c.padEnd(8)} ${DESCRIPTIONS[c] ?? ''}`),
    'Tab completa; las flechas arriba y abajo recorren el historial.',
  ],
  state,
});
