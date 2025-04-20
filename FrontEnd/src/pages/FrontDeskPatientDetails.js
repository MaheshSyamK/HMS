import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FrontDeskPatientDetails = () => {
  const { patient_id } = useParams();

  const [patient, setPatient] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [appointmentData, setAppointmentData] = useState({
    doctorUserId: "",
    doctorId: "",
    time: "",
    success: false,
  });

  const [admitData, setAdmitData] = useState({
    roomId: "",
    success: false,
    dischargeSuccess: false,
  });

  const [error, setError] = useState("");

  // Fetch Patient Details
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/${patient_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch patient details");
        const data = await res.json();
        setPatient(data.patient);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patient_id, admitData.dischargeSuccess]);

  // Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctorList(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rooms/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRoomList(Array.isArray(data) ? data : data.rooms || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRooms();
  }, [admitData.success, admitData.dischargeSuccess]);

  // Update doctorId when selected
  useEffect(() => {
    const selected = doctorList.find(doc => doc.user_id === parseInt(appointmentData.doctorUserId));
    if (selected) {
      setAppointmentData(prev => ({ ...prev, doctorId: selected.doctor_id }));
    }
  }, [appointmentData.doctorUserId, doctorList]);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAppointmentData(prev => ({ ...prev, success: false }));

    const { doctorId, time } = appointmentData;
    if (!doctorId || !time) return setError("Please provide appointment details.");

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${patient_id}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ doctor_id: doctorId, appointment_time: time }),
      });

      if (!res.ok) throw new Error("Failed to book appointment");
      setAppointmentData(prev => ({ ...prev, success: true }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdmitSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAdmitData(prev => ({ ...prev, success: false }));

    if (!admitData.roomId) return setError("Please select a room.");

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${patient_id}/admit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ room_id: admitData.roomId }),
      });

      if (!res.ok) throw new Error(await res.text());
      setAdmitData(prev => ({ ...prev, success: true }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDischarge = async () => {
    console.log("patient_id: ", patient_id); // Check if patient_id is correct
    setError(""); // Reset previous errors
    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token); // Ensure token is present
      if (!token) {
        setError("No token found in localStorage.");
        return;
      }
  
      // Fetch admission data
      const res = await fetch(`http://localhost:5000/api/rooms/${patient_id}/admission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Admission fetch failed");
  
      const admissionData = await res.json();
      console.log("Admission Response Data: ", admissionData); 
  
      const { admission_id } = admissionData; 
  
      if (!admission_id) {
        setError("Invalid admission ID");
        return;
      }
  
      // Check the request body for discharge
      const body = JSON.stringify({ admission_id });
      console.log("Request Body: ", body); // Log request body
  
      // Fetch discharge data
      const dischargeRes = await fetch(`http://localhost:5000/api/rooms/${patient_id}/discharge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!dischargeRes.ok) {
        const errData = await dischargeRes.json();
        console.log("Error response from discharge API: ", errData); 
        throw new Error(errData.message || "Discharge failed");
      }
  
      setAdmitData(prev => ({ ...prev, dischargeSuccess: true }));
    } catch (err) {
      console.error("Error during discharge:", err); // Log the error
      setError(err.message); // Update the UI with error message
    }
  };
  
  

  if (loading) return <p className="text-center text-lg text-gray-500">Loading patient details...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-blue-900">Patient Details</h2>

        <div className="space-y-2 text-gray-700 text-lg">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Address:</strong> {patient.address}</p>
        </div>

        {/* Appointment Form */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Book an Appointment</h3>
          {appointmentData.success && <p className="text-green-600 mt-2">Appointment booked successfully!</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <form onSubmit={handleAppointmentSubmit} className="space-y-6 mt-4">
            <div className="flex flex-col">
              <label htmlFor="doctorSelect" className="font-medium text-gray-700">Select Doctor</label>
              <select
                id="doctorSelect"
                className="p-3 border border-gray-300 rounded-lg"
                value={appointmentData.doctorUserId}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, doctorUserId: e.target.value }))}
              >
                <option value="">-- Select Doctor --</option>
                {doctorList.map((doctor) => (
                  <option key={doctor.user_id} value={doctor.user_id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="appointment_time" className="font-medium text-gray-700">Appointment Time</label>
              <input
                type="datetime-local"
                id="appointment_time"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Book Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Admit Patient Form */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Admit Patient</h3>
          {admitData.success && <p className="text-green-600 mt-2">Patient admitted successfully!</p>}
          {admitData.dischargeSuccess && <p className="text-green-600 mt-2">Patient discharged successfully!</p>}

          <form onSubmit={handleAdmitSubmit} className="space-y-6 mt-4">
            <div className="flex flex-col">
              <label htmlFor="roomSelect" className="font-medium text-gray-700">Select Room</label>
              <select
                id="roomSelect"
                className="p-3 border border-gray-300 rounded-lg"
                value={admitData.roomId}
                onChange={(e) => setAdmitData(prev => ({ ...prev, roomId: e.target.value }))}
              >
                <option value="">-- Select Room --</option>
                {roomList.map((room) => (
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_number} ({room.type} - {room.capacity} beds)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Admit Patient
              </button>

              <button
                type="button"
                onClick={handleDischarge}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Discharge Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskPatientDetails;
