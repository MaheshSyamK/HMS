const db = require("../models/db.js");

// Admit a Patient
exports.admitPatient = async (req, res) => {
    const patient_id = req.params.patient_id;
    const { room_id } = req.body;

    if (!patient_id || !room_id) {
        return res.status(400).json({ message: "Missing patient or room" });
    }

    try {
        // Check if the room exists and is available
        const [roomResult] = await db.promise().query("SELECT * FROM rooms WHERE room_id = ?", [room_id]);
        if (roomResult.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        const room = roomResult[0];
        if (room.occupied) {
            return res.status(400).json({ message: "Room already occupied" });
        }

        // Check if patient is already admitted (patient should not be admitted twice)
        const [existingAdmissionResult] = await db.promise().query(
            "SELECT * FROM admissions WHERE patient_id = ? AND discharge_date IS NULL",
            [patient_id]
        );
        if (existingAdmissionResult.length > 0) {
            return res.status(400).json({ message: "Patient is already admitted" });
        }

        // Admit the patient and record the admission in the admissions table
        const [admissionResult] = await db.promise().query(
            "INSERT INTO admissions (patient_id, room_id, admitted_at, status) VALUES (?, ?, NOW(), 'admitted')",
            [patient_id, room_id]
        );

        const admission_id = admissionResult.insertId;

        // Update the room status to occupied
        await db.promise().query(
            "UPDATE rooms SET occupied = 1 WHERE room_id = ?",
            [room_id]
        );

        return res.status(201).json({
            message: "Patient admitted successfully",
            admission_id: admission_id,
        });

    } catch (error) {
        console.error("Admission failed:", error);
        return res.status(500).json({ message: "Admission failed", error });
    }
};


// Discharge a Patient
exports.dischargePatient = async (req, res) => {
    const { admission_id } = req.body;

    if (!admission_id) {
        return res.status(400).json({ message: "Admission ID is required" });
    }

    try {
        // Fetch the admission details to check if the patient is already discharged
        const [admissionResult] = await db.promise().query(
            "SELECT * FROM admissions WHERE admission_id = ?",
            [admission_id]
        );

        if (admissionResult.length === 0) {
            return res.status(404).json({ message: "Admission not found" });
        }

        const admission = admissionResult[0];
        const room_id = admission.room_id;

        // Check if the patient is already discharged
        if (admission.status === 'discharged') {
            return res.status(400).json({ message: "Patient is already discharged" });
        }

        // Update admission status and set discharge date
        await db.promise().query(
            "UPDATE admissions SET status = 'discharged', discharge_date = NOW() WHERE admission_id = ?",
            [admission_id]
        );

        // Free the room by updating its status to unoccupied
        await db.promise().query(
            "UPDATE rooms SET occupied = 0 WHERE room_id = ?",
            [room_id]
        );

        return res.status(200).json({ message: "Patient discharged successfully" });

    } catch (error) {
        console.error("Failed to discharge patient:", error);
        return res.status(500).json({ message: "Discharge failed", error });
    }
};


// Get Admission Details for a Patient
exports.getAdmissionDetails = async (req, res) => {
    const { patient_id } = req.params;  // Now using patient_id

    try {
        // Fetch admission details for the specific patient
        const [admissionResult] = await db.promise().query(
            `SELECT a.admission_id, a.patient_id, a.admitted_at, r.room_id 
             FROM admissions a 
             JOIN rooms r ON a.room_id = r.room_id 
             WHERE a.patient_id = ? AND a.discharge_date IS NULL`,
            [patient_id]
        );

        if (admissionResult.length === 0) {
            return res.status(404).json({ message: "No active admission found for this patient" });
        }

        return res.status(200).json({ admission_id: admissionResult[0].admission_id });

    } catch (error) {
        console.error("Error fetching admission details:", error);
        return res.status(500).json({ message: "Server error while fetching admission details", error });
    }
};




// Get All Rooms
exports.getRooms = (req, res) => {
    const query = "SELECT * FROM rooms";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Fetch error:", err);
            return res.status(500).json({ message: "Error fetching rooms" });
        }

        return res.status(200).json({ rooms: result });
    });
};
