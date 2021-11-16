import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@saltickets/common";

import {Message} from 'node-nats-streaming'
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId).populate('ticket')

        if(!order){
            throw new Error('Order Not Found')
        }

        if(order.status === OrderStatus.Complete){
            return msg.ack()
        }

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()

        const publisher =  new OrderCancelledPublisher(this.client)
       
        publisher.publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()


    }

}