
const db = require("../models/db.js")
const jwt = require("jsonwebtoken")

// GET all users (Admin, FrontDesk, DataEntry, Doctors)
exports.getAllUsers = (_, res) => {
    const query = "Select * from users"
    db.query(query, (err, results) => {
        if(err) return res.status(500).json({message: err})
        return res.status(200).json({message: "Fetched ALL Users.", results})
    })
}

// Delete User by Id
exports.deleteUser = (req, res) => {
    const id = req.params.id
    const query = "DELETE from users where user_id=?"
    db.query(query, [id], (err, results) => {
        if(err) return res.status(500).json({message: err})
        if(results.affectedRows == 0) return res.status(500).json({message: "User Not Found."})
        res.status(200).json({message: "User Deleted successfully."})
    })
}

// Register User
exports.registerUser = (req, res) => {
    const { name, email, password, role, specialization, phone, shift, department } = req.body

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All required fields are not provided" })
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?"
    db.query(checkQuery, [email], (err, result) => {
        if (err) return res.status(500).json({ message: err.message })

        if (result.length > 0) {
            return res.status(409).json({ message: "User already exists with this email" })
        }

        const insertUserQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
        db.query(insertUserQuery, [name, email, password, role], (err, result) => {
            if (err) return res.status(500).json({ message: err.message })

            const userId = result.insertId

            // Insert into respective tables based on role
            if (role === "doctor") {
                if (!specialization || !phone) {
                    return res.status(400).json({ message: "Doctor details required: specialization and phone" })
                }

                const doctorQuery = "INSERT INTO doctors (user_id, specialization, phone) VALUES (?, ?, ?)"
                db.query(doctorQuery, [userId, specialization, phone], (err) => {
                    if (err) return res.status(500).json({ message: err.message })
                    return res.status(201).json({ message: "Doctor registered successfully", userId })
                })

            } else if (role === "frontdesk") {
                if (!phone) {
                    return res.status(400).json({ message: "Frontdesk details required: phone ." })
                }

                const frontdeskQuery = "INSERT INTO frontdesk (user_id, phone) VALUES (?, ?)"
                db.query(frontdeskQuery, [userId, phone], (err) => {
                    if (err) return res.status(500).json({ message: err.message })
                    return res.status(201).json({ message: "Frontdesk registered successfully", userId })
                })

            } else if (role === "dataentry") {
                if (!phone) {
                    return res.status(400).json({ message: "Dataentry details required: phone." })
                }

                const dataentryQuery = "INSERT INTO dataentry (user_id, phone) VALUES (?, ?)"
                db.query(dataentryQuery, [userId, phone], (err) => {
                    if (err) return res.status(500).json({ message: err.message })
                    return res.status(201).json({ message: "DataEntry registered successfully", userId })
                })

            } else {
                return res.status(201).json({ message: "Admin or basic user registered successfully", userId })
            }
        })
    })
}


// Login User 
exports.loginUser = (req, res) => {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required" })
    }

    const query = "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?"
    db.query(query, [email, password, role], (err, results) => {
        if (err) return res.status(500).json({ message: err.message })

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials or role mismatch" })
        }

        const user = results[0]

        const token = jwt.sign(
            {
                id: user.user_id,
                role: user.role
            },
            process.env.MY_SECRET_KEY,
            { expiresIn: "1h" }
        )

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    })
}


exports.logoutUser = async (req, res) => {
    try {
      // If using sessions:
      // req.session.destroy()
      // If using JWT without blacklist — just tell frontend to remove the token
      res.status(200).json({ message: "Logout successful" })
    } catch (error) {
      res.status(500).json({ message: "Error logging out", error })
    }
  }
  