import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/ticket'


it('fetches the order', async ()=> {
    //create ticket

    const ticket = Ticket.build({title: 'concert', price: 20})
    await ticket.save()

    //create cookie
    const cookie = await signin()

    //make request to build an order with this ticket

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ticketId: ticket.id})
    .expect(201)


    //make request to fetch the order

    const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .expect(200)

    expect(fetchedOrder.id).toEqual(order.id)
})


it('returns 401 if one user is trying to fetch another user\'s order', async ()=> {
    //create ticket

    const ticket = Ticket.build({title: 'concert', price: 20})
    await ticket.save()

    //create cookie
    const user1 = await signin()
    const user2 = await signin()

    //make request to build an order with this ticket

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ticketId: ticket.id})
    .expect(201)


    //make request to fetch the order

    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .expect(401)

    
})