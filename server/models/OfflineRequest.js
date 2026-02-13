import mongoose from "mongoose"

const offlineRequestSchema = new mongoose.Schema(
    {
        staff : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        description : {
            type : String,
            required : true
        },
        status : {
            type : String,
            enum : ["pending", "approved", "rejected"],
            default : "pending"
        }
    },
    {
        timestamps : true
    }
)

export default mongoose.model("OfflineRequest", offlineRequestSchema)