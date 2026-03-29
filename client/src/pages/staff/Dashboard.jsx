import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";

function StaffDashboard() {
    const [stats, setStats] = useState(null)

    const fetchStats = async () => {
        try {
            const res = await apiRequest("/dashboard/staff")
            setStats(res)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchStats()
    },[])

    if (!stats) return <p>Loading...</p>

    return (
        <div className="dashboard-container">
            <h2>Staff Dashboard</h2>

            <div className="stats-grid">
                <div className="card">
                    <h3>Today's Collections</h3>
                    <p>{stats.todayCollections || 0}</p>
                </div>

                <div className="card">
                    <h3>Monthly Collections</h3>
                    <p>{stats.monthlyCollections || 0}</p>
                </div>

                <div className="card">
                    <h3>Total Collections</h3>
                    <p>{stats.totalCollections || 0}</p>
                </div>

                <div className="card">
                    <h3>Monthly Target</h3>
                    <p>{stats.monthlyTarget || 0}</p>
                </div>

                <div className="card highlight">
                    <h3>Achievement</h3>
                    <p>{stats.achievementPercentage || 0}%</p>
                </div>

                <div className="card rank">
                    <h3>Rank</h3>
                    <p>#{stats.rank || "-"}</p>
                </div>

            </div>

            <style>{`
                .dashboard-container {
                    padding: 20px;
                    background: #f4f6f8;
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                }

                .title {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 20px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                }

                .card {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: 0.3s;
                }

                .card:hover {
                    transform: translateY(-5px);
                }

                .card h3 {
                    margin-bottom: 10px;
                    color: #555;
                }

                .card p {
                    font-size: 22px;
                    font-weight: bold;
                    color: #2e7d32;
                }

                .highlight {
                    background: linear-gradient(135deg, #66bb6a, #2e7d32);
                    color: white;
                }

                .highlight p {
                    color: white;
                }

                .rank {
                    background: #fff3cd;
                }

                .rank p {
                    color: #856404;
                    font-size: 24px;
                }
            `}</style>
        </div>
    )
}

export default StaffDashboard;