import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Profile() {
  const { user } = useContext(AuthContext)

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2>{user?.name}</h2>
          <p className="role">{user?.role}</p>
        </div>

        <div className="profile-details">
          <div className="detail">
            <span>Name</span>
            <p>{user?.name}</p>
          </div>

          <div className="detail">
            <span>Email</span>
            <p>{user?.email}</p>
          </div>

          <div className="detail">
            <span>Role</span>
            <p className="role-text">{user?.role}</p>
          </div>
        </div>

      </div>

      <style>{`
        .profile-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f4f6f8;
          font-family: Arial, sans-serif;
        }

        .profile-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          width: 350px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          text-align: center;
        }

        .profile-header {
          margin-bottom: 20px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          margin: auto;
          border-radius: 50%;
          background: #2e7d32;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          font-weight: bold;
        }

        .profile-header h2 {
          margin: 10px 0 5px;
          color: #333;
        }

        .role {
          color: #777;
          text-transform: capitalize;
        }

        .profile-details {
          text-align: left;
          margin-top: 20px;
        }

        .detail {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .detail span {
          font-size: 12px;
          color: #888;
        }

        .detail p {
          margin: 5px 0 0;
          font-weight: bold;
          color: #333;
        }

        .role-text {
          color: #2e7d32;
        }
      `}</style>
    </div>
  )
}

export default Profile;