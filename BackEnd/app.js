
const express = require("express")
const cors = require("cors")
require("dotenv").config() // no need working
require("./models/db.js")
const app = express()

const userRoutes = require("./routes/userRoutes.js")
const patientRoutes = require("./routes/patientRoutes.js")
const doctorRoutes = require("./routes/doctorRoutes")
const dataEntryRoutes = require("./routes/dataEntryRoutes.js")
const appointmentRoutes = require("./routes/appointmentRoutes")
const roomRoutes = require("./routes/roomRoutes")



app.use(express.json())
app.use(cors())
app.use("/api/users", userRoutes)
app.use("/api/patients", patientRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/dataEntry", dataEntryRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/rooms", roomRoutes)


const PORT_NO = process.env.PORT_NO || 5000
app.listen( PORT_NO, ()=> {
    console.log(`Server listening on port : ${PORT_NO}`)
})
