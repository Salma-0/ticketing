import {Ticket} from '../models/ticket'
import {Router, Request, Response} from 'express'
import {NotFoundError, validateRequest} from '@saltickets/common'
import {param} from 'express-validator'
const router = Router()


router.get('/api/tickets/:id', [
    param('id', 'Invalid ticket id').isMongoId(),
    validateRequest
], async (req: Request, res: Response)=> {

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
            throw new NotFoundError()
    }
    
    res.status(200).send(ticket)
   
})


export {router as showTicketRouter}