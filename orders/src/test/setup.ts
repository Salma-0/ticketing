import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';


//mock nats client
jest.mock('../nats-wrapper')


//add global auth helper function tto be used in different test files
declare global {
    var signin: () => Promise<string[]>;
}

let mongo:any ;

beforeAll(async ()=> {
   process.env.JWT_KEY = 'as;dldfgkl'
   mongo = await MongoMemoryServer.create()
   const mongoUri = await mongo.getUri()
   await mongoose.connect(mongoUri)

})

beforeEach(async ()=>{
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for(let collection of collections){
        await collection.deleteMany({})
    }
})


afterAll(async ()=>{
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = async () => {
   //build jwt payload
   const payload = {email: 'test@test.com', id: new mongoose.Types.ObjectId().toHexString()}

   //create jwt

   const token = await jwt.sign(payload, process.env.JWT_KEY!)

   //build session and turn into JSON

   const session = {jwt: token}

   //take JSON and encode it as base64 

   const sessionJSON = JSON.stringify(session)

   const base64 = Buffer.from(sessionJSON).toString('base64')

   //return a string thats the cookie

   return [`express:sess=${base64}`]
}

