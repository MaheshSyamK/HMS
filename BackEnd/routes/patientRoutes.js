
const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { verifyToken, allowRoles } = require("../middlewares/auth");

router
  .get("/", verifyToken, allowRoles("frontdesk", "admin"), patientController.getAllPatients)
  .get("/:id", verifyToken, allowRoles("frontdesk", "admin"), patientController.getPatientById)
  .post("/register", verifyToken, allowRoles("frontdesk"), patientController.registerPatient)
  .put("/update/:id", verifyToken, allowRoles("frontdesk"), patientController.updatePatient)
  .delete("/delete/:id", verifyToken, allowRoles("frontdesk", "admin"), patientController.deletePatient);

module.exports = router;
