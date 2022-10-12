const express = require("express")
const  router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")


router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

router.get("/user/:userId/profile",auth.Authentication,auth.Authorization,userController.getUser)

router.put("/user/:userId/profile",auth.Authentication,auth.Authorization, userController.updateUser)


module.exports = router
