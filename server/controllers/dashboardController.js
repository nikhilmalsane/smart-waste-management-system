import Bin from "../models/Bin.js"
import User from "../models/User.js"
import CollectionHistory from "../models/CollectionHistory.js"

export const getAdminDashboardStats = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({ message : "Only admin can access dashboard" })
        }

        // Bin stats
        const totalBins = await Bin.countDocuments()

        const binStatusStats = await Bin.aggregate([
            {
                $group : {
                    _id : "$status",
                    count : { $sum : 1 }
                }
            }
        ])

        // convert array to object 
        const binstats = {
            full : 0,
            partial : 0,
            empty : 0
        }
        binStatusStats.forEach(stat => {
            binstats[stat._id] = stat.count
        })

        // area wise bin distribution
        const areaDistribution = await Bin.aggregate([
            {
                $group : {
                    _id : "$area",
                    totalBins : { $sum : 1 },
                    fullBins : {
                        $sum : {
                            $cond : [{ $eq : ["$status", "full"] }, 1, 0]
                        }
                    },
                    partialBins : {
                        $sum : {
                            $cond : [{ $eq : ["$status", "partial"] }, 1, 0]
                        }
                    },
                    emptyBins : {
                        $sum : {
                            $cond : [{ $eq : ["$status", "empty"] }, 1, 0]
                        }
                    },
                }
            },
            {
                $project : {
                    _id : 0,
                    area : "$_id",
                    totalBins : 1,
                    fullBins : 1,
                    partialBins : 1,
                    emptyBins : 1
                }
            },
            {
                $sort : { area : 1 }
            }
        ])

        // staff stats
        const totalStaff = await User.countDocuments({ role : "staff" })

        const staffAvailablityStats = await User.aggregate([
            { $match : { $role : "staff" } },
            {
                $group : {
                    _id : "$availability",
                    count : { $sum : 1 }
                }
            }
        ])

        const staffStats = {
            available : 0,
            busy : 0,
            offline : 0
        }
        staffAvailablityStats.forEach(stat => {
            staffStats[stat._id] = stat.count
        })

        // today's collection count 
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const todayCollections = await CollectionHistory.countDocuments({ createdAt : { $gte : startOfDay } })

        // monthly collection graph
        const monthlyCollections = await CollectionHistory.aggregate([
            {
                $group : {
                    _id : { $month : "$createdAt" },
                    total : { $sum : 1 }
                }
            },
            { $sort : { "_id" : 1 }}
        ])

        // monthly area collection performance
        const monthlyAreaPerformance = await CollectionHistory.aggregate([
            {
                $lookup : {
                    from : "bins",
                    localField : "bin",
                    foreignField : "_id",
                    as : "binDetails"
                }
            },
            {
                $unwind : "$binDetails"
            },
            {
                $group : {
                    _id : {
                        area : "$binDetails.area",
                        month : { $month : "$createdAt" }
                    },
                    totalCollections : { $sum : 1 }
                }
            },
            {
                $project : {
                    _id : 0,
                    area : "$_id.area",
                    month : "$_id.month",
                    totalCollections : 1
                }
            },
            {
                $sort : { area : 1, month : 1 }
            }
        ])

        // top 5 active staff
        const topStaff = await CollectionHistory.aggregate([
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
                $limit : 5
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

        // response
        res.status(200).json({
            success : true,
            data : {
                bins : {
                    total : totalBins,
                    ...binstats
                },
                areaDistribution,
                staff : {
                    total : totalStaff,
                    ...staffStats
                },

                collections : {
                    today : todayCollections,
                    monthly : monthlyCollections,
                    monthlyAreaPerformance
                },
                topStaff
            }
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const getStaffDashboardStats = async (req, res) => {
    try {
        const staffId = req.user.id

        // Date calculations
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const monthStart = new Date(1)
        monthStart.setHours(0, 0, 0, 0)

        // collections count 
        const todayCollections = await CollectionHistory.countDocuments({
            staff : staffId,
            createdAt : { $gte : todayStart }
        })

        const monthlyCollections = await CollectionHistory.countDocuments({
            staff : staffId,
            createdAt : { $gte : monthStart }
        })

        const totalCollections = await CollectionHistory.countDocuments({
            staff : staffId
        })

        // get staff target 
        const staff = await User.findById(staffId)

        const monthlyTarget = staff.monthlyTarget || 100

        const achievementPercentage =  monthlyTarget > 0 ? ((monthlyCollections / monthlyTarget) * 100).toFixed(2) : 0

        // get leaderboard rank
        const leaderboard = await CollectionHistory.aggregate([
            {
                $match : {
                    createdAt : { $gte : monthStart }
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
            }
        ])

        const staffRank = leaderboard.findIndex((item) => item._id.toString() === staffId) + 1

        res.status(200).json({
            success : true,
            stats : {
                todayCollections,
                monthlyCollections,
                totalCollections,
                monthlyTarget,
                achievementPercentage,
                rank : staffRank || "Not Ranked"
            }
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const getMapBins = async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({
                success : false,
                message : "Only admin can access map data."
            })
        }

        // if user sends status = full
        const { status } = req.query 

        let filter = {}

        // only full bins will be shown
        if(status) {
            filter.status = status
        }

        const bins = await Bin.find(filter).select( "binId location status fillLevel latitude longitude assignedStaff")

        res.status(200).json({
            success : true,
            count : bins.length,
            data : bins
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}