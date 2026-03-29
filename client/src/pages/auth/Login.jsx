import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiRequest } from "../../api/api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiRequest.post("/auth/login", {
        email,
        password,
      })

      const user = res.data
      localStorage.setItem("token", user.token)

      if (user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/staff")
      }
    } catch (err) {
      alert("Invalid Credentials")
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img src="/Logo.png" alt="logo" className="logo" />

        <h2>Smart Waste Management</h2>
        <h3>Login</h3>

        <form onSubmit={handleSubmit}>
          <input type="email" value={email} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />

          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} value={password} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
            <span className="toggle" onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #2e7d32, #66bb6a);
          font-family: Arial, sans-serif;
        }

        .login-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          width: 350px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .logo {
          width: 120px;
          margin-bottom: 10px;
        }

        h2 {
          color: #2e7d32;
          margin-bottom: 5px;
        }

        h3 {
          margin-bottom: 20px;
          color: #555;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          outline: none;
        }

        input:focus {
          border-color: #2e7d32;
          box-shadow: 0 0 5px rgba(46,125,50,0.5);
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 40px;
        }

        .toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
        }

        button {
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: #2e7d32;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        button:hover {
          background: #1b5e20;
        }

        .register-text {
          margin-top: 15px;
          font-size: 14px;
        }

        .register-text a {
          color: #2e7d32;
          font-weight: bold;
          text-decoration: none;
        }

        .register-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Login;