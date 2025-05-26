import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@km12dev/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}