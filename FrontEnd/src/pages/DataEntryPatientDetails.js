import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DataEntryPatientDetails = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState({});
  const [testData, setTestData] = useState({ patient_id, test_name: "", result: "" });
  const [treatmentData, setTreatmentData] = useState({ patient_id, doctor_id: "", description: "" });
  const [testHistory, setTestHistory] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatient(data.patient);
    };
    fetchPatient();
  }, [patient_id, token]);

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}/doctor_id`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          const actualDoctorId = data.doctor_id?.doctor_id;
          setTreatmentData((prev) => ({ ...prev, doctor_id: actualDoctorId }));
        } else {
          alert(data.message || "Doctor ID fetch failed.");
        }
      } catch (error) {
        console.error("Error fetching doctor ID:", error);
      }
    };
    fetchDoctorId();
  }, [patient_id, token]);

  const handleAddTest = async () => {
    if (!testData.test_name) return alert("Test name required");

    const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}/tests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    const data = await res.json();
    alert(data.message);
    setTestData({ patient_id, test_name: "", result: "" });
  };

  const handleAddTreatment = async () => {
    if (!treatmentData.description.trim()) return alert("Description is required");

    const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}/treatments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(treatmentData),
    });

    const data = await res.json();
    alert(data.message);
    setTreatmentData({ ...treatmentData, description: "" });
  };

  const fetchTestHistory = async () => {
    const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}/tests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTestHistory(data.tests || []);
  };

  const fetchTreatmentHistory = async () => {
    const res = await fetch(`http://localhost:5000/api/dataEntry/patients/${patient_id}/treatments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTreatmentHistory(data.treatments || []);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate("/dataentry/dashboard")}
        className="text-blue-600 font-medium hover:underline mb-6 flex items-center"
      >
        <span role="img" aria-label="back">🔙</span> Back to Dashboard
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-4">Patient: {patient.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Test */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Add Test</h3>
          <input
            type="text"
            placeholder="Test Name"
            value={testData.test_name}
            onChange={(e) => setTestData({ ...testData, test_name: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Result"
            value={testData.result}
            onChange={(e) => setTestData({ ...testData, result: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleAddTest}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <span role="img" aria-label="add test">➕</span> Add Test
          </button>
        </div>

        {/* Add Treatment */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
          <h3 className="text-xl font-semibold mb-3 text-green-600">Add Treatment</h3>
          <input
            type="text"
            placeholder="Description"
            value={treatmentData.description}
            onChange={(e) => setTreatmentData({ ...treatmentData, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleAddTreatment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <span role="img" aria-label="add treatment">➕</span> Add Treatment
          </button>
        </div>
      </div>

      {/* History Controls */}
      <div className="mb-4 space-x-4">
        <button
          onClick={fetchTestHistory}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          <span role="img" aria-label="test history">📜</span> Test History
        </button>
        <button
          onClick={fetchTreatmentHistory}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          <span role="img" aria-label="treatment history">📜</span> Treatment History
        </button>
      </div>

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6 border-l-4 border-purple-500">
          <h4 className="text-lg font-semibold mb-2 text-purple-700">Test History</h4>
          <ul className="list-disc pl-5">
            {testHistory.map((test, idx) => (
              <li key={idx}>
                <strong>{test.test_name}</strong> – {test.result || "No Result"} on{" "}
                {new Date(test.test_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatment History */}
      {treatmentHistory.length > 0 && (
        <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
          <h4 className="text-lg font-semibold mb-2 text-yellow-700">Treatment History</h4>
          <ul className="list-disc pl-5">
            {treatmentHistory.map((treat, idx) => (
              <li key={idx}>
                <strong>{treat.description}</strong> by Dr. {treat.doctor_name} on{" "}
                {new Date(treat.treatment_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataEntryPatientDetails;
