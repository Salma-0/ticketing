import { Publisher, OrderCancelledEvent, Subjects } from "@saltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}