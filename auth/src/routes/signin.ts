import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import {GenericError, validateRequest} from '@saltickets/common'
import {User} from '../models/user'
import {Password} from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply password'),
    validateRequest
], async (req: Request, res: Response)=> {

    const {email, password} = req.body
   
    // check for user existence
    const existingUser = await User.findOne({email})

    if(!existingUser){
       throw new GenericError('Invalid credentials', 400) 
    }

    //check for password accuracy

    const isMatch = await Password.compare(existingUser.password, password);
    console.log('isMatch', isMatch)
    if(!isMatch){
        throw new GenericError('Invalid credentials', 400) 
    }

    //generate JWT
    const token = await jwt.sign(
        {
            id: existingUser.id,
            email: existingUser.email
        },
        process.env.JWT_KEY!
    )

    //store jwt in session
    req.session = {
        ...req.session,
        jwt: token
    }

    res.status(200).send(existingUser)

    
})

export {router as siginRouter} ;