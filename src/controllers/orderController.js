const orderModel = require("../models/orderModel")
const valid = require("../validators/userValidator")

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

module.exports= {updateOrder}