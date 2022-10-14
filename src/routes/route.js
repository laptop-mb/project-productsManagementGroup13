const express = require("express")
const  router = express.Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const auth = require("../middlewares/auth")


router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

router.get("/user/:userId/profile",auth.Authentication,auth.Authorization,userController.getUserbyId)
router.put("/user/:userId/profile",auth.Authentication,auth.Authorization, userController.updateUser)

//==============================user=====================================================//

router.post("/products", productController.createProduct)
router.get("/products",productController.getProducts)
router.get("/products/:productId", productController.getProducstById)
router.put("/products/:productId", productController.updateProduct)
router.delete("/products/:productId", productController.deleteProduct)

//===============================products=================================================//

module.exports = router
