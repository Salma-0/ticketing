import { Publisher, Subjects, TicketUpdatedEvent } from "@saltickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated
}


