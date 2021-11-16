import request from 'supertest'
import app from '../../app'
import { Order,  OrderStatus} from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'


it('marks an order as cancelled', async ()=> {
    //create ticket

    const ticket = Ticket.build({title: 'concert', price: 20})

    await ticket.save()

    const user = await global.signin()

    //make request to create order

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

    //request to cancel the order
     await request(app)
    .delete('/api/orders/'+order.id)
    .set('Cookie', user)
    .expect(204)

    //expectation around cancellaion
    const orderFromDB = await Order.findOne({})
    
    expect(orderFromDB).toBeTruthy()
    expect(orderFromDB!.id).toEqual(order.id)
    expect(orderFromDB!.status).toEqual(OrderStatus.Cancelled)


})


it('emits an order cancelled event', async ()=> {
     //create ticket

     const ticket = Ticket.build({title: 'concert', price: 20})

     await ticket.save()
 
     const user = await global.signin()
 
     //make request to create order
 
     const {body: order} = await request(app)
     .post('/api/orders')
     .set('Cookie', user)
     .send({ticketId: ticket.id})
     .expect(201)
 
     //request to cancel the order
      await request(app)
     .delete('/api/orders/'+order.id)
     .set('Cookie', user)
     .expect(204)


     expect(natsWrapper.client.publish).toHaveBeenCalled()
 
})