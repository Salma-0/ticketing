import express, {NextFunction, Request, Response} from 'express'
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user'
import { siginRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import {errorHandler, NotFoundError} from '@saltickets/common'
// import GenericError from './errors/generic-error'
import cookieSession from 'cookie-session'

const app = express()


app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
   //disable cookie encryption
   signed: false,
   //allow cookie when using https
   secure: process.env.NODE_ENV !== 'test' ? true : false
}))

app.use(currentUserRouter)
app.use(siginRouter)
app.use(signoutRouter)
app.use(signupRouter)


app.all('*', async (req: Request, res: Response, next: NextFunction)=> {
   next(new NotFoundError())
})

app.use(errorHandler)

export default app;