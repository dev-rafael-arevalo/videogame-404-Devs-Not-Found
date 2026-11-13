/** Eventos de `game.events` con los que las escenas se coordinan (spec 004). */
export const EV = {
  dialogClosed: 'dialog:closed',
  briefingAccept: 'briefing:accept',
  briefingBack: 'briefing:back',
  ticketDone: 'ticket:done',
  ticketFailed: 'ticket:failed',
  ticketAbandoned: 'ticket:abandoned',
  resultClosed: 'result:closed',
  rollbackRetry: 'rollback:retry',
  rollbackBack: 'rollback:back',
} as const;

export interface TicketDonePayload {
  ticketId: string;
  elapsedMs: number;
}

export interface TicketIdPayload {
  ticketId: string;
}
