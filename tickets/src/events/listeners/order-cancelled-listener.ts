import { Listener, OrderCancelledEvent, Subjects } from "@saltickets/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming'
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
    readonly queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
       //find ticket
       const ticket = await Ticket.findById(data.ticket.id)

       if(!ticket){
           throw new Error('Ticket not found')
       }
       //unreserve ticket by unsetting order id
        ticket.set({orderId: undefined})

       //save ticket updates
       await ticket.save()


       //emit ticket:updated event
        new TicketUpdatedPublisher(this.client).publish({
           id: ticket.id,
           orderId: ticket.orderId,
           userId: ticket.userId,
           price: ticket.price,
           title: ticket.title,
           version: ticket.version
       })

       //ack the message

       msg.ack()

    }


}
