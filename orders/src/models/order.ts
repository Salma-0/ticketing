import mongoose, { Document, Model, Schema } from 'mongoose'
import {OrderStatus} from '@saltickets/common'
import {TicketDoc} from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
   userId: string,
   status:  OrderStatus,
   expiresAt: Date,
   ticket: TicketDoc
}


//descibes what saved document has
interface OrderDoc extends Document {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc,
    version: number
}


//describes what the collection has
interface OrderModel extends Model<OrderDoc>{
   build(attrs: OrderAttrs): OrderDoc
}


const orderSchame = new Schema({
    userId: {type: String, required: true },
    status: {type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created},
    expiresAt: {type: Schema.Types.Date},
    ticket: {type: Schema.Types.ObjectId, ref: 'Ticket'}
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id,
            delete ret._id
        }
    }
})

orderSchame.set('versionKey', 'version')
orderSchame.plugin(updateIfCurrentPlugin)


orderSchame.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchame)



export {Order, OrderStatus}