import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DoctorPatientDetails = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionHistory, setShowPrescriptionHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, prescriptionRes] = await Promise.all([
          fetch(`http://localhost:5000/api/doctors/dashboard/${patient_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`http://localhost:5000/api/doctors/dashboard/${patient_id}/prescriptions`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const patientData = await patientRes.json();
        const prescriptionData = await prescriptionRes.json();

        if (patientRes.status === 401 || patientRes.status === 403) {
          setErrorMsg("Access denied. Please login with correct credentials.");
        } else if (patientRes.ok) {
          setPatient(patientData);
        } else {
          setErrorMsg(patientData.message || "Patient not found");
        }

        if (prescriptionRes.ok) {
          setPrescriptions(prescriptionData);
        } else {
          console.error("Error fetching prescriptions.");
        }
      } catch (error) {
        setErrorMsg("Failed to fetch patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patient_id]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:5000/api/doctors/dashboard/prescribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ patient_id, medicine, dosage }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(data.message);
        setMedicine("");
        setDosage("");
        // Optionally re-fetch prescription history
        setPrescriptions((prev) => [
          ...prev,
          {
            medicine,
            dosage,
            issued_at: new Date().toISOString(),
            prescription_id: Date.now(), // temporary unique key
          },
        ]);
      } else {
        setErrorMsg(data.message || "Failed to submit prescription.");
      }
    } catch (error) {
      setErrorMsg("Error submitting prescription.");
    }
  };

  const handlePrescriptionHistoryToggle = () => {
    setShowPrescriptionHistory(!showPrescriptionHistory);
  };

  if (loading) return <p>Loading patient details...</p>;
  if (errorMsg) return <p className="text-red-600">{errorMsg}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        <span role="img" aria-label="stethoscope" className="mr-2">🩺</span> Patient Details
      </h2>

      {patient ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Registered At:</strong> {new Date(patient.registered_at).toLocaleString()}</p>
        </div>
      ) : (
        <p>Patient data not found.</p>
      )}

      <h3 className="text-xl font-semibold text-green-600 mb-4">Write Prescription</h3>
      <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
        <input
          type="text"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Medicine name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Dosage (e.g., 500mg twice daily)"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit Prescription
        </button>
      </form>

      <h3 className="text-xl font-semibold text-purple-700 mt-10 mb-4">
        <button
          onClick={handlePrescriptionHistoryToggle}
          className="text-green-1200 hover:text-green-1200"
        >
          {showPrescriptionHistory ? "Hide" : "Show"} Prescription History
        </button>
      </h3>

      {showPrescriptionHistory && (
        <div>
          {prescriptions.length === 0 ? (
            <p className="text-gray-600">No prescription history found.</p>
          ) : (
            <ul className="space-y-4">
              {prescriptions.map((presc) => (
                <li key={presc.prescription_id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600">
                  <p><strong>Issued At:</strong> {new Date(presc.issued_at).toLocaleString()}</p>
                  <p><strong>Medicine:</strong> {presc.medicine}</p>
                  <p><strong>Dosage:</strong> {presc.dosage}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}

      <br />
      <button
        onClick={() => navigate("/doctor/dashboard")}
        className="mt-6 inline-flex items-center bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
      >
        <span role="img" aria-label="back" className="mr-2">🔙</span> Back to Dashboard
      </button>
    </div>
  );
};

export default DoctorPatientDetails;
