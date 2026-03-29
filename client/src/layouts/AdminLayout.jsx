import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

function AdminLayout() {
    const { logout } = useContext(AuthContext);

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
                    justify-content : space-between;
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
                    gap : 10px;
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
                            <Link to="dashboard">Dashboard</Link>
                            <Link to="manage-bins">Manage Bins</Link>
                            <Link to="manage-staff">Manage Staff</Link>
                            <Link to="assign-staff">Assign Staff</Link>
                            <Link to="staff-approvals">Staff Approvals</Link>
                            <Link to="offline-requests">Offline Requests</Link>
                            <Link to="Collection-history">Collection History</Link>
                            <Link to="leaderboard">Leaderboard</Link>
                            <Link to="map-view">Map View</Link>
                        </nav>

                    </div>
 
                    <button className="logout" onClick={logout}>Logout</button>
                </div>

                <div className="main">
                    <Outlet />
                </div>
                
            </div>
        </>
    );
}

export default AdminLayout;