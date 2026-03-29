import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function MyCollections() {
    const [data, setData] = useState([])

    const fetchCollections = async () => {
        try {
            const res = await apiRequest("/collections") 

            const user = JSON.parse(localStorage.getItem("user"))

            const myData = res.data.filter(
                (item) => item.staff?._id === user._id
            )
            setData(myData)
        } catch (error) { 
            alert(error.message)
        }
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleString()
    }

    useEffect(() => {
        fetchCollections()
    }, [])

    return (
        <div className="collections-container">
            <h2 className="title">My Collections</h2>

            {data.length === 0 ? (
                <p className="empty">No collections yet</p>
            ) : (
                <div className="collections-list">
                    {data.map((item) => (
                        <div key={item._id} className="collection-card">

                            <h3>{item.bin?.location || "Unknown Location"}</h3>

                            <p className={`status ${item.statusBeforeCollection}`}>
                                Status Before: {item.statusBeforeCollection}
                            </p>

                            <p className="date">
                                Collected At: {formatDate(item.collectedAt)}
                            </p>

                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .collections-container {
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

                .collections-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .collection-card {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    transition: 0.3s;
                }

                .collection-card:hover {
                    transform: translateY(-5px);
                }

                .collection-card h3 {
                    margin-bottom: 10px;
                    color: #333;
                }

                .status {
                    font-weight: bold;
                    margin-bottom: 10px;
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

                .date {
                    font-size: 14px;
                    color: #555;
                }
            `}</style>
        </div>

    )
}

export default MyCollections