import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// function of registering new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // checking if user already exist with email
        const userExists = await User.findOne({ email })
        if(userExists) {
        return res.status(400).json({ message : "User already exixts"})
        }

        // converting the password in hashed before storing it in database
        const hashedPassword = await bcrypt.hash(password, 10)

        // if new then creating new user
        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            role : "staff"
        })

        res.status(201).json({ 
            success : true,
            message : "User registered succesfully"
        })
    } 
    // if any server error occur
    catch(error)
    {
        res.status(500).json({ message : "Server error"})
    }
}

// function for login for exitixting error
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // checks whether the database have the user with this email or not
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(401).json({ message : "Invalid Credentials "})
        }

        // compare the entered password with hashed password stored in database
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({ message : "Invalid Credentials" })
        }

        // genearte the jwt token
        const token = jwt.sign(
            { id : user._id, role : user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }

        )

        // sending token to user
        res.status(200).json({
            success : true,
            token
        })
    } 
    catch(error)
    {
        res.status(500).json({ message : "Server error "})
    }
}