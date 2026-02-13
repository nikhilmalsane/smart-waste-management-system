import mongoose from "mongoose"

const binSchema = new mongoose.Schema({
    location : {
        type : String,
        required : true,
        trim : true
    },
    fillLevel : {
        type : Number,
        required : true, 
        min : 0,
        max : 100,
        default : 0
    },    
    status : {
        type : String,
        enum : ["Empty","Partially Filled","Full"],
        default : "Empty"
    },

    // staff assigned to collect bin
    assignedStaff : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    latitude : {
        type : Number,
        required : true
    },
    longitude : {
        type : Number,
        required : true
    }
},
{
    timestamps : true
})

export default mongoose.model("Bin",binSchema)