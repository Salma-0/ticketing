import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns 400 if the provided id is invalid', async ()=> {
    const cookie = await global.signin()
    await request(app)
    .put(`/api/tickets/gdskskxksks`)
    .set('Cookie', cookie)
    .send({
        title: 'asdkfm',
        price: 300
    })
    .expect(400)
})


it('returns 404 if the provided id is does not exist', async ()=> {
    const cookie = await global.signin()
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
        title: 'asdkfm',
        price: 300
    })
    .expect(404)

})

it('returns 401 if the user is not authenticated', async ()=> {
    
})


it('returns 401 if the user does not own this ticket', async ()=> {
    const cookie = await global.signin()
    const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asff',
        price: 20
    }).expect(201)

    const cookie2 = await global.signin()

    await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie2)
    .send({
        title: 'updated',
        price: 30
    })
    .expect(401)
})


it('returns 400 if the user provide invalid tite or price', async ()=> {
    const cookie = await global.signin()

    const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asff',
        price: 20
    }).expect(201)

    await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 30
    })
    .expect(400)


    await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie)
    .send({})
    .expect(400)

    await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie)
    .send({
        title: 'updated title',
        price: -10
    })
    .expect(400)

    await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie)
    .send({
        title: 'updated title'
    })
    .expect(400)

})


it('updates the ticket with valid inputs', async ()=> {
    const cookie = await global.signin()

    const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'asff',
        price: 20
    }).expect(201)

    const data = {title: 'valid title', price: 30}

   const response = await request(app)
    .put('/api/tickets/'+createResponse.body.id)
    .set('Cookie', cookie)
    .send(data)
    .expect(200)

    expect(response.body.title).toEqual(data.title)
    expect(response.body.price).toEqual(data.price)
})


it('publishes an event', async ()=> {
    const cookie = await global.signin()

    const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket',
        price: 10
    })
    .expect(201)


    await request(app)
    .put('/api/tickets/'+ticket.body.id)
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket 1',
        price: 20
    })
    .expect(200)


    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)

})


it('rejects updates if the ticket is reserved', async ()=> {
    const cookie = await global.signin()

    const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket',
        price: 10
    })
    .expect(201)

    await Ticket.updateOne({_id: ticket.body.id, orderId: new mongoose.Types.ObjectId().toHexString()})


    const res = await request(app)
    .put('/api/tickets/'+ticket.body.id)
    .set('Cookie', cookie)
    .send({
        title: 'Sample ticket 1',
        price: 20
    })
    .expect(400)

    console.log(res.body)

})


