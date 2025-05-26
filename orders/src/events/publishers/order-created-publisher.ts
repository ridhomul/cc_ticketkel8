import { Publisher, Subjects, OrderCreatedEvent } from "@km12dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}