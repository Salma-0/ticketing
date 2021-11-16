import { requireAuth, BadRequestError, NotFoundError, validateRequest, NotAuthorizedError, OrderStatus } from '@saltickets/common'
import {Router, Request, Response} from 'express'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'
import {PaymentCreatedPublisher} from '../events/publishers/payment-created-publisher'
import {natsWrapper} from '../nats-wrapper'

const router = Router()

router.post('/api/payments', [
    requireAuth,
    body('token').not().isEmpty().withMessage('Invalid token'),
    body('orderId').not().isEmpty().isMongoId().withMessage('Invalid order id'),
    validateRequest
],async (req: Request, res: Response)=> {

   const {token, orderId} = req.body
   
   const order = await Order.findById(orderId)

   if(!order){
       throw new NotFoundError()
   }

   if(order.userId !== req.currentUser!.id) {
       throw new NotAuthorizedError()
   }

   if(order.status === OrderStatus.Cancelled){
       throw new BadRequestError('order is already cancelled')
   }


    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = Payment.build({
        stripeId: charge.id,
        orderId
    })

    await payment.save()

    const publisher =  new PaymentCreatedPublisher(natsWrapper.client)
    
    publisher.publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
 
    res.status(201).send({ id: payment.id })


   
})


export {router as createChargeRouter} 