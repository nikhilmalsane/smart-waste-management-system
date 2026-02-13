import mongoose from "mongoose"

const collectionHistorySchema = new mongoose.Schema(
    {
        bin : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Bin",
            required : true
        },
        staff : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        area : {
            type : String,
            required : true
        },
        statusBeforeCollection : {
            type : String,
            enum : ["Empty","Partially Filled","Full"],
            required : true
        },
        collectedAt : {
            type : Date,
            default : Date.now
        }
    },
    {
        timestamps : true
    }
)

export default mongoose.model("CollectionHistory", collectionHistorySchema)