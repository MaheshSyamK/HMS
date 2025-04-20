import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📥 DoctorDashboard mounted");

    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("✅ Fetched patients data:", data);

        setPatients(data.appointments || []);
      } catch (err) {
        console.error("❌ Failed to fetch patients for doctor:", err);
      }
    };

    fetchPatients();

    return () => {
      console.log("📤 DoctorDashboard unmounted");
    };
  }, []);

  const handlePatientClick = (patientId) => {
    console.log(`🖱️ Clicked on patient ID: ${patientId}`);
    navigate(`/doctor/${patientId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Separate patients
  const prescribed = patients.filter(p => p.is_prescribed);
  const notPrescribed = patients.filter(p => !p.is_prescribed);

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen relative">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        <span role="img" aria-label="Doctor">👨‍⚕️</span> Doctor Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Logout
      </button>

      {notPrescribed.length > 0 && (
        <>
          <h2 className="text-xl text-red-600 mb-2">Not Yet Prescribed</h2>
          <div className="flex flex-wrap gap-6 mb-6">
            {notPrescribed.map((patient) => (
              <div
                key={patient.patient_id}
                className="bg-white p-6 rounded-lg shadow-lg w-72 cursor-pointer hover:bg-red-50 transition"
                onClick={() => handlePatientClick(patient.patient_id)}
              >
                <h3 className="text-xl font-semibold text-red-600 mb-2">{patient.patient_name}</h3>
                <p className="text-gray-700"><strong>Age:</strong> {patient.age}</p>
                <p className="text-gray-700"><strong>Gender:</strong> {patient.gender}</p>
                <p className="text-gray-700"><strong>Mob No:</strong> {patient.phone}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {prescribed.length > 0 && (
        <>
          <h2 className="text-xl text-green-600 mb-2">Already Prescribed</h2>
          <div className="flex flex-wrap gap-6">
            {prescribed.map((patient) => (
              <div
                key={patient.patient_id}
                className="bg-white p-6 rounded-lg shadow-lg w-72 cursor-pointer hover:bg-green-50 transition"
                onClick={() => handlePatientClick(patient.patient_id)}
              >
                <h3 className="text-xl font-semibold text-green-600 mb-2">{patient.patient_name}</h3>
                <p className="text-gray-700"><strong>Age:</strong> {patient.age}</p>
                <p className="text-gray-700"><strong>Gender:</strong> {patient.gender}</p>
                <p className="text-gray-700"><strong>Mob No:</strong> {patient.phone}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {patients.length === 0 && (
        <p className="text-gray-600">No patients assigned yet.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
