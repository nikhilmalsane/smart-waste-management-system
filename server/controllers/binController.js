import Bin from "../models/Bin.js"
import User from "../models/User.js"

// Admin adding new bin
export const addBin = async (req,res) => {
    try {
        const { location, fillLevel, latitude, longitude } = req.body

        let status = "Empty"

        if(fillLevel >= 80) {
            status = "Full"
        } else if(fillLevel > 0) {
            status = "Partially Filled"
        }

        // new bin creation
        const bin = await Bin.create({
            location,
            fillLevel,
            status,
            latitude,
            longitude
        })

        res.status(201).json({
            success : true,
            message : "Bin added succesfully"
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error "})
    }
}

// to fetch bins
export const getAllBins = async (req, res) => {
    try {
        // fetch all bins from database and save in bins 
        // use populate for showing assigned staff's name and email, not only his id
        const bins = await Bin.find().populate("assignedStaff", "name email")

        res.status(200).json({
            success : true,
            count : bins.length,
            bins
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

// function to update bin status - admin or assigned staff
export const updateBinStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status, fillLevel } = req.body

        // find that bin with reference to id 
        const bin = await Bin.findById(id)

        // if that bin not found
        if(!bin) {
            return res.status(404).json({ message : "Bin not found "})
        }

        // check if staff is assignedStaff or not
        // first condition tells that check this condition if you are staff , if you are admin you dont need to pass this condition
        // second condition checks whether this bin is assigned to login staff or not
        // we check using assignedStaff's id and login staff's id 
        // '?' is to handle if no staff is assigned to bin
        // toString is used to compare the id's completely as object _id are normal string 
        if( req.user.role === "staff" && bin.assignedStaff?.toString() !== req.user._id.toString ) {
            return res.status(403).json({ message : "Access denied. You can only update your assigned bins. "})
        }

        // if staff is correct than update the changes
        bin.status = status

        // if staff work is done then make his availablity to available
         if( status === "empty" && bin.assignStaff) {
            const staff = User.findById(bin.assignStaff) 
            
            if(staff) {
                staff.availability = "available"
                await staff.save()
            }

            // remove assignedStaff status
            bin.assignStaff = null
         }

        // save updates to database
        await bin.save()

        res.status(200).json({
            success : true,
            message : "Bin Updated Successfully"
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error "})
    }
}

// function for admin to assign staff for bin which is full
export const assignStaff = async (req, res) => {
    try {
        const { id } = req.params  // bin id send through url
        const { staffId } = req.body // staff id send from frontend

        // finding bin using id
        const bin = await Bin.findById(id)

        // if bin not found with that id
        if(!bin) {
            return res.status(404).json({ message : "Bin not found." })
        }

        // to prevent double assign
        if(bin.assignedStaff) {
            return res.status(400).json({ message : "Bin already assigned." })
        }

        // finding staff in database 
        const staff = await User.findById(staffId)

        // if by mistaken selected admin
        if( !staff || staff.role !== "staff" ) {
            res.status(400).json({ message : "Invalid staff selected." })
        }

        // if staff is not available 
        if(staff.availability !== "available") {
            return res.status(400).json({ message : `Staff is ${staff.availability}.` })
        }

        // assign the other available staff and change his availability to busy
        bin.assignedStaff = staffId
        staff.availability = "busy"

        // save updated changes in database
        await bin.save()
        await staff.save()

        res.json({
            success : true,
            message : "Staff assigned successfully."
        })
    } catch(error) {
        res.staus(500).json({ message : "Server Error" })
    }
}