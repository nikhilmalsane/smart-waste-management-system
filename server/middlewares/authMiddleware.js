import jwt from "jsonwebtoken"
import User from "../models/User.js"

// middleware to protect routes  
const protect = async (req, res, next) => {
    let token

    // Check if Authorization header exists and starts with Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {

            // splitting token from head
            token = req.headers.authorization.split(" ")[1]

            // verifying token using jwt secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user details from database
            req.user = await User.findById(decoded.id).select("-password")
            next()
        }
        // if token invalid
        catch(error) {
            res.status(401).json({message : "Not Authorized, token failed"})
        }
    }

    // if token is not provided
    if(!token) {
        return res.status(401).json({ message : "Not Authorized, token not provided"})
    }
}

export default protect