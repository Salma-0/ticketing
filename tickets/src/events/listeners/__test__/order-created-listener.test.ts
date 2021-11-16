import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@saltickets/common"
import mongoose from "mongoose"
import {Message} from 'node-nats-streaming'
import { updateCall } from "typescript"

const setup = async () => {
    //create instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    //create and save ticket

    const ticket = Ticket.build({
        title: 'Concert',
        price: 99,
        userId: 'dkfgmf'
    })

    await ticket.save()

    //create fake data object
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: 'cllv',
        status: OrderStatus.Created,
        expiresAt: 'lcllvl',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

   //create message object
   //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }


    return {ticket, msg, data, listener}

}



it('sets the order id of the ticket', async ()=> {
    const {msg, ticket, data, listener} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})



it('calls the ack() on message', async () => {
    const {msg, data, listener} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()

})


it('publishes, a ticket updated event', async ()=> {
    const {listener, data, msg} = await setup()

    await listener.onMessage(data, msg)


    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(ticketUpdatedData.orderId)

})