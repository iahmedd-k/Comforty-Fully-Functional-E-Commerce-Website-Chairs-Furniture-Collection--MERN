import mongoose from "mongoose";


const user_Schema = new mongoose.Schema({




    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true,

    },
    password:{
        type: String,
        required: true,
        min: 4
    },
    role: { type: String, enum: ["user", "admin"], default: "user" }


},
{
    timestamps:true
})


user_Schema.pre('save', async function(next){

    const user= this;
    if(user.isModified('password'))
    {
        const salt=await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    
})

export const User = mongoose.model("ComfortyUser", user_Schema)