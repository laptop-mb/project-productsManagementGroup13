const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")
const valid = require("../validators/userValidator")

const createOrder = async function (req,res){
    try{
        let userId = req.params.userId
        let cartId = req.body.cartId

        let checkUser = await userModel.find({_id: userId})
        if(!checkUser){
            return res.status(404).send({status: false, message: "no such user exist with this userId"})
        }
        //  question --> is cartId required
        if(!valid.isValidId(cartId)){
            return res.status(400).send({status: false, message: "cartId is not valid"})
        }
        const checkCart = await cartModel.find({_id: cartId, userId: userId})
        if(!checkCart){
            return res.status(400).send({status: false, message: "no such cart exist with this cartId and userId"})
        }
        if(!checkCart.items){
            return res.status(400).send({status: false, message: "bro, you can't order with empty cart..."})
        }
        let total = 0
        checkCart.items.forEach(element => total += element + quantity)
        let placeOrder = {}
        placeOrder.userId = userId
        placeOrder.items = checkCart.totalItems
        placeOrder.totalPrice = checkCart.totalPrice
        placeOrder.quantity = total
        placeOrder.status = "pending" //it will be updated from updated api

        const orderData = await orderModel.create(placeOrder)
        return res.status(201).send({status: true, message: "success", data: orderData})
        

    }
    catch(error){
        return res.status(500).send({message: error.message})
    }
}

 const updateOrder = async function(req,res)
{
    try
    {
        const orderId = req.body.orderId
        const status = req.body.status
        const userId = req.params.userId

        if (!["pending", "completed", "cancelled"].includes(status)) {
            return res.status(400).send({status:false,message:"pls send correct status, only [pending,completed,cancelled] allowed"})
        }

        if (!valid.isValidId(orderId)) {
            return res.status(400).send({ status: false, message: "OrderId should be valid and required" })
        }
        const checkOrder = await orderModel.findOne({ _id:orderId, userId })
        if(!checkOrder)
        return res.status(404).send({status:false,message:"Order does not exist"})

        if(checkOrder.cancellable!="cancellable" && status=="cancelled")
        return res.status(400).send({status:false,message:"Order is not cancellable"})

        let updatedOrder= null

        if(status!="pending")
             updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId,userId },
                {status,isDeleted:true,deletedAt:Date.now()},{new:true})
        else
            return res.status(200).send({ status: false, message: "Success", data:checkOrder })

        return res.status(200).send({ status: true, message: "Success", data:updatedOrder })

    }
    catch(err)
    {
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports= {createOrder,updateOrder}
