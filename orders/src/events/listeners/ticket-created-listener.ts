import { Subjects , Listener, TicketCreatedEvent} from '@saltickets/common'
import {Message} from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    readonly queueGroupName = queueGroupName
    
    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        try {
            const {id: _id, title, price} = data
            const ticket = Ticket.build({_id, title, price})
            await ticket.save()
            msg.ack()
        } catch (err) {
            
        }
    }
}