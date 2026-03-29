import StaffRequest from "../models/StaffRequest.js"
import User from "../models/User.js"

// to update staff's availability 1) admin can set any availabilty and 2) staff has to send request to admin
export const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body

        //only admin can change availibilty 
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can update availabilty." })
        }

        // verify input means checking availibilty value
        if(!["available", "busy", "offline"].includes(availability)) {
            return res.status(400).json({ message : "Invalid availablity value."})
        }

        const staff = await User.findById(req.params.id)

        if(!staff) {
            return res.status(404).json({ message : "Staff not found." })
        }

        if(staff.role !== "staff") {
            return res.status(400).json({ message : "Cannot update admin availabilty" })
        }

        staff.availability = availability
        await staff.save()

        res.status(200).json({ 
            success : true,
            message : "Availability updated successfully."
        })
    } catch(error) {
        res.status(500).json({ message : "Server down." })
    }
}

// for admin to get pending request for staff registration
export const getPendingStaffRequest = async (req, res) => {
    try {
        const requests = await StaffRequest.find({ status : "pending" })

        res.status(200).json({
            success : true,
            message : "Get Pending Requests Successfully",
            requests
        })
    } catch(error) {
        res.status(500).json({ message : "Server down." })
    }
}

export const approveStaff = async (req, res) => {
    try {
        const request = await StaffRequest.findById(req.params.id)

        if(!request) {
            return res.status(404).json({ message : "Request not found." })
        }

        await User.create({
            name : request.name,
            email : request.email,
            password : request.password,
            role : "staff"
        })

        request.status = "approved"
        await request.save()

        res.status(200).json({
            success : true,
            message : "Staff approved successfully."
        })
    } catch(error) {
        res.status(500).json({ message : "Server down." })
    }
}

export const rejectStaff = async (req, res) => {
    try {
        const request = await StaffRequest.findById(req.params.id)

        if(!request) {
            return res.status(404).json({ message : "Request not found." })
        }
        
        request.status = "rejected"
        await request.save()

        res.json({ 
            success: true,
            message: "Request rejected" 
        })
    } catch(error) {
        res.status(500).json({ message : "Server down." })
    }
}