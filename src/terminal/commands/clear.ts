import type { Command } from './types';

export const clear: Command = (_args, state) => ({ output: [], state, clear: true });
