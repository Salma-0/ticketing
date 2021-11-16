import {Ticket} from '../models/ticket'
import {Router, Request, Response} from 'express'
import {NotFoundError, requireAuth, validateRequest, NotAuthorizedError, BadRequestError} from '@saltickets/common'
import {param, body} from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'


const router = Router()

router.put('/api/tickets/:id', requireAuth, [
   param('id', 'Invalid ticket id').isMongoId(),
   body('title', 'Invalid title').not().isEmpty(),
   body('price', 'Invalid price').isFloat({gt: 0}),
   validateRequest
], async (req: Request, res: Response)=> {
    const ticket = await Ticket.findById(req.params.id)

    console.log('check for ticket existance..')
    
    if(!ticket){
        throw new NotFoundError()
    }


    if(ticket.orderId){
        throw new BadRequestError('Cannot edit a reserved ticket')
    }

    console.log('check for authorization...')

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    console.log('set the new fields...')

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    console.log('saving ticket ...')

    await ticket.save()

    console.log('publishing update event...')

    

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    .then(()=> console.log('Event update ticket has been published successfully...'))
    .catch(err => console.error(err.message))

    res.send(ticket)
})


export {router as updateTicketRouter}