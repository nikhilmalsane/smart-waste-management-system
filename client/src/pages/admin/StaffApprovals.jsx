import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function StaffApprovals() {
    const [requests,setRequests] = useState([])

    const fetchRequests = async () => {
        try {
            const data = await apiRequest("/users/staff-requests")
            setRequests(data)
        } catch(error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchRequests()
    },[])

    const handleApprove = async (id) => {
        try {
            await apiRequest(`/users/staff-approve/${id}`, "PUT")
            fetchRequests()
        } catch(error) {
            alert(error.message)
        }
    }

    const handleReject = async (id) => {
        const confirmReject = window.confirm("Reject this request?")

        if(!confirmReject) return 

        try {
            await apiRequest(`/users/staff-reject/${id}`, "DELETE")
            fetchRequests()
        } catch(error) {
            alert(error.message)
        }
    }

    return (
        <div className="approval-container">
            <h1>Staff Approval Requests</h1>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        requests.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-data">No Pending Requests</td>
                            </tr>
                        ) : (
                            requests.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.name}</td>
                                    <td>{r.email}</td>
                                    <td>
                                        <button className="approve" onClick={() => handleApprove(r._id)}>Approve</button>
                                        <button className="reject" onClick={() => handleReject(r._id)}>Reject</button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>

            <style>{`
                .approval-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .approval-container h1 {
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

                .no-data {
                    font-weight: bold;
                    color: #777;
                }

                button {
                    margin: 5px;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 6px;
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

export default StaffApprovals