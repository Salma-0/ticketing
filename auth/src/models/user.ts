import mongoose from 'mongoose'
import {Password} from '../services/password'

interface IUserAttrs {
    email: string,
    password: string
}

//describe properties of User document
interface UserDoc extends mongoose.Document  {
    email: string,
    password: string
}

//an interface that describes properties of User model
interface UserModel extends mongoose.Model<UserDoc> {
   build(attrs: IUserAttrs) : UserDoc
}

const userSchema = new mongoose.Schema<IUserAttrs>({
    email: {type: String, required: true},
    password: {type: String, required: true}
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id
            delete ret.password;
            delete ret.__v;


        }
    }
})


userSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)
    }

    done()
})

userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs)
}




const User = mongoose.model<UserDoc, UserModel>('User', userSchema)



export {User};

