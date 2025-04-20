import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FrontDeskDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch patients");

      const data = await res.json();
      setPatients(Array.isArray(data.patients) ? data.patients : []);
    } catch (err) {
      console.error("Front desk fetch failed:", err);
      setError("Unable to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (id) => {
    navigate(`/frontdesk/${id}`);
  };

  const handleRegister = () => {
    navigate("/frontdesk/dashboard/register");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/patients/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setPatients((prev) => prev.filter((patient) => patient.patient_id !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page or home page
    navigate("/");
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-blue-700 font-bold">Front Desk Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg"
          >
            + Register New Patient
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-lg text-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-xl text-gray-700 mb-4">Registered Patients</h2>

      {loading ? (
        <p className="text-gray-500">Loading patients...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => (
            <div
              key={p.patient_id}
              onClick={() => handlePatientClick(p.patient_id)}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <p><strong>Age:</strong> {p.age}</p>
                <p><strong>Gender:</strong> {p.gender}</p>
                <p><strong>Phone:</strong> {p.phone}</p>
                <p><strong>Email:</strong> {p.email}</p>
                <p><strong>Address:</strong> {p.address}</p>
                <p><strong>ID:</strong> {p.patient_id}</p>
              </div>
              <button
                onClick={(e) => handleDelete(p.patient_id, e)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm mt-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No patients found.</p>
      )}
    </div>
  );
};

export default FrontDeskDashboard;
