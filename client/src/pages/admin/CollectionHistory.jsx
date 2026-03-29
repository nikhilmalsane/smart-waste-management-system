import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"

function CollectionHistory() {
    const [history,setHistory] = useState([])
    const [page,setPage] = useState(1)
    const [pages,setPages] = useState(1)
    const [area,setArea] = useState("") 

    const fetchHistory = async () => {
        try {
            const query = `?page=${page}${area ?`area=${area}`:""}`
            const res = await apiRequest(`/collections${query}`)

            setHistory(res.data)
            setPages(res.pages)
        } catch(error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchHistory()
    },[page,area])

    return (
        <div>
            <h2>Collection History</h2>

            <input type="text" placeholder="Filter by area" value={area} onChange={(e) => setArea(e.target.value)} />

            <table border="1">
                <thead>
                    <tr>
                        <th>Bin Location</th>
                        <th>Area</th>
                        <th>Status Before</th>
                        <th>Collected By</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        history.map((h) => (
                            <tr key={h._id}>
                                <td>{h.bin?.location}</td>
                                <td>{h.area}</td>
                                <span className={h.statusBeforeCollection}>
                                    <td>{h.statusBeforeCollection}</td>
                                </span>
                                <td>{h.staff?.name}</td>
                                <td>{new Date(h.collectedAt).toLocaleString()}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page}</span>
            <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>

            <style>
                {`
                    div {
                        padding : 20px;
                        font-family : Arial, sans-serif;
                    }

                    h2 {
                        text-align : center;
                        color : #2e7d32;
                        margin-bottom : 15px;
                    }

                    input {
                        display : block;
                        margin : 0 auto 20px auto;
                        padding : 8px 12px;
                        width : 250px;
                        border-radius : 6px;
                        border : 1px solid #ccc
                        outline : none;
                    }

                    input:focus {
                        border-color : #2e7d32;
                        box-shadow : 0 0 5px rgba(0,0,0,0.1);
                    }

                    table {
                        width : 100%;
                        border-collapse : collapse;
                        background : #fff;
                        box-shadow : 0 2px 8px rgba(0,0,0,0.1)
                    }

                    th, td {
                        padding : 12px;
                        text-align : center;
                        border-bottom : 1px solid #ddd
                    }

                    th {
                        background-color : #2e7d32;
                        color : white;
                    }

                    tr.nth-child(even) {
                        background-color : #fafafa;
                    }

                    tr.hover {
                        background-color : #f1f1f1;
                    }

                    .full {
                        background : red;
                        color : white;
                        padding : 5px 10px;
                        border-radius : 5px;
                    }

                    .partial {
                        background : orange;
                        color : white;
                        padding : 5px 10px;
                        border-radius : 5px;
                    }

                    .empty {
                        background : green;
                        color : white;
                        padding : 5px 10px;
                        border-radius : 5px;
                    }

                    button {
                        padding : 8px 14px;
                        margin : 15px 5px;
                        border : none;
                        border-radius : 6px;
                        background-color : #2e7d32;
                        color : white;
                        cursor : pointer;
                        font-weight : bold;
                    }

                    button:disabled {
                        background-color : #ccc;
                        cursor : not-allowed;
                    }

                    span {
                        font-family : bold;
                        margin : 0 10px;
                    }
                `}
            </style>
        </div>
    )
}

export default CollectionHistory