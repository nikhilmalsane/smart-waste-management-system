import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";

function ManageBins() {
    const [bins,setBins] = useState([])
    const [staffList,setStaffList] = useState([])
    const [assigningBinId,setAssigningBinId] = useState(null)
    const [selectedStaffId,setSelectedStaffId] = useState("")

    const [binId,setBinId] = useState("")
    const [location,setLocation] = useState("")
    const [fillLevel,setFillLevel] = useState(0)
    const [latitude,setLatitude] = useState("")
    const [longitude,setLongitude] = useState("")

    useEffect(() => { 
        fetchBins() 
    },[])

    const fetchBins = async () => {
        try {
            const res = await apiRequest("/bins")
            setBins(res.bins)
        } catch(error) {
            alert(error.message)
        }
    }

    const handleAdd = async () => {
        try {
            await apiRequest("/bins/add", "POST", {
                binId,
                location,
                fillLevel,
                latitude,
                longitude
            })

            setBinId("")
            setLocation("")
            setFillLevel(0)
            setLatitude("")
            setLongitude("")

            fetchBins()
        } catch(error) {
            alert(error.message)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this bin?")

        if(!confirmDelete) return
        
        try {
            await apiRequest(`/bins/delete/${id}`, "PUT")
            fetchBins()
        } catch(error) {
            alert(error.message)
        }
    }

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiRequest(`/bins/update-status/${id}`, "PUT", {
                status : newStatus
            })

            fetchBins()
        } catch(error) {
            alert(error.message)
        }
    }

    const fetchStaff = async () => { 
        try {
            const data = await apiRequest("/admin")
            setStaffList(data.data)
        } catch(error) {
            alert(error.message)
        }
    }
    const handleAssign = async (binId) => {
        if(!selectedStaffId) {
            alert("Please select staff")
            return
        }
        try {
            await apiRequest(`/bins/assign/${binId}`, "PUT", {
                staffId : selectedStaffId
            })

            setAssigningBinId(null)
            setSelectedStaffId("")
            fetchBins()
        } catch(error) {
            alert(error.message)
        }
    }

    return (
        <div className="bins-container">
            <h1>Manage Bins</h1>

            <div className="form-card">
                <h2>Add New Bin</h2>
                <input type="text" placeholder="Bin ID" value={binId} onChange={(e) => setBinId(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input type="number" placeholder="Fill Level" value={fillLevel} onChange={(e) => setFillLevel(e.target.value)} />
                <input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                <input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                <button onClick={handleAdd}>Add Bin</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Bin ID</th>
                        <th>Location</th>
                        <th>Fill Level</th>
                        <th>Status</th>
                        <th>Assigned Staff</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bins.map((bin) => (
                            <tr key={bin._id}>
                                <td>{bin.binId}</td>
                                <td>{bin.location}</td>
                                <td>{bin.fillLevel}%</td>
                                <td>
                                    <select value={bin.status} onChange={(e) => handleStatusUpdate(bin._id, e.target.value)}>
                                        <option value="empty">Empty</option>
                                        <option value="partial">Partial</option>
                                        <option value="full">Full</option>
                                    </select>
                                </td>
                                <td>
                                    {
                                        bin.assignedStaff ? bin.assignedStaff.name : "Not Assigned"
                                    }
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                         setAssigningBinId(bin._id)
                                         fetchStaff()
                                        }}
                                    >Assign</button>
                                    {
                                        assigningBinId === bin._id && (
                                            <>
                                                <select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
                                                    <option value="">Select Staff</option>
                                                    {
                                                        staffList.map((staff) => (
                                                            <option key={staff._id} value={staff._id}>{staff.name}</option>      
                                                        ))
                                                    }
                                                </select>
                                                <button onClick={() => handleAssign(bin._id)}>Confirm</button>
                                            </>
                                        )
                                    }
                                    <button onClick={() => handleDelete(bin._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <style>{`
                .bins-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 20px;
                }

                .form-card {
                    background: #fff;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: grid;
                    gap: 10px;
                }

                .form-card input {
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                }

                .form-card button {
                    padding: 10px;
                    background: #2e7d32;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
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

                button {
                    margin: 5px;
                    padding: 6px 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background: #2e7d32;
                    color: white;
                }

                button:hover {
                    opacity: 0.9;
                }

                select {
                    padding: 5px;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    )
}

export default ManageBins