import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
   
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true,

    },
    avatarImage:{
        type:String,
        required:true,
        default: 'default_avatar.jpg',

    },
    coverImage:{
        type:String,
        default: 'default_avatar.jpg',

    },
    refreshToken:{
        type:String
    }

},{timestamps:true})






userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10) 
    next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}  // this is a instance methods added while creating user, it will used while login

userSchema.methods.genrateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.genrateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
      
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}



export const User = mongoose.model("User",userSchema);