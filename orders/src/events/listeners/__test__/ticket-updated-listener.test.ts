import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import {TicketUpdatedEvent} from '@saltickets/common'
import {Message} from 'node-nats-streaming'


const setup = async () => {
    //create listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //create and save ticket
    const _id = new mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        _id,
        title: 'concert',
        price: 20
    })

    await ticket.save()

    //create a fake data object
     const data : TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: _id,
        title: 'concert updated',
        price: 40,
        userId: new mongoose.Types.ObjectId().toHexString()
     }


    //create msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all the stuff

    return {msg, data, ticket, listener}
}


it('finds, updates, and saves a ticket', async ()=> {
    const {msg, data, ticket, listener} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket).toBeTruthy()
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)


})



it('acks the message', async ()=> {
    const {msg, data, listener} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()

})


it('does not call ack if the event has a skipped version number', async ()=> {
    const {msg, listener, data} = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch (err) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled()
})