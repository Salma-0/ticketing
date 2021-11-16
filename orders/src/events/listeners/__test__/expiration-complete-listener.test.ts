import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from 'mongoose'
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import {ExpirationCompleteEvent, OrderStatus} from '@saltickets/common'
import {Message} from 'node-nats-streaming'


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    
    
    const ticket = Ticket.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save()
    
    const order = Order.build({
       status: OrderStatus.Created,
       userId: 'sldlldd',
       expiresAt: new Date(),
       ticket
    })

    await order.save()


    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }


    return {listener, order, ticket, msg, data}
}



it('updates the order status to cancelled', async ()=> {
   const {listener, order, ticket, data, msg} = await setup()

   await listener.onMessage(data, msg)

   const updatedOrder = await Order.findById(order.id)

   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it('emits an order cancelled event', async ()=>{
    const {listener, order, ticket, data, msg} = await setup()

    await listener.onMessage(data, msg)

   const evtData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

   expect(evtData.id).toEqual(data.orderId)

})


it('ack the message', async ()=>{
    const {listener, order, ticket, data, msg} = await setup()


    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})


