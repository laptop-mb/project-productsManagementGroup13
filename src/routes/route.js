const express = require("express")
const  router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const auth = require("../middlewares/auth")


router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

router.get("/user/:userId/profile",auth.Authentication,auth.Authorization,userController.getUser)
router.put("/user/:userId/profile",auth.Authentication,auth.Authorization, userController.updateUser)

//==============================user=====================================================//

router.post("/products", productController.createProduct)
router.get("/products/:productId", productController.getProducstById)
// router.put("/products/:productId", productController.createProduct)
// router.delete("/products/:productId", productController.createProduct)

//===============================products=================================================//
router.get("/products",productController.getProducts)

module.exports = router
