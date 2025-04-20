import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const FrontdeskRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const rolePath = location.pathname.split("/")[1]; 
      const fromPath = location.state?.from || "/";     

      const payload = { ...form, role: rolePath || "admin" };

      const res = await axios.post("http://localhost:5000/api/users/register", payload);
      alert(res.data.message);

      navigate(fromPath);  
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Frontdesk Registration</h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              type="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              type="tel"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default FrontdeskRegister;
