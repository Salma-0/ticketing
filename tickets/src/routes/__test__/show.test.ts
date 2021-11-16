import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'



it('returns 400 if invalid ticket id is provided', async ()=> {
    
    await request(app)
     .get('/api/tickets/5543882')
     .expect(400)
 
 })
 

it('returns 404 if the ticket is not found', async ()=> {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
    .get('/api/tickets/'+id)
    .expect(404)

})


it('returns the ticket if the ticket is found', async ()=> {
    const cookie = await global.signin()
    const sampleTicket = {title: 'Sample Ticket', price: 20}
    const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(sampleTicket)
    .expect(201)


    const res = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .expect(200)

    expect(res.body.title).toEqual(sampleTicket.title)
    expect(res.body.price).toEqual(sampleTicket.price)
})