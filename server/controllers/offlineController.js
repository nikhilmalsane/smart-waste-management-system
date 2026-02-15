import OfflineRequest from "../models/OfflineRequest.js"
import User from "../models/User.js"

// staff creating request 
export const createOfflineRequest = async (req, res) => {
    try {

        // check whether user is staff or not
        if(req.user.role !== "staff") {
           return res.status(403).json({ message : "Only staff can request offline." })
        }

        const { description } = req.body

        // if staff has already pending request
        const existingRequest = await OfflineRequest.findOne({
            staff : req.user._id,
            status : "pending"
        })

        if(existingRequest) {
            return res.status(400).json({ message : "You already have a pending offline request."})
        }

        const request = await OfflineRequest.create({
            staff : req.user.id,
            description
        })

        res.status(201).json({
            success : true,
            message : "Offline Request sent to admin.",
            request
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

// admin to check all requests pending 
export const getAllRequests = async (req, res) => {
    try {
        // check role is admin
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can view requests." })
        }

        // admin can see staff details and hus request
        const requests = await OfflineRequest.find().populate("staff","name email availability")

        res.status(200).json({
            success : true,
            requests
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

// admin to approve or reject request
export const updateRequestStatus = async (req, res) => {
    try {
        // check role is admin
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can update request." })
        }

        const { id } = req.params
        const { status } = req.body

        const request = await OfflineRequest.findById(id)

        // if request is not present with that id
        if(!request) {
            return res.status(404).json({ message : "Request not found."})
        }

        if(request.status !== "pending") {
            return res.status(400).json({ message : "Request already proccessed."})
        }

        // check whether status is valid or not
        if(!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message : "Invalid status"
            })
        } 

        // if all correct than change the status
        request.status = status
        await request.save()

        // if approved make that staff offline
        if(status === "approved") {
            const staff = await User.findById(request.staff)
            staff.availability = "offline"
            await staff.save()
        }

        // if rejected nothing will change

        res.status(200).json({
            success : true,
            message : `Request ${status} successfully.`
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error"})
    }
}

export const goOnline = async (req, res) => {
    try {

        if(req.user.role !== "staff") {
            return res.status(403).json({ message : "Only staff can change availability." })
        }

        const staff = await User.findById(req.user._id)

        // if staff is not offline
        if(staff.availability !== "offline") {
            return res.status(400).json({ message : "You are not offline." })
        }

        // change availabilty
        staff.availability = "available"
        await staff.save()

        const request = await OfflineRequest.findOne({
            staff : req.user._id,
            status : "approved"
        }).sort({ createdAt : -1 })

        if(request) {
            request.status = "completed"
            await request.save()
        }

        res.status(200).json({ message : "You are now online." })
    } catch(error) {
        res.status(500).json({ message : "Server Error"})
    }
}