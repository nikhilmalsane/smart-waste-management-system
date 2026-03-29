// frontend protection , prevent accidental access 

import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children, role }) {
    const user = JSON.parse(localStorage.getItem("user"));    // get saved user from browser storage  // parse for coverting JSON data again to object

    if(!user) {                           // if no user go to login page
        return <Navigate to="/" />;
    } 

    if(role && user.role !== role) {       // if route requires admin but user is staff then go to login page
        return <Navigate to="/" />;
    }

    return children;          // if everything is correct
}

export default ProtectedRoutes