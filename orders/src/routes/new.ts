import {Router, Request, Response} from 'express'
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@saltickets/common'
import {body} from 'express-validator'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'


const router = Router()


const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().isMongoId().withMessage('Ticket id must be provided'),
    validateRequest
], async (req: Request, res: Response)=> {
    
    //find the ticket

    const ticket = await Ticket.findById(req.body.ticketId)

    if(!ticket){
        throw new NotFoundError()
    }

    //make sure this ticket is not already reserved
    //look all orders. Find an order where the ticket is the ticket we just found
    //& status is not cancelled

   const isReserved = await ticket.isReserved()

    if(isReserved){
        throw new BadRequestError('Ticket is already reserved')
    }

    //calculate expiration date for this order

    const expiration = new Date()

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //build the order & save it
    const order = Order.build({
        userId: req.currentUser!.id,
        ticket: ticket,
        status: OrderStatus.Created,
        expiresAt: expiration
    })

    await order.save()

    //publish an event of the order creation
    
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            price: ticket.price,
            id: ticket.id
        }
    })

    //send status
    res.status(201).send(order)

})


export {router as newOrderRouter}