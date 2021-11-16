import request from 'supertest'
import app from '../../app'
import  {Ticket} from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'



it('has route handler to /api/tickets for post requests', async () => {
   const response = await request(app)
   .post('/api/tickets')
   .send({})
   
   expect(response.status).not.toEqual(404)
})


it('can only be accessed if the user is signed in', async () => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns status other than 401 if user is signed in', async () => {
    const cookie = await global.signin()
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
    
    expect(response.status).not.toEqual(401)
})

it('returns an error if an empty title is provided', async () => {
    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 10
    })
    .expect(400)


   
})


it('returns an error if title is undefined', async () => {
    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        price: 10
    })
    .expect(400)

})


it('returns an error if price is undefined', async () => {
    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket'
    })
    .expect(400)
   
})

it('returns an error price is negative number', async () => {
    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket',
        price: -10
    })
    .expect(400)
   
})




it('creates a ticket with valid input', async () => {
    //add in a check to make sure a ticket was saved
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket',
        price: 10
    })
    .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(10)
    expect(tickets[0].title).toEqual('Sample ticket')
})

it('publishes an event', async ()=> {
    const cookie = await global.signin()

    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket',
        price: 10
    })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

})