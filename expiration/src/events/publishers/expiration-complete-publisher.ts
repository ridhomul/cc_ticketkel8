import { Subjects, Publisher, ExpirationCompleteEvent } from "@km12dev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}