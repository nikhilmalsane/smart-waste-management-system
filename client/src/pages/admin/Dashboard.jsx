import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import DashboardChart from "./DashboardCharts";

function AdminDashboard() {
    const [stats,setStats] = useState(null)

    const token = localStorage.getItem("token")
 
    const fetchStats = async () => {
        try {
            const res = await apiRequest("/dashboard/admin")

            setStats(res) 
    
        } catch(error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchStats()
    },[])

    if(!stats) return <p>Loading...</p>

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {
                stats && (
                    <>
                            <div>
                                <h2>Bin Statistics</h2>
                                <p>Total : {stats.bins.total}</p>
                                <p>Full : {stats.bins.full}</p>
                                <p>Partial : {stats.bins.partial}</p>
                                <p>Empty : {stats.bins.empty}</p>
                            </div>
                            
                            <hr />

                            <div>
                                <h2>Staff</h2>
                                <p>Total Staff : {stats.staff.total}</p>
                            </div>

                            <hr />

                            <div>
                                <h2>Collections</h2>
                                <p>Today : {stats.collections.today}</p>
                                <p>This Month : {stats.collections.monthly}</p>
                            </div>

                            <hr />

                            <div>
                                <h2>Area Distribution</h2>
                                {
                                    stats.areaDistribution.map((area, i) => (
                                        <div key={i}>
                                            <p><strong>{area.area}</strong></p>
                                            <p>Total : {area.totalBins}</p>
                                            <p>Full : {area.fullBins}</p>
                                            <p>Partial : {area.partialBins}</p>
                                            <p>Empty : {area.emptyBins}</p>
                                            <hr />
                                        </div>
                                    ))
                                }
                            </div>

                            <hr />

                            <div>
                                <h2>Top Staff</h2>
                                {
                                    stats.topStaff.map((staff, i) => (
                                        <p key={i}>
                                            #{i+1} - {staff.name}({staff.totalCollections})
                                        </p>
                                    ))
                                }
                            </div>
                    </>
                )
            }

            <div>
                <DashboardChart data={stats} />
            </div>

            <style>
                {`
                    .dashboard-container {
                        padding : 20px;
                        font-family : Arial, sans-serif;
                    }   
                        
                    h1 {
                        text-align : center;
                        color : #2e7d32;
                        margin-bottom : 20px;
                    }

                    .card {
                        background : #fff;
                        padding : 15px;
                        margin-bottom : 20px;
                        border-radius : 10px;
                        box-shadow : 0 2px 8px rgba(0,0,0,0.1);
                    }

                    .card h2 {
                        margin-bottom : 10px;
                        color : #333;
                    }

                    .grid {
                        display : grid;
                        grid-template-columns : repeat(auto-fit, minmax(120px, 1fr));
                        gap : 10px;
                    }

                    .stat {
                        padding : 10px;
                        border-radius : 8px;
                        text-align : center;
                        font-weight : bold;
                        color : white;
                    }

                    .total { 
                        background : #1976d2 
                    }

                    .full {
                        background : red 
                    }

                    .partial {
                        background : orange 
                    }

                    .empty {
                        background : green
                    }

                    .area-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                        gap: 10px;
                    }

                    .area-card {
                        padding: 10px;
                        border-radius: 8px;
                        background: #f9f9f9;
                        border: 1px solid #ddd;
                    }

                    .area-card strong {
                        color: #2e7d32;
                    }

                    .area-card .full {
                        color: red;
                        font-weight: bold;
                    }

                    .area-card .partial {
                        color: orange;
                    }

                    .area-card .empty {
                        color: green;
                    }
                `}
            </style>
        </div>
    )
}

export default AdminDashboard;