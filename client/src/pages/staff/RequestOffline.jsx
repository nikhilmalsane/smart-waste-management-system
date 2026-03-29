import { useState } from "react"
import { apiRequest } from "../../api/api"

function RequestOffline() {
    const [reason, setReason] = useState("")

    const handleSubmit = async () => {
        try {
            await apiRequest("/offline/request", "POST", { reason })
            alert("Request sent successfully")
            setReason("")
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="offline-container">
            <div className="offline-card">

                <h2>Request For Offline</h2>

                <textarea
                    placeholder="Enter reason for going offline..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />

                <button onClick={handleSubmit} >
                    Send Request
                </button>

            </div>

            <style>{`
                .offline-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f4f6f8;
                    font-family: Arial, sans-serif;
                }

                .offline-card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    width: 400px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                    text-align: center;
                }

                h2 {
                    margin-bottom: 20px;
                    color: #2e7d32;
                }

                textarea {
                    width: 100%;
                    height: 120px;
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                    resize: none;
                    outline: none;
                    font-size: 14px;
                    margin-bottom: 20px;
                    transition: 0.3s;
                }

                textarea:focus {
                    border-color: #2e7d32;
                    box-shadow: 0 0 5px rgba(46,125,50,0.3);
                }

                button {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 10px;
                    background: #2e7d32;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: 0.3s;
                }

                button:hover {
                    background: #1b5e20;
                }
            `}</style>
        </div>
    )
}

export default RequestOffline