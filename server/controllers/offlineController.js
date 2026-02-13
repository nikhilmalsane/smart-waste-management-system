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

        const { status } = req.body

        // check whether status is valid or not
        if(!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message : "Invalid status"
            })
        }

        const request = await OfflineRequest.findById(req.params.id)

        // if request is not present with that id
        if(!request) {
            res.status(404).json({ message : "Request not found."})
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