const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { verifyToken, allowRoles } = require("../middlewares/auth");

router
  .get("/dashboard", verifyToken, allowRoles("doctor"), doctorController.getDoctorDashboard)
  .get("/dashboard/:patient_id", verifyToken, allowRoles("doctor"), doctorController.getPatientDetails)
  .post("/dashboard/prescribe", verifyToken, allowRoles("doctor"), doctorController.addPrescription)
  .get("/dashboard/:patient_id/prescriptions",verifyToken,allowRoles("doctor"),doctorController.getPrescriptionHistory);
  
module.exports = router;