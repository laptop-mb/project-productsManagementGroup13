const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const valid = require("../validators/userValidator")


const createCart = async function(req,res){
    try{
        let userId = req.params.userId
        let productId = req.body.productId
        let cartId = req.body.cartId
        
        if(!valid.isValidId(productId) || !productId){
            return res.status(400).send({status: false, message:  "productId should be valid or required"})
        }

        const checkUser = await userModel.findOne({_id:userId, isDeleted: false})
        if(!checkUser){
            return res.status(404).send({status: false, message: "no such user exist"})
        }
        
        const checkProduct = await productModel.findOne({_id:productId, isDeleted: false})
        if(!checkProduct){
            return res.status(404).send({status: false, message: "no such product exist"})
        }

        const checkCart = await cartModel.findOne({userId})
        // if user has no cart the we will create a new cart for him/her
        
        if(checkCart)
        if(cartId!=checkCart._id)
        return res.status(400).send({status:false, message:"pls send cartId and it should be valid"})
        
        let cartItems={}
        cartItems.userId = userId

        if(!checkCart){
            cartItems.items = {productId:productId, quantity:1}
            cartItems.totalPrice = checkProduct.price
            cartItems.totalItems = 1
        }
        else{        
        let match = checkCart.items.filter((elem)=>elem.productId == productId)
        let nomatch = checkCart.items.filter((elem)=>elem.productId != productId)
        if(match.length==0)
        {
             checkCart.items.push({productId, quantity:1})
             cartItems.items = checkCart.items
            cartItems.totalPrice = checkProduct.price+checkCart.totalPrice
            cartItems.totalItems = 1+checkCart.totalItems

        }
        else
        {
            match[0].quantity = match[0].quantity+1
            nomatch.push(match[0])
             cartItems.items = nomatch
            cartItems.totalPrice = checkProduct.price+checkCart.totalPrice
            cartItems.totalItems = checkCart.totalItems

        }

        }
        let newCartCreation = await cartModel.findOneAndUpdate({userId:userId},cartItems,{new:true,upsert:true})
        return res.status(201).send({status: true, data: newCartCreation})
        // its mean that user has already the cart we will update the cart

    }
    catch(error){
        res.status(500).send({status: false, msg:error.message})
    }
}


const getCart = async function(req,res){
    try{
        let userId = req.params.userId

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