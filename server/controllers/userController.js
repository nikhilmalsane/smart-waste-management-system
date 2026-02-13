import User from "../models/User.js"

// to update staff's availability 1) admin can set any availabilty and 2) staff has to send request to admin
export const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body

        //only staff can change availibilty 
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