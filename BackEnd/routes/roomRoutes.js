const express = require("express")
const router = express.Router()
const controller = require("../controllers/roomController")
const { verifyToken, allowRoles } = require("../middlewares/auth")

router.post("/:patient_id/admit", verifyToken, allowRoles("frontdesk"), controller.admitPatient)
      .post("/:patient_id/discharge", verifyToken, allowRoles("frontdesk"), controller.dischargePatient)
      .get("/list",verifyToken, allowRoles("frontdesk"), controller.getRooms)
      .get("/:patient_id/admission", verifyToken, allowRoles("frontdesk"), controller.getAdmissionDetails)

module.exports = router
