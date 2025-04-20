
const db = require("../models/db.js")

// Add a new test result
exports.addTest = (req, res) => {

    const { patient_id, test_name, result } = req.body
    if (!patient_id || !test_name) {
        return res.status(400).json({ message: "Patient ID and test name are required" })
    }

    const query = `INSERT INTO tests (patient_id, test_name, test_date, result) VALUES (?, ?, NOW(), ?)`
    db.query(query, [patient_id, test_name, result || null], (err) => {
        if (err) {
            console.error("Test insert error:", err)
            return res.status(500).json({ message: "Failed to record test" })
        }
        res.status(201).json({ message: "Test recorded successfully" })
    })
}


// Add a new treatment
exports.addTreatment = (req, res) => {

    const { patient_id, doctor_id, description } = req.body
    if (!patient_id || !doctor_id || !description) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const query = `INSERT INTO treatments (patient_id, doctor_id, description, treatment_date) VALUES (?, ?, ?, NOW())`
    db.query(query, [patient_id, doctor_id, description], (err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to record treatment" })
        }
        res.status(201).json({ message: "Treatment recorded successfully" })
    })
}


// Get test history for a patient
exports.getTestHistory = (req, res) => {
    const { patient_id } = req.params

    const query = "SELECT * FROM tests WHERE patient_id = ? ORDER BY test_date DESC"
    db.query(query, [patient_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch test history" })
        }
        res.status(200).json({ tests: results })
    })
}


// Get treatment history for a patient
exports.getTreatmentHistory = (req, res) => {
    const patient_id = req.params.patient_id

    const query = `
        SELECT t.*, u.name AS doctor_name
        FROM treatments t
        JOIN doctors d ON t.doctor_id = d.doctor_id
        JOIN users u ON d.user_id = u.user_id
        WHERE t.patient_id = ?
        ORDER BY t.treatment_date DESC
    `

    db.query(query, [patient_id], (err, results) => {
        if (err) {
            console.error("Error in getTreatmentHistory:", err) // Log the actual error
            return res.status(500).json({ message: "Failed to fetch treatment history" })
        }
        res.status(200).json({ treatments: results })
    })
}




// Get all patients 
exports.getAllPatients = (req, res) => {
    db.query("SELECT patient_id, name, age, gender FROM patients", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Failed to retrieve patients" })
        }
        res.status(200).json({ patients: results })
    })
}


// Get specific patient details
exports.getPatientById = (req, res) => {
    const patientId = req.params.patient_id

    const query = `
        SELECT * FROM patients WHERE patient_id = ?
    `

    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error("Error fetching patient details:", err)
            return res.status(500).json({ message: "Internal server error" })
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Patient not found" })
        }

        return res.status(200).json({ patient: results[0] })
    })
}


exports.getDoctorId = (req, res) => {
    const patient_id = req.params.patient_id;
  
    const query = `SELECT doctor_id from appointments WHERE patient_id = ?`
    db.query(query, [patient_id], (err, results) => {
        if(err) {
            console.log("Error")
            return res.status(500).json({message : "Internal Server Error"})
        }

        if(results.length === 0){
            return res.status(404).json({message: results[0]})
        }

        return res.status(200).json({doctor_id: results[0]})
    })
  };
  
  
