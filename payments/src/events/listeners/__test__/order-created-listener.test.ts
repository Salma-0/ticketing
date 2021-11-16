import { OrderCreatedEvent, OrderStatus } from '@saltickets/common'
import mongoose from 'mongoose'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import {Message} from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = () => {
  
    const listener = new OrderCreatedListener(natsWrapper.client)
    
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'sddkd',
        userId: 'dkddkd',
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 10
        }
    }

    //@ts-ignore
    const msg: Message = {
       ack: jest.fn()
    }


    return {listener, data, msg}

}


it('replicates the order info', async ()=> {
    const {listener, msg, data} =  setup()

    await listener.onMessage(data, msg)

    const replicatedOrder = await Order.findById(data.id)

    expect(replicatedOrder).toBeTruthy()
    expect(replicatedOrder!.price).toEqual(data.ticket.price)


})


it('acks the message', async ()=> {
    const {listener, msg, data} =  setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})