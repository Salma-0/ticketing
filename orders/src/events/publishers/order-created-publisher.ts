import { Publisher, OrderCreatedEvent, Subjects } from "@saltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

}