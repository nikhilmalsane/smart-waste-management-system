import Notification from "../models/Notification.js"

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user : req.user._id}).sort({ createdAt : -1 })

        res.json({
            success : true,
            data : notifications
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id : req.params.id,
            user : req.user._id
        })

        if(!notification) {
            return res.status(404).json({ message : "Not Found" })
        }

        notification.isRead = true;
        await notification.save()

        res.json({
            success : true,
            message : "Marked as read"
        })
    } catch(error) {
        res.status(500).json({ message : "Server Error" })
    }
}