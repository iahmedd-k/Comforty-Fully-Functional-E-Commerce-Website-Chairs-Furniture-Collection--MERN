

import { User } from "../models/user_model.js";
import { generatetoken } from "../util/jsonwebtoken.js";
// user controller


export const login = async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Please provide all the fields"});
    }

const user = await User.findOne({email});
if(!user){
    return res.status(400).json({message: "User not found"});
}

if(user){
    const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
    return res.status(400).json({message: "Invalid credentials"});      
}

const token = generatetoken(user._id)
 res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

res.status(200).json({message: "Login successful", user, token})
}
};

export const register = async (req, res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: "Please provide all the fields"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    const user= new User({
        name,
        email,
        password
    });
    await user.save()

    const token = generatetoken(user._id);
    await sendEmail({
    to: email,
    subject: "Welcome to Comforty!",
    html: `<h2>Hello ${name},</h2><p>Your account was created successfully!</p>`
});
 res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({message: "User registered successfully", user});
}


export const myprofile = async (req, res)=>{
res.status(201).json({user : req.user})
    

}


export const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,       
        sameSite: "strict",
        expires: new Date(0) 
    });

    res.status(200).json({ message: "Logged out successfully y " });
};
