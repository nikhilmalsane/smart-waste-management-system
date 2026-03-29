import { useContext, useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { apiRequest } from "../api/api"

function StaffLayout() {
    const { logout, user } = useContext(AuthContext)
    const [count, setCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            const res = await apiRequest("/notification")

            const unread = res.data.filter((n) => !n.isRead)
            setCount(unread.length)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    return (
        <>
            <style>
                {`
                .layout {
                    display : flex;
                    min-height : 100vh;
                    background : #f4f6f8;
                    font-family : Arial, sans-serif;
                }

                .sidebar {
                    width : 250px;
                    background : #1b5e20;
                    color : white;
                    padding : 20px;
                    display : flex;
                    flex-direction : column;
                    justify-content : space-around;
                }

                .logo {
                    text-align : center;
                    margin-bottom : 20px;
                }

                .logo img {
                    width : 170px;
                    margin-bottom : 10px
                }

                .nav {
                    display : flex;
                    flex-direction : column;
                    gap : 0px;
                }

                .nav a {
                    color : white;
                    text-decoration : none;
                    padding : 10px;
                    border-radius : 6px;
                    background : rgba(255,255,255,0.05);
                    transition : 0.2s;
                }

                .nav a:hover {
                    background : #2e7d32
                }

                .logout {
                    margin-top : 15px;
                    padding : 10px;
                    border : none;
                    background : #66bb6a;
                    border-radius : 6px;
                    cursor : pointer;
                    font-weight : bold;
                }

                .main {
                    flex : 1;
                    padding : 20px
                }

                .welcome {
                    margin-bottom : 15px;
                    font-weight : bold;
                }
            `}
            </style>

            <div className="layout">

                <div className="sidebar">
                    <div>

                        <div className="logo">
                            <img src="\Logo.png" alt="logo" />
                            <h2>Smart Waste</h2>
                        </div>

                        <nav className="nav">
                            <Link to="dashboard">Dashboard</Link><br />
                            <Link to="assigned-bins">My Assigned Bins</Link><br />
                            <Link to="collections">My Collections</Link><br />
                            <Link to="request-offline">Request Offline</Link><br />
                            <Link to="notifications">Notifications ({ count })</Link><br />
                            <Link to="map">Map View</Link><br />
                            <Link to="profile">Profile</Link><br />
                        </nav>

                    </div>

                    <button className="logout" onClick={logout}>Logout</button>
                </div>

                <div className="main">

                    <div className="welcome">
                        Welcome, {user?.name}
                    </div>

                    <Outlet />
                </div>
                
            </div>
        </>
    )
}

export default StaffLayout