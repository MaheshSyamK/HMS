import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!role || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        role,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      switch (role) {
        case "Doctor":
          navigate("/doctor/dashboard");
          break;
        case "FrontDesk":
          navigate("/frontdesk/dashboard");
          break;
        case "DataEntry":
          navigate("/dataentry/dashboard");
          break;
        case "Admin":
          navigate("/admin/dashboard");
          break;
        default:
          alert("Unknown role!");
          break;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.response?.data?.message || "Server error");
    }
  };

  const handleRegister = () => {
    if (!role) {
      alert('Please select a role to register');
      return;
    }
    navigate(`/${role.toLowerCase()}/register`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Hospital Management Login</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose Role --</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="FrontDesk">Front Desk</option>
              <option value="DataEntry">Data Entry</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Login
          </button>

          <p className="text-center mt-4">
            Not registered?{' '}
            <button
              type="button"
              onClick={handleRegister}
              className="text-blue-600 hover:underline font-semibold"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
