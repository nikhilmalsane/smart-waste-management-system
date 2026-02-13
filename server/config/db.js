import mongoose from  "mongoose"

// function to connect MongoDB Database
const connectDB = async() => {
    // if connection is succesfull
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected Successfully!!!");
    }
    // if connection fails
    catch(error) {
        console.log("MongoDB Connection Failed : ",error.message)
        process.exit(1) // stop server if database connection failed
    }
}

export default connectDB