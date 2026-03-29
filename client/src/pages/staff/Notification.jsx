import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";

function Notification() {
    const [notification, setNotification] = useState([])

    const fetchNotifications = async () => {
        try {
            const res = await apiRequest("/notification")
            setNotification(res.data.data)
        } catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const markAsRead = async (id) => {
        await apiRequest(`/notification/${id}`, "PUT")
        fetchNotifications()
    }

    return (
        <div className="notification-container">
            <h2 className="title">Notifications</h2>

            {notification.length === 0 ? (
                <p className="empty">No notifications</p>
            ) : (
                <div className="notification-list">
                    {notification.map((n) => (
                        <div
                            key={n._id}
                            className={`notification-card ${n.read ? "read" : "unread"}`}
                        >
                            <p className="message">{n.message}</p>

                            {!n.read && (
                                <button onClick={() => markAsRead(n._id)}>
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .notification-container {
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

                .notification-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    max-width: 600px;
                    margin: auto;
                }

                .notification-card {
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 5px 12px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: 0.3s;
                }

                .notification-card:hover {
                    transform: translateY(-3px);
                }

                .unread {
                    background: #e8f5e9;
                    border-left: 6px solid #2e7d32;
                }

                .read {
                    background: #f1f1f1;
                    opacity: 0.8;
                }

                .message {
                    margin: 0;
                    font-size: 15px;
                    color: #333;
                    flex: 1;
                }

                button {
                    margin-left: 15px;
                    padding: 8px 12px;
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
            `}</style>
        </div>
    )
}

export default Notification