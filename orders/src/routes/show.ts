import {Router, Request, Response} from 'express'
import {requireAuth, NotAuthorizedError, validateRequest, NotFoundError} from '@saltickets/common'
import { Order } from '../models/order'
import { param } from 'express-validator'


const router = Router()

router.get('/api/orders/:orderId', requireAuth, [
  param('orderId').isMongoId(),
  validateRequest
], async (req: Request, res: Response)=> {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if(!order){
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    res.status(200).send(order)
})


export {router as showOrderRouter}