
const db = require("../models/db")


// Get all the patients in queue
exports.getDoctorDashboard = (req, res) => {
    const userId = req.user.id;
    const getDoctorIdQuery = "SELECT doctor_id FROM doctors WHERE user_id = ?";

    db.query(getDoctorIdQuery, [userId], (err, doctorResult) => {
        if (err) {
            console.error("Doctor ID fetch error:", err);
            return res.status(500).json({ message: "Failed to get doctor information" });
        }

        if (doctorResult.length === 0) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const doctorId = doctorResult[0].doctor_id;

        const appointmentsQuery = `
            SELECT 
                a.*, 
                p.name AS patient_name, 
                p.age, 
                p.gender, 
                p.phone,
                COALESCE(MAX(pr.is_prescribed), FALSE) AS is_prescribed
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            LEFT JOIN prescriptions pr 
                ON pr.patient_id = a.patient_id AND pr.doctor_id = a.doctor_id
            WHERE a.doctor_id = ?
                AND a.status = 'Scheduled'
            GROUP BY a.appointment_id, p.name, p.age, p.gender, p.phone
            ORDER BY is_prescribed ASC, a.appointment_time ASC
        `;

        db.query(appointmentsQuery, [doctorId], (err, results) => {
            if (err) {
                console.error("Appointments fetch error:", err);
                return res.status(500).json({ message: "Failed to get appointments" });
            }

            return res.status(200).json({ doctorId, appointments: results });
        });
    });
};

  


// Get specific patient information
exports.getPatientDetails = (req, res) => {
    const patientId = req.params.patient_id

    const query = `SELECT * FROM patients WHERE patient_id = ?`
    db.query(query, [patientId], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal server error" })
        if (result.length === 0) return res.status(404).json({ message: "Patient not found" })

        return res.status(200).json(result[0])
    })
}



// Record treatment/prescription
exports.addPrescription = (req, res) => {
    const userId = req.user.id;
    const { patient_id, medicine, dosage } = req.body;

    if (!patient_id || !medicine || !dosage) {
        return res.status(400).json({ message: "Patient ID, medicine, and dosage are required" });
    }

    const getDoctorQuery = "SELECT doctor_id FROM doctors WHERE user_id = ?";
    db.query(getDoctorQuery, [userId], (err, doctorResult) => {
        if (err) {
            console.error("Doctor lookup error:", err);
            return res.status(500).json({ message: "Internal server error while looking up doctor" });
        }

        if (doctorResult.length === 0) {
            return res.status(400).json({ message: "Doctor not found" });
        }

        const doctorId = doctorResult[0].doctor_id;

        const checkPatientQuery = "SELECT * FROM patients WHERE patient_id = ?";
        db.query(checkPatientQuery, [patient_id], (err, patientResult) => {
            if (err) {
                console.error("Patient lookup error:", err);
                return res.status(500).json({ message: "Internal server error while looking up patient" });
            }

            if (patientResult.length === 0) {
                return res.status(400).json({ message: "Patient not found" });
            }

            const insertQuery = `
                INSERT INTO prescriptions (doctor_id, patient_id, medicine, dosage)
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertQuery, [doctorId, patient_id, medicine, dosage], (err, insertResult) => {
                if (err) {
                    console.error("Prescription insert error:", err);
                    return res.status(500).json({ message: "Error saving prescription" });
                }

                const updateQuery = `
                    UPDATE prescriptions 
                    SET is_prescribed = TRUE 
                    WHERE doctor_id = ? AND patient_id = ? 
                    LIMIT 1
                `;
                db.query(updateQuery, [doctorId, patient_id], (err, updateResult) => {
                    if (err) {
                        console.error("Prescription update error:", err);
                        return res.status(500).json({ message: "Error updating is_prescribed" });
                    }
                    return res.status(201).json({ message: "Prescription recorded and is_prescribed updated successfully" });
                });
            });
        });
    });
};


// Get prescription history of a patient
exports.getPrescriptionHistory = (req, res) => {
    const patientId = req.params.patient_id;

    const query = `
        SELECT prescriptions.*
        FROM prescriptions 
        WHERE prescriptions.patient_id = ?
        ORDER BY issued_at DESC
    `;

    db.query(query, [patientId], (err, result) => {
        if (err) {
            console.error("Prescription history fetch error:", err);
            return res.status(500).json({ message: "Failed to fetch prescription history" });
        }

        return res.status(200).json(result);
    });
};

