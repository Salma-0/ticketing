import { OrderStatus } from '@saltickets/common'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import {stripe} from '../../stripe'

//jest.mock('../../stripe')

it('returns 404 if the order does not exist ', async ()=> {
const cookie = await global.signin()

  await supertest(app)
  .post('/api/payments')
  .set('Cookie', cookie)
  .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: 'random str'
  })
  .expect(404)

})


it('returns 401 when purchasing an order that does not belong to the user', async ()=> {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0, 
        price: 20,
        status: OrderStatus.Created
    })

    await order.save()

    const cookie = await global.signin()

    await supertest(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'random str'
        })
        .expect(401)

})


it('returns 400 when purchasing a cancelled order', async ()=> {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0, 
        price: 20,
        status: OrderStatus.Cancelled
    })

    await order.save()


    const cookie = await global.signin(order.userId)

    await supertest(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'random str'
        })
        .expect(400)
})



it('returns 201 with valid inputs', async ()=> {
    const price =  Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0, 
        price,
        status: OrderStatus.Created
    })

    await order.save()


    const cookie = await global.signin(order.userId)

    await supertest(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)

    const stripeCharges = await stripe.charges.list({limit: 50})
    const stripeCharge = stripeCharges.data.find(charge => charge.amount == price * 100)

    expect(stripeCharge).toBeDefined()
    expect(stripeCharge!.currency).toEqual('usd')
    
    const payment = await Payment.findOne({orderId: order.id, stripeId: stripeCharge!.id})

    expect(payment).not.toBeNull()


})


