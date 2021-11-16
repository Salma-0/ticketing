import request from 'supertest'
import app from '../../app'


it('returns a 201 on successful signup', async ()=> {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201)
})


it('returns a 400 on invalid email', async ()=> {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'invalid email',
        password: 'password'
    })
    .expect(400)
})

it('returns a 400 on invalid password', async ()=> {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'mail@mail.com',
        password: '1'
    })
    .expect(400)
})


it('returns a 400 on missing email and password', async ()=> {
    return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})

it('disallows duplicate emails', async ()=> {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    }).expect(201)

    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    }).expect(400)
})


it('sets cookie after successful signup', async ()=> {
 const response = await request(app)
   .post('/api/users/signup')
   .send({email: 'test@test.com', password: 'password'})
   .expect(201)
   
   expect(response.get('Set-Cookie')).toBeDefined()

})