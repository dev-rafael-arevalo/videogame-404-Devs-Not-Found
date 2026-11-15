import type { Command } from './types';

export const pwd: Command = (_args, state) => ({ output: [state.vfs.cwd], state });
