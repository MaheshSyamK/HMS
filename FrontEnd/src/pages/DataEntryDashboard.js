import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const DataEntryDashboard = () => {
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dataEntry/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPatients(data?.patients || []);
      } catch (err) {
        console.error("Data Entry fetch failed:", err);
      }
    };

    if (token) {
      fetchPatients();
    }
  }, [token]);

  const handlePatientClick = (patientId) => {
    navigate(`/dataentry/${patientId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white px-4 sm:px-6 md:px-12 lg:px-20 py-8 font-sans relative">

      {/* Logout Icon */}
      <button
        onClick={handleLogout}
        title="Logout"
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-all duration-200"
      >
        <FaSignOutAlt className="text-lg" />
      </button>

      {/* Main Dashboard Heading */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          Data Entry Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg sm:text-xl">Welcome! Select a patient below to proceed.</p>
      </div>

      {/* Patients Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 border-b-2 border-blue-300 w-fit">
          Patients
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {patients.map((p) => (
            <div
              key={p.patient_id}
              onClick={() => handlePatientClick(p.patient_id)}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-[1.02] transition-all duration-200 border-l-4 border-blue-600"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{p.name}</h3>
              <p className="text-gray-700"><span className="font-semibold">Age:</span> {p.age}</p>
              <p className="text-gray-700"><span className="font-semibold">Gender:</span> {p.gender}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DataEntryDashboard;
