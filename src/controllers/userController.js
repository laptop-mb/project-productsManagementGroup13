const userModel = require("../models/userModel")

const createUser = async function(req,res){
    try{
        let data = req.body
        

    }
    catch(error){
        res.status(500).send({msg: error.message})

    }


}

module.exports.createUser = createUser