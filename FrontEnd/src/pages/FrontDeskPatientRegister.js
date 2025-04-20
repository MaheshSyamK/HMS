import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPatient = () => {
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(patientData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register patient");
      }

      setMessage(data.message || "Patient registered successfully");

      // Redirect to the dashboard after 2 seconds
      setTimeout(() => {
        navigate("/frontdesk/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Register New Patient
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="gender"
            value={patientData.gender}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="address"
            value={patientData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="phone"
            value={patientData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={patientData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterPatient;
