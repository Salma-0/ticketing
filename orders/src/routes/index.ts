import {Router, Request, Response} from 'express'
import { requireAuth } from '@saltickets/common'
import {Order} from '../models/order'


const router = Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response)=> {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket')


    return res.status(200).send(orders)
})


export {router as indexOrderRouter}