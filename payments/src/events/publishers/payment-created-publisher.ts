import { Subjects, Publisher, PaymentCreatedEvent } from "@saltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
   readonly subject = Subjects.PaymentCreated
}