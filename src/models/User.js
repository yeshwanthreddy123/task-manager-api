const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Tasks=require('./Task')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('provide a valid email')
            }

        }
    },age:{
        type:Number,
        default:0,
        vaildate(value){
            if(value<0)
            {
                throw new Error('age cannot be negative')
            }
        }

    },password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password should not contain the word password')
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    
    if(!user)
    {
        throw new Error('unable to login')
    }

    const isMatch=await bcrypt.compare(password,user.password)
   
    if(!isMatch)
    {
        throw new Error('unable to login')
    }
    return user
}

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user=this
    await Tasks.deleteMany({
        owner:user._id
    })
    next()
})
const User=mongoose.model('User',userSchema)


module.exports=User
