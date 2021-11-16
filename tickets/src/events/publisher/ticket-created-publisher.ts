import { Publisher, Subjects, TicketCreatedEvent } from "@saltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
}