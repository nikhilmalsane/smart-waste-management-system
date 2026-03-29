import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Splash() {
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login")
        }, 3000)

        return () => clearTimeout(timer)
    },[])

    return (
        <div style={styles.container}>
            <img src="\Logo.png" alt="logo" style={styles.logo} />
            <h2>Smart Waste Management System</h2>
        </div>
    )
}

const styles = { 
    container : {
        height : "100vh",
        display : "flex",
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "center",
        backgroundColor : "#f4f6f8"
    },
    logo : {
        width : "150px",
        marginBottom : "20px"
    }
}

export default Splash