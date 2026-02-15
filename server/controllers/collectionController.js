import CollectionHistory from "../models/CollectionHistory"
import Bin from "../models/Bin"
import User from "../models/User"

export const createCollectionHistory = async (req, res) => {
    try {
        const { binId } = req.body
        
        // check whether bin exist or not
        const bin = await Bin.findById(binId)
        if(!bin) {
           return res.status(404).json({
            success : false,
            message : "Bin not found."
           })
        }

        // check if staff is assignedStaff or not
        // first condition tells that check this condition if you are staff , if you are admin you dont need to pass this condition
        // second condition checks whether this bin is assigned to login staff or not
        // we check using assignedStaff's id and login staff's id 
        // '?' is to handle if no staff is assigned to bin
        // toString is used to compare the id's completely as object _id are normal string 
        if( req.user.role === "staff" && bin.assignedStaff?.toString() !== req.user._id.toString() ) {
             return res.status(403).json({ message : "Access denied. You can only update your assigned bins. "})
        }

        // just that offline staff should not collect any bin 
        if(req.user.availability === "offline") {
            return res.status(403).json({ message : "You are offline. Cannot collect bins."})
        }
        
        // prevent duplicate entry
        if(bin.status === "empty") {
            return res.status(400).json({ message : "Bin already empty."})
        }
        // insertion of new collection record
        const newCollection = await CollectionHistory.create({
            bin : bin._id,
            staff : req.user._id,
            area : bin.area,
            statusBeforeCollection : bin.status
        })

        // update bin status to empty
        bin.status = "empty"
        bin.fillLevel = 0
        bin.assignedStaff = null
        await bin.save()

        // make staff available again
        if(req.user.role === "staff") {
            const staff = await User.findById(req.user._id)
            staff.availability = "available"
            await staff.save()
        }

         res.status(201).json({
            success : true,
            message : "Collection completed successfully.",
            data : newCollection
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const getCollectionHistory = async (req, res) => {
    try {
        // just to filter the records per page
        // /api/collection?page=2&limit=10&area=Pune
        const { page = 1, limit = 5, area} = req.query

        // empty filter object
        const query = {}

        // if area is correct
        if(area) {
            query.area = area
        }

        // fetching records based on conditions
        const history = await CollectionHistory.find(query)
            .populate("bin", "location status")   // showing bin location and status instead of id
            .populate("staff", "name email")     // showing name and email of staff collected that bin
            .sort({ createdAt : -1 })            // this for adding new added record at first using descending logic of -1 for createdAT
            .skip(( page - 1 ) * limit)          // skip logic 
            .limit(Number(limit))               // limit to show limited records

        // count total records for paging them
        const total = await CollectionHistory.countDocuments(query)

        // returning 
        res.status(200).json({
            success : true,
            total,                            // total records
            page : Number(page),              // current page
            pages : Math.ceil(total / limit), // total pages
            data : history                    // actual data
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const getMonthlyLeaderboard = async (req, res) => {
    try {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const leaderboard = await CollectionHistory.aggregate([
            {
                $match : {
                    createdAt : { $gte : startOfMonth }
                }
            },
            {
                $group : {
                    _id : "$staff",
                    totalCollections : { $sum : 1 }
                }
            },
            {
                $sort : {
                    totalCollections : -1
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField : "_id",
                    foreignField : "_id",
                    as : "staffDetails"
                }
            },
            {
                $unwind : "$staffDetails"
            },
            {
                $project : {
                    _id : 0,
                    staffId : "$staffDetails._id",
                    name : "$staffDetails.name",
                    email : "$staffDetails.email",
                    totalCollections : 1
                }
            }
        ])

        // Ranking Position
        const rankedLeaderboard = leaderboard.map((staff, index) => ({
            rank : index + 1,
            ...staff
        }))

        res.status(200).json({ 
            success : true,
            leaderboard : rankedLeaderboard
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}