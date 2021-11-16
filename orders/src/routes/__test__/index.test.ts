import request from 'supertest'
import app from '../../app'
import {Ticket} from '../../models/ticket'

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save()

    return ticket
}
it('fetches users\' orders', async ()=> {
   const user1 = await global.signin()
   const user2 = await global.signin()

   //create three tickets
   const ticketOne = await  buildTicket()   
   const ticketTwo = await  buildTicket()   
   const ticketThree = await  buildTicket()   

   //create one order as User #1

   await request(app)
   .post('/api/orders')
   .set('Cookie', user1)
   .send({ticketId: ticketOne.id})
   .expect(201)
   
   
   //create two orders as User #2

   const {body: orderOne} = await request(app)
   .post('/api/orders')
   .set('Cookie', user2)
   .send({ticketId: ticketTwo.id})
   .expect(201)

   const {body: orderTwo} = await request(app)
   .post('/api/orders')
   .set('Cookie', user2)
   .send({ticketId: ticketThree.id})
   .expect(201)


   //make request to fetch User #2's orders

   const res = await request(app)
   .get('/api/orders')
   .set('Cookie', user2)
   .expect(200)

   expect(res.body.length).toEqual(2)
   expect(res.body[0].id).toEqual(orderOne.id)
   expect(res.body[1].id).toEqual(orderTwo.id)


   expect(res.body[0].ticket.id).toEqual(ticketTwo.id)
   expect(res.body[1].ticket.id).toEqual(ticketThree.id)

})