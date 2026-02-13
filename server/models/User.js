import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },  
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    role : {
        type : String,
        enum : ["admin","staff"],
        default : "staff"
    },
    availability : {  // for staff only 
        type : String,
        enum : [ "available", "busy", "offline" ],
        default : "available"
    }
},
{
    timestamps : true
}
)

export default mongoose.model("User",userSchema)