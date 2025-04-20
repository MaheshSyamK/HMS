
const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController.js")
const { verifyToken, allowRoles } = require("../middlewares/auth.js")


router.post("/register", userController.registerUser)
      .post("/login", userController.loginUser)
      .post("/logout", verifyToken, userController.logoutUser) 
      .get("/", verifyToken, allowRoles("admin"), userController.getAllUsers)    
      .delete("/:id", verifyToken, allowRoles("admin"), userController.deleteUser)  

module.exports = router
