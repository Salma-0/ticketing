import { Listener , Subjects, OrderCancelledEvent, OrderStatus} from "@saltickets/common";
import { Message } from 'node-nats-streaming'
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled;

   readonly queueGroupName = queueGroupName;

   async onMessage(data: OrderCancelledEvent['data'], msg: Message){
       //mark order as cancelled 
         const order = await Order.findOne({
             _id: data.id,
             version: data.version - 1
         });

         if(!order){
             throw new Error('Order not found')
         }

         order.set({status: OrderStatus.Cancelled})

         await order.save()

       //ack the msg

       msg.ack()
   }
}