import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
import binRoutes from "./routes/binRoutes.js"
import offlineRoutes from "./routes/offlineRoutes.js"
import collectionRoutes from "./routes/collectionRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config() 
const app = express()
connectDB()       
app.use(cors()) 
app.use(express.json())

app.use("/api/auth", authRoutes) 
app.use("/api/bins", binRoutes)  
app.use("/api/offline", offlineRoutes)
app.use("/api/collections", collectionRoutes)  
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/notification", notificationRoutes)

app.use("/api/users", userRoutes)
app.use("/api/staff", adminRoutes)
 
app.get("/",(req,res) => {
    res.send("Smart Waste Management System API is running !!!")
})
   
app.listen(process.env.PORT,() => {
    console.log(`Server is running at PORT : ${process.env.PORT}`)
})