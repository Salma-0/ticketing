import express from 'express'
import {body} from 'express-validator'
import {Request, Response} from 'express'
import {GenericError, validateRequest} from '@saltickets/common'
import {User} from '../models/user'
import jwt from 'jsonwebtoken'


const router = express.Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20  characters'),
    validateRequest  
], async (req: Request, res: Response)=> {
  
   const {email, password} = req.body

   console.log('Check whether use existed...')

   const existingUser = await User.findOne({email});

   if(existingUser){
      throw new GenericError('Email in use', 400)
   }

   
   console.log('Creating user...')

   const user = User.build({email, password});

   await user.save()


   console.log('Generate JWT...')
   
   const userJWT = jwt.sign({id: user._id, email: user.email}, process.env.JWT_KEY! )
   
   //store token in cookie session
   req.session = {
       ...req.session,
       jwt: userJWT
   }


   res.status(201).send(user)
   
})

export {router as signupRouter} ;