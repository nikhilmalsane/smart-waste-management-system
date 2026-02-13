import CollectionHistory from "../models/CollectionHistory"

export const getCollectionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 5, area} = req.query

        const query = {}

        if(area) {
            query.area = area
        }

        const history = await CollectionHistory.find(query)
            .populate("bin", "location status")
            .populate("staff", "name email")
            .sort({ createdAt : -1 })
            .skip(( page - 1 ) * limit)
            .limit(Number(limit))

        const total = await CollectionHistory.countDocuments(query)

        res.status(200).json({
            success : true,
            total,
            page : Number(page),
            pages : Math.ceil(total / limit),
            data : history
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}