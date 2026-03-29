import { useState } from "react"
import { apiRequest } from "../../api/api"
import { useEffect } from "react"

function Leaderboard() {
    const [data, setData] = useState([])

    const fetchLeaderboard = async () => {
        try {
            const res = await apiRequest("/collections/leaderboard")
            setData(res.leaderboard)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const getRankIcon = (rank) => {
        if (rank === 1) return "🥇"
        if (rank === 2) return "🥈"
        if (rank === 3) return "🥉"
        return rank
    }

    return (
        <div className="leaderboard-container">
            <h2>Monthly Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Collections</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((staff) => (
                            <tr key={staff.staffId}>
                                <td className={`rank-${staff.rank}`}>{getRankIcon(staff.rank)}</td>
                                <td>{staff.name}</td>
                                <td>{staff.email}</td>
                                <td>{staff.totalCollections}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <style>{`
                .leaderboard-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .leaderboard-container h2 {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 20px;
                }

                .leaderboard-container table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .leaderboard-container th, .leaderboard-container td {
                    padding: 12px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }

                .leaderboard-container th {
                    background-color: #2e7d32;
                    color: white;
                }

                .leaderboard-container tr:nth-child(even) {
                    background-color: #fafafa;
                }

                .leaderboard-container tr:hover {
                    background-color: #f1f1f1;
                }

                .rank-1 {
                    font-weight: bold;
                    color: gold;
                    font-size: 18px;
                }

                .rank-2 {
                    font-weight: bold;
                    color: silver;
                    font-size: 16px;
                }

                .rank-3 {
                    font-weight: bold;
                    color: #cd7f32;
                    font-size: 16px;
                }
            `}</style>
        </div>
    )
}

export default Leaderboard