const { findOne } = require("../models/cartModel")
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const valid = require("../validators/userValidator")


const createCart = async function(req,res){
    try{
        let userId = req.params.userId
        let productId = req.body.productId
        let cartId = req.body.cartId
        
        if(!valid.isValidId(userId)){
            return res.status(400).send({status: false, message: "userId is not valid"})
        }
        if(!valid.isValidId(productId) && !productId){
            return res.status(400).send({status: false, message:  "productId should be valid or required"})
        }
        // if(!productId){
        //     return res.status(400).send({status: false, message: "productId is mandatory"})
        // }

        let quantity = 1

        const checkUser = await userModel.findOne({userId, isDeleted: false})
        if(!checkUser){
            return res.status(404).send({status: false, message: "no such user exist"})
        }
        
        const checkProduct = await productModel.findOne({productId, isDeleted: false})
        if(!checkProduct){
            return res.status(404).send({status: false, message: "no such product exist"})
        }

        const checkCart = await cartModel.findOne({userId})
        // if user has no cart the we will create a new cart for him/her
        if(!checkCart){
            let cartItems = {}
            cartItems.userId = userId
            cartItems.items = {productId, quantity}
            cartItems.totalPrice = checkProduct.price * quantity
            cartItems.totalItems = 1
        
        let newCartCreation = await cartModel.create(cartItems)
        return res.status(201).send({status: true, data: newCartCreation})
        // its mean that user has already the cart we will update the cart
        }else{
            if(!cartId) return res.status(400).send({status: false, message: "plz enter cartId"})
        }
        if(!valid.isValidId(cartId)) return res.status(400).send({status: false, message: "cartId is not valid"})

        const getCart = await cartModel.findOne({userId, cartId})
        if(!getCart) return res.status(404).send({status: false, message: "no such cart exist with the given cartId and UserId"})


        // abhi ye incomple h, abhi bad me krungi...




        

    }
    catch(error){
        res.status(500).send({status: false, msg:error.message})
    }
}


const getCart = async function(req,res){
    try{
        let userId = req.params.userId

        if(!valid.isValidId(userId)){
            return res.status(400).send({status: false, message: "userId is invalid"})
        }

        let checkUser = await userModel.findOne({userId, isDeleted: false})
        if(!checkUser){
            return res.status(404).send({status: false, message: "no such user exist"})
        }

        // getting cart summary by using populate method..... and we have to return products details also
        let checkCart = await cartModel.findOne({userId}).populate("items.productId")
        if(!checkCart){
            return res.status(404).send({status: false, message: "no such cart found with this userId"})
        }

        return res.status(200).send({status: true, data: checkCart})

    }

    
    catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {createCart, getCart}