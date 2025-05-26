import { Publisher, Subjects, TicketCreatedEvent } from "@km12dev/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}