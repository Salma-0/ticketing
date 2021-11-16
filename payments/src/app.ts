import express, {NextFunction, Request, Response} from 'express'
import 'express-async-errors'

import {errorHandler, NotFoundError, currentUser} from '@saltickets/common'
// import GenericError from './errors/generic-error'
import cookieSession from 'cookie-session'
import { createChargeRouter } from './routes/new'



const app = express()


app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
   //disable cookie encryption
   signed: false,
   //allow cookie when using https
   secure: process.env.NODE_ENV !== 'test' ? true : false
}))

app.use(currentUser)


app.use(createChargeRouter)

app.all('*', async (req: Request, res: Response, next: NextFunction)=> {
   next(new NotFoundError())
})

app.use(errorHandler)

export default app;