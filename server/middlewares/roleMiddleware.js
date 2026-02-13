// to manage permissions of admin and staff
// admin can add and delete bins
// staff cant add or delete bins

const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        // check whether the user have token or not // protect middleware runs here
        if(!req.user) {
            return res.status(401).json({ message : "Not Authorized" })
        }

        // checks if users role is included in allowed roles or not
        // if role = admin , he can continue
        // if role = staff , access denied 
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message : "Access Denied : You do not have permission"})
        }

        // if role is allowed then user can continue
        next()
    }
}

export default authorizeRoles