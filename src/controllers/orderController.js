const orderModel = require("../models/orderModel")
const valid = require("../validators/userValidator")

const updateOrder = async function(req,res)
{
    try
    {
        const orderId = req.body.orderId
        const status = req.body.status
        const userId = req.params.userId
        //check try catch , check double queries mongo
        if (!["pending", "completed", "cancelled"].includes(status)) {
            return res.status(400).send({status:false,message:"pls send correct status, only [pending,completed,cancelled] allowed"})
        }

        if (!valid.isValidId(orderId)) {
            return res.status(400).send({ status: false, message: "OrderId should be valid and required" })
        }
        
        if(checkOrder.cancellable!="cancellable" && status=="cancelled")
        return res.status(400).send({status:false,message:"Order is not cancellable"})

        const updatedOrder = await orderModel.findOneAndUpdate({ _id: orderId,userId },{status},{new:true})
        if (!updatedOrder) {
            return res.status(404).send({ status: false, message: "no such order exist with the given User" })
        }

    }
    catch(err)
    {
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports= {updateOrder}