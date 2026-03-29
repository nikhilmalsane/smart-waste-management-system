import { useState } from "react"
import { apiRequest } from "../../api/api"
import { useEffect } from "react"

function AssignStaff() {
    const [bins,setBins] = useState([])
    const [staffList,setStaffList] = useState([])

    const fetchBins = async () => {
        try {
            const res = await apiRequest("/bins")
            setBins(res.data || res.bins)
        } catch(error) {
            alert(error.message)
        }
    }

    const fetchStaff = async () => {
        try {
            const res = await apiRequest("/admin")
            setBins(res.data || res.users)
        } catch(error) {
            alert(error.message)
        }
    }

    useEffect(() => { 
        fetchBins()
        fetchStaff()
    },[])

    const assignStaff = async (binId, staffId) => {
        if(!staffId) return
        try {
            await apiRequest(`/bins/assign/${binId}`,{
                method:"PUT",
                data : { staffId }
            }) 

            fetchBins()
        } catch(error) {
            alert(error.message)
        }
    }

    return (
        <div className="container">
            <h2>Assign Staff to Bins</h2>

            <table>
                <thead>
                    <tr>
                        <th>Bin Id</th>
                        <th>Location</th>
                        <th>Fill Level</th>
                        <th>Status</th>
                        <th>Assigned Staff</th>
                        <th>Assign</th>
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
                                    <span className={bin.status}>{bin.status}</span>
                                </td>
                                <td>
                                    { bin.assignedStaff?.name || "Not Assigned" }
                                </td>
                                <td>
                                    <select value={bin.assignedStaff?._id || ""} onChange={(e) => assignStaff(bin._id, e.target.value)}>
                                        <option value="">Select Staff</option>
                                        {
                                            staffList.map((staff) => (
                                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <style>
                {`
                    .container {
                        padding : 20px;
                        font-family : Arial, sans-serif;
                    }
                    
                    h2 {
                        text-align : center;
                        margin-bottom : 20px;
                        color : #2e7d32;
                    }

                    table {
                        width : 100%;
                        border-collapse : collapse;
                        background : #ffffff;
                        box-shadow : 0 2px 8px rgba(0,0,0,0.1);
                    }

                    th, td {
                        padding : 12px;
                        text-align : center;
                        font-weight : bold;
                    }

                    th {
                        background-color : #2e7d32;
                        color : white;
                        font-weight : bold;
                    }

                    tr.nth-child(even) {
                        background-color : #fafafa;
                    }

                    tr.hover {
                        background-color : #f1f1f1
                    }

                    select {
                        padding : 6px 10px;
                        border-radius : 6px;
                        border : 1px solid #ccc;
                        cursor : pointer;
                        outline : none;
                    }

                    select.hover {
                        border-color : #2e7d32
                    }

                    span {
                        padding : 1px 10px;
                        border-radius : 5px;
                        color : white;
                        font-size : 12px;
                        text-transform : capitalize;
                    }

                    @keyframes blink {
                        0% { opacity : 1 }
                        50% { opacity : 0.3 }
                        100% { opacity : 1 }
                    }

                    .full {
                        background-color : red;
                        animation : blink 1.2s infinite;
                    }
                        
                    .partial {
                        background-color : orange;        
                    }
                        
                    .empty {
                        background-color : green;
                    }
                `}
            </style>
        </div>
    )
}

export default AssignStaff