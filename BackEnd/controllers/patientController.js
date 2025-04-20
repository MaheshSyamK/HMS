
const db = require("../models/db.js")

// Get all patients
exports.getAllPatients = (_, res) => {
    const query = "SELECT * FROM patients"

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Internal server error" })
        return res.status(200).json({ patients: results })
    })
}

// Get a patient by ID
exports.getPatientById = (req, res) => {
    const patientId = req.params.id
    const query = "SELECT * FROM patients WHERE patient_id = ?"

    db.query(query, [patientId], (err, results) => {
        if (err) return res.status(500).json({ message: "Internal server error" })
        if (results.length === 0) return res.status(404).json({ message: "Patient not found" })
        return res.status(200).json({ patient: results[0] })
    })
}

// Register a new patient or return existing one based on email
exports.registerPatient = (req, res) => {
    const { name, age, gender, address, phone, email } = req.body
    if (!name || !age || !gender || !address || !phone || !email) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const checkQuery = "SELECT * FROM patients WHERE email = ?"
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Internal server error" })
        if (results.length > 0) {
            return res.status(200).json({
                message: "Patient already exists",
                patient: results[0]
            })
        }

        const insertQuery = `INSERT INTO patients (name, age, gender, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)`
        db.query(insertQuery, [name, age, gender, address, phone, email], (err, result) => {
            if (err) return res.status(500).json({ message: "Internal server error" })
            return res.status(201).json({
                message: "Patient registered successfully",
                patientId: result.insertId
            })
        })
    })
}

// Update patient by ID
exports.updatePatient = (req, res) => {
    const id = req.params.id
    const { name, age, gender, address, phone, email } = req.body

    if (!name || !age || !gender || !address || !phone || !email) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const updateQuery = `UPDATE patients SET name = ?, age = ?, gender = ?, address = ?, phone = ?, email = ? WHERE patient_id = ?`

    db.query(updateQuery, [name, age, gender, address, phone, email, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal server error" })
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Patient not found" })
        }

        return res.status(200).json({ message: "Patient updated successfully" })
    })
}

// Delete patient
exports.deletePatient = (req, res) => {
    const patientId = req.params.id
    const query = "DELETE FROM patients WHERE patient_id = ?"

    db.query(query, [patientId], (err, result) => {
        if (err) return res.status(500).json({ message: "Internal server error", err })
        if (result.affectedRows === 0) return res.status(404).json({ message: "Patient not found" })
        return res.status(200).json({ message: "Patient deleted successfully" })
    })
}
