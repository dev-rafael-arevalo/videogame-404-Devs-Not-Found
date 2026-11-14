import type { Command } from './types';

export const echo: Command = (args, state) => ({ output: [args.join(' ')], state });
