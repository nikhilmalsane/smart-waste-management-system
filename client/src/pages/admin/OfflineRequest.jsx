import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function OfflineRequest() {
    const [requests,setRequests] = useState([])

    const fetchRequests = async () => {
        try {
            const res = await apiRequest("/offline")
            setRequests(res.requests)
        } catch(error) {
            alert(error.message)
        }
    } 

    useEffect(() => {
        fetchRequests()
    },[])

    const handleUpdate = async (id,status) => {
        try {
            await apiRequest(`/offline/${id}`,{
                method : "PUT",
                data : {status}
            })

            fetchRequests()
        } catch(error) {
            alert(error.message)
        }
    }

    return (
        <div className="offline-container">
            <h2>Offline Requests</h2>

            <table>
                <thead>
                    <tr>
                        <th>Staff</th>
                        <th>Email</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.staff?.name}</td>
                                <td>{req.staff?.email}</td>
                                <td>{req.description}</td>
                                <td>
                                    <span className={`status ${req.status}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    {
                                        req.status === "pending" && (
                                            <>
                                                <button className="approve" onClick={() => handleUpdate(req._id,"approved")}>Approve</button>
                                                <button className="reject" onClick={() => handleUpdate(req._id,"rejected")}>Reject</button>
                                            </>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <style>{`
                .offline-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .offline-container h2 {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                th, td {
                    padding: 12px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background: #2e7d32;
                    color: white;
                }

                tr:nth-child(even) {
                    background: #fafafa;
                }

                tr:hover {
                    background: #f1f1f1;
                }

                .status {
                    padding: 5px 10px;
                    border-radius: 5px;
                    color: white;
                    text-transform: capitalize;
                }

                .pending {
                    background: orange;
                }

                .approved {
                    background: green;
                }

                .rejected {
                    background: red;
                }

                button {
                    margin: 5px;
                    padding: 6px 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    font-weight: bold;
                }

                .approve {
                    background: green;
                }

                .reject {
                    background: red;
                }

                button:hover {
                    opacity: 0.9;
                }

            `}</style>
        </div>
    )
}

export default OfflineRequest 