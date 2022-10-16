const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const valid = require("../validators/userValidator")


const createCart = async function(req,res){
    try{
        let userId = req.params.userId
        let data = req.body
        
        if(!valid.isValidId(userId)){
            return res.status(400).send({status: false, message: "userId is not valid"})
        }
        if(!valid.isValidId(data.productId)){
            return res.status(400).send({status: false, message: "productId is not valid"})
        }

        let savedData = await cartModel.create(data)
        return res.status(201).send({status: true, message: "success", data: savedData})

        

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

        let checkCart = await cartModel.findOne({userId}).populate("items.productId")











    }
    catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {createCart, getCart}