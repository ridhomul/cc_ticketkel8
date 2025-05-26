import { Publisher, Subjects, OrderCancelledEvent } from "@km12dev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
