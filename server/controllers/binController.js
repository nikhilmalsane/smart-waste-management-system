import Bin from "../models/Bin.js"
import User from "../models/User.js"
import Notification from "../models/Notification.js"

// Admin adding new bin
export const addBin = async (req,res) => {
    try {
        const { binId, location, fillLevel, latitude, longitude } = req.body

        if(!binId || !location || !latitude || !longitude) {
            return res.status(400).json({ message :"All fields required" })
        }

        const exists = await Bin.findOne({ binId })
        if(exists) return res.status(400).json({ message : "Bin already exists" })

        let status = "empty"

        if(fillLevel >= 80) {
            status = "full"
        } else if(fillLevel > 0) {
            status = "partial"
        }

        // new bin creation 
        const bin = await Bin.create({
            binId,
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

        // pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5

        // search and filter
        const search = req.query.search || ""
        const area = req.query.area 
        const status = req.query.status 
        const sort = req.query.sort || "desc"

        let filter = {}

        // search by location
        if(search) {
            filter.location = { $regex : search, $options : "i"}
        }  

        // filter by area 
        if(area) {
            filter.location = area
        }

        // filter by status
        if(status) {
            filter.status = status
        }

        // sorting
        const sortOption = sort === "asc" ? 1 : -1

        // for skipping the documents like if page = 2 and limit = 5
        // skip = ( 2 - 1 ) * 5 = 5 
        // means skip first 5 documents for page 2
        const skip = (page - 1) * limit

        const total = await Bin.countDocuments(filter)

        // fetch all bins from database and save in bins 
        // use populate for showing assigned staff's name and email, not only his id
        const bins = await Bin.find(filter)
            .populate("assignedStaff", "name email")
            .sort({ createdAt : sortOption })
            .skip(skip)
             

        res.status(200).json({ 
            success : true,
            page,
            totalPages : Math.ceil(total / limit),
            totalBins : total,
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
        const { fillLevel } = req.body

        const bin = await Bin.findById(id)

        if (!bin) {
            return res.status(404).json({ message: "Bin not found" })
        }

        if (
            req.user.role === "staff" &&
            bin.assignedStaff?.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied. You can only update your assigned bins."
            })
        }

        if (fillLevel === undefined) {
            return res.status(400).json({ message: "Fill level is required" })
        }

        const level = Number(fillLevel)

        if (isNaN(level) || level < 0 || level > 100) {
            return res.status(400).json({
                message: "Fill level must be between 0 and 100"
            })
        }

        bin.fillLevel = level

        if (level === 0) {
            bin.status = "empty"
        } else if (level < 80) {
            bin.status = "partial"
        } else {
            bin.status = "full"
        }

        await bin.save()

        res.status(200).json({
            success: true,
            message: "Bin updated successfully",
            data: bin
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
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
        if(bin.assignedStaff && bin.status !== "empty") {
            return res.status(400).json({ message : "Bin already assigned." })
        }

        // finding staff in database 
        const staff = await User.findById(staffId)

        // if by mistaken selected admin
        if( !staff || staff.role !== "staff" ) {
            return res.status(400).json({ message : "Invalid staff selected." })
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

        // create notification for staff
        await Notification.create({
            user : staffId,
            message : `New bin assigned at ${bin.location}`
        })

        res.json({
            success : true,
            message : "Staff assigned successfully."
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const updateBin = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can update bin." })
        }

        const { id } = req.params
        const { location, fillLevel, latitude, longitude } = req.body

        const bin = await Bin.findById(id)

        if(!bin) {
            return res.status(403).json({ message : "Bin not found." })
        }

        // update fields if given
        if(location) bin.location = location
        if(latitude) bin.latitude = latitude
        if(longitude) bin.longitude = longitude
        if(fillLevel !== undefined) {
            bin.fillLevel = fillLevel
        }

        // automatically adjust status
        if(fillLevel === 0){
            bin.status = "empty"
        } else if(fillLevel >= 80) {
            bin.status = "full"
        } else {
            bin.status = "partial"
        }

        await bin.save()

        res.status(200).json({
            success : true,
            message : "Bin Updated Succesfully.",
            bin
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const deleteBin = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can delete bin." })
        }

        const { id } = req.params

        const bin = await Bin.findById(id)

        if(!bin) {
            return res.status(403).json({ message : "Bin not found." })
        }

        await bin.deleteOne()

        res.status(200).json({
            success : true,
            message : "Bin Deleted Succesfully."
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}