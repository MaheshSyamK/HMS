
const express = require("express");
const router = express.Router();
const dataEntryController = require("../controllers/dataEntryController.js");
const { verifyToken, allowRoles } = require("../middlewares/auth.js");


router.use(verifyToken, allowRoles("dataentry"))
      .get("/patients", dataEntryController.getAllPatients)
      .get("/patients/:patient_id", dataEntryController.getPatientById)
      .post("/patients/:patient_id/tests", dataEntryController.addTest)
      .post("/patients/:patient_id/treatments", dataEntryController.addTreatment)
      .get("/patients/:patient_id/tests", dataEntryController.getTestHistory)
      .get("/patients/:patient_id/treatments", dataEntryController.getTreatmentHistory)
      .get('/patients/:patient_id/doctor_id', dataEntryController.getDoctorId)
module.exports = router;
