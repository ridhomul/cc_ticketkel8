import { Subjects, Publisher, PaymentCreatedEvent } from "@km12dev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}