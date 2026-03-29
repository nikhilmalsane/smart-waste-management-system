import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { apiRequest } from "../../api/api"

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await apiRequest.post("/auth/register", form)
      alert("Request sent for approval")
      navigate("/")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">

        <img src="/Logo.png" alt="logo" className="logo" />

        <h2>Smart Waste Management</h2>
        <h3>Register</h3>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <span className="toggle" onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/">Login</Link>
        </p>

      </div>

      <style>{`
        .register-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #2e7d32, #66bb6a);
          font-family: Arial, sans-serif;
        }

        .register-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          width: 350px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          animation: fadeIn 0.5s ease-in-out;
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
          transition: 0.3s;
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
          transition: 0.3s;
        }

        button:hover {
          background: #1b5e20;
          transform: scale(1.03);
        }

        .login-text {
          margin-top: 15px;
          font-size: 14px;
        }

        .login-text a {
          color: #2e7d32;
          font-weight: bold;
          text-decoration: none;
        }

        .login-text a:hover {
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Register;