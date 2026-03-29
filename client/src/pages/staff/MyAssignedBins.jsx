import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function MyAssignedBins() {
    const [bins, setBins] = useState([])

    const fetchBins = async () => {
        try {
            const res = await apiRequest.get("/bins")

            const user = JSON.parse(localStorage.getItem("user"))

            const myBins = res.data.bins.filter((bin) => bin.assignedStaff?._id === user._id)

            setBins(myBins)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchBins()
    }, [])

    const handleCollect = async (binId) => {
        try {
            await apiRequest("/collections", "POST", { binId })
            alert("Collected successfully")
            fetchBins()
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="bins-container">
            <h2 className="title">My Assigned Bins</h2>

            {bins.length === 0 ? (
                <p className="empty">No bins assigned</p>
            ) : (
                <div className="bins-grid">
                    {bins.map((bin) => (
                        <div key={bin._id} className="bin-card">

                            <h3>{bin.location}</h3>
                            <p className={`status ${bin.status}`}>
                                {bin.status}
                            </p>

                            <button
                                onClick={() => handleCollect(bin._id)}
                                disabled={bin.status === "empty"}
                            >
                                {bin.status === "empty" ? "Already Collected" : "Collect"}
                            </button>

                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .bins-container {
                    padding: 20px;
                    min-height: 100vh;
                    background: #f4f6f8;
                    font-family: Arial, sans-serif;
                }

                .title {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 20px;
                }

                .empty {
                    text-align: center;
                    color: #777;
                }

                .bins-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .bin-card {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: 0.3s;
                }

                .bin-card:hover {
                    transform: translateY(-5px);
                }

                .bin-card h3 {
                    margin-bottom: 10px;
                    color: #333;
                }

                .status {
                    font-weight: bold;
                    margin-bottom: 15px;
                    text-transform: capitalize;
                }

                .status.full {
                    color: red;
                }

                .status.partial {
                    color: orange;
                }

                .status.empty {
                    color: green;
                }

                button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    background: #2e7d32;
                    color: white;
                    cursor: pointer;
                    transition: 0.3s;
                }

                button:hover {
                    background: #1b5e20;
                }

                button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    )
}

export default MyAssignedBins