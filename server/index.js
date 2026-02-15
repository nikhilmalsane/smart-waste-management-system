import express from "express"
const app = express()

import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import binRoutes from "./routes/binRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import offlineRoutes from "./routes/offlineRoutes.js"
import collectionRoutes from "./routes/collectionRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config()         
connectDB()
  
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/bins", binRoutes)  
app.use("/api/users", userRoutes)
app.use("/api/offline", offlineRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/dashboard", dashboardRoutes)
 
app.get("/",(req,res) => {
    res.send("Smart Waste Management System API is running !!!")
})
   
app.listen(process.env.PORT,() => {
    console.log(`Server is running at PORT : ${process.env.PORT}`)
})