const express = require("express")
const  router = express.Router()
const userController = require("../controllers/userController")


router.post("/register", userController.createUser)


router.put("/user/profile", userController.updateUser)


module.exports = router
