import { validateTicket, type TicketDef } from '../../logic/tickets';
import actos from '../actos.json';

/** Todos los tickets de `src/data/tickets/*.json`, validados al cargar. */
const modules = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

export const TICKETS: Readonly<Record<string, TicketDef>> = Object.fromEntries(
  Object.entries(modules).map(([path, raw]) => {
    const errors = validateTicket(raw);
    if (errors.length > 0) throw new Error(`Ticket inválido en ${path}: ${errors.join(', ')}`);
    const ticket = raw as TicketDef;
    return [ticket.id, ticket];
  }),
);

export function getTicket(id: string): TicketDef {
  const ticket = TICKETS[id];
  if (!ticket) throw new Error(`No existe el ticket ${id}`);
  return ticket;
}

/** Orden de tickets de un acto según `actos.json`. */
export function ticketOrder(acto: number): string[] {
  return actos.actos.find((a) => a.numero === acto)?.tickets ?? [];
}
