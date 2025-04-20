const db = require("../models/db.js")

// Book appointment to the doctor
exports.bookAppointment = (req, res) => {
    const patient_id = req.params.patient_id
    const { doctor_id, appointment_time } = req.body

    if (!patient_id || !doctor_id || !appointment_time)
        return res.status(400).json({ message: "Missing fields" })

    const query = `
        INSERT INTO appointments (patient_id, doctor_id, appointment_time)
        VALUES (?, ?, ?)
    `
    db.query(query, [patient_id, doctor_id, appointment_time], (err, result) => {
        if (err) return res.status(500).json({ message: "Booking failed", err })
        return res.status(201).json({ message: "Appointment booked", id: result.insertId })
    })
}


// Get doctor list -- correct code 
// exports.getDoctorList = (req, res) => {
//     const query = `
//       SELECT DISTINCT users.user_id, users.name, doctors.doctor_id
//       FROM users
//       JOIN doctors ON users.user_id = doctors.user_id
//       WHERE users.role = 'doctor'
//     `
  
//     db.query(query, (err, result) => {
//       if (err) {
//         console.error("Error fetching doctor list:", err)
//         return res.status(500).json({ error: "Failed to fetch doctor list" })
//       }
  
//       res.status(200).json(result)
//     })
//   }


exports.getDoctorList = (req, res) => {
  const query = `
    SELECT users.user_id, users.name, MAX(doctors.doctor_id) as doctor_id
    FROM users
    JOIN doctors ON users.user_id = doctors.user_id
    WHERE users.role = 'doctor'
    GROUP BY users.user_id, users.name
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching doctor list:", err);
      return res.status(500).json({ error: "Failed to fetch doctor list" });
    }

    res.status(200).json(result); // should return unique doctors now
  });
};




