// Created reusable function for calling any backend API using fetch
const BASE_URL = import.meta.env.VITE_API_URL

// endpoint : /users/login or /bins or /admin/stats
// method : http method ( default = GET )
// body : request data for POST, PUT
// token : JWT token
export const apiRequest = async (endpoint, method = "GET", body = null) => {
    const options = {
        method,
        headers : {}  
    } 

    // converting JS objects into JSON string only when body exists
    if(body) {
        options.headers["Content-Type"] = "application/json"
        options.body = JSON.stringify(body)
    }

    const token = localStorage.getItem("token")
    // handling authentication
    if(token) {
        options.headers.Authorization = `Bearer ${token}`
    }

    // combines url and endpoint
    const response = await fetch(`${BASE_URL}${endpoint}`, options)

    // to handle backend error 
    if(!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong")
    }

    return response.json()
}