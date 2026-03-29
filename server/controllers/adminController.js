import User from "../models/User.js"
import bcrypt from "bcryptjs"

// for admin to add new staff
export const addStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if(!name || !email || !password) {
            return res.status(400).json({ message :"All fields required" })
        }

        // if staff with that email already exist
        const existing = await User.findOne({ email })
        if(existing) {
            return res.status(400).json({ message : "Staff already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const staff = await User.create({
            name,
            email,
            password : hashedPassword,
            role : "staff"
        })

        res.status(201).json({
            success : true,
            message : "Staff created successfully.",
            data : staff
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

// to update any staff
export const updateStaff = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id)

        if(!staff || staff.role !== "staff") {
            return res.status(404).json({ message : "Staff not found." })
        }

        staff.name = req.body.name || staff.name
        staff.email = req.body.email || staff.email

        await staff.save()

        res.status(200).json({ 
            success : true,
            message : "Staff updated successfully.",
            data : staff
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

// to delete any staff
export const deleteStaff = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id)

        if(!staff || staff.role !== "staff") {
            return res.status(404).json({ message : "Staff not found." })
        }
        
        await staff.deleteOne() 

        res.status(200).json({
            success : true,
            message : "Staff deleted successfully."
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role : "staff" })

        res.json({
            success : true,
            count : staff.length,
            data : staff
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}