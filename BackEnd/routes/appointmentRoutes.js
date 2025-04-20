const express = require("express")
const router = express.Router()
const controller = require("../controllers/appointmentController")
const { verifyToken, allowRoles } = require("../middlewares/auth")

router.post("/:patient_id/book", verifyToken, allowRoles("frontdesk"), controller.bookAppointment)
    .get("/list", verifyToken, allowRoles("frontdesk"), controller.getDoctorList)

module.exports = router
