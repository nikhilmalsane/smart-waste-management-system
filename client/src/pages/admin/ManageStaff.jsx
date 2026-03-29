import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function ManageStaff() {
    const [staff,setStaff] = useState([])

    const [newStaff,setNewStaff] = useState({
        name : "",
        email : "",
        password : ""
    })

    const [editingStaff,setEditingStaff] = useState(null)

    const fetchStaff = async () => {
        try {
            const data = await apiRequest("/admin")
            setStaff(data)
        } catch(error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchStaff()
    },[])

    const handleAddStaff = async (e) => {
        e.preventDefault()

        try {
            await apiRequest("/admin/add", "POST", newStaff)

            setNewStaff({
                name : "",
                email : "",
                password : ""
            })

            fetchStaff()
        } catch(error) {
            alert(error.message)
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this staff?")

        if(!confirmDelete) return

        try {
            await apiRequest(`/admin/delete/${id}`, "DELETE")

            fetchStaff()
        } catch(error) {
            alert(error.message)
        }
    }

    const handleUpdate = async () => {
        try {
            await apiRequest(`/admin/update/${editingStaff._id}`, "PUT", editingStaff)

            setEditingStaff(null)

            fetchStaff()
        } catch(error) {
            alert(error.message)
        }
    }

    return (
        <div className="staff-container">
            <h1>Manage Staff</h1>

            <div className="form-card">
                <h2>Add Staff</h2>

                <form onSubmit={handleAddStaff}>
                    <input type="text" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff,name:e.target.value})}/>
                    <input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff,email:e.target.value})}/>
                    <input type="password" placeholder="Password" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff,password:e.target.value})}/>
                    <button type="submit">Add Staff</button>
                </form>
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        staff.map((s) => (
                            <tr key={s._id}>
                                <td>{s.name}</td>
                                <td>{s.email}</td>
                                <td>
                                    <span className={`status ${s.availability}`}>
                                        {s.availability}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => setEditingStaff(s)}>Edit</button>
                                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr> 
                        ))
                    }
                </tbody>
            </table>

            {
                editingStaff && (
                    <div className="edit-card">
                        <h2>Edit Staff</h2>

                        <input type="text" placeholder="Name" value={editingStaff.name} onChange={(e) => setEditingStaff({...editingStaff,name : e.target.value})} />
                        <input type="email" placeholder="Email" value={editingStaff.email} onChange={(e) => setEditingStaff({...editingStaff,email : e.target.value})} />
                        <select type="text" placeholder="Availability" value={editingStaff.availability} onChange={(e) => setEditingStaff({...editingStaff,availability : e.target.value})} >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="offline">Offline</option>
                        </select>
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={() => setEditingStaff(null)}>Cancel</button>
                    </div>
                )
            }

            <style>{`
                .staff-container {
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
                }

                .form-card form {
                    display: grid;
                    gap: 10px;
                }

                input, select {
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                }

                button {
                    padding: 8px 12px;
                    margin: 5px;
                    border: none;
                    border-radius: 6px;
                    background: #2e7d32;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }

                button:hover {
                    opacity: 0.9;
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
                }

                .available {
                    background: green;
                }

                .busy {
                    background: orange;
                }

                .offline {
                    background: red;
                }

                .edit-card {
                    margin-top: 20px;
                    padding: 15px;
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: grid;
                    gap: 10px;
                }
            `}</style>
        </div>
    )
}

export default ManageStaff