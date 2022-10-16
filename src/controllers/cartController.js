const cartModel = require("../models/cartModel")


const createCart = async function(req,res){
    try{
        let userId = req.params.userId
        let data = req.body
        
        

    }
    catch(error){
        res.status(500).send({msg:error.message})
    }
}

module.exports = {createCart}