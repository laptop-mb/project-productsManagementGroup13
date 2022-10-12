const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const validation = require("../validators/userValidator")



const Authentication = async function (req, res, next) {
    try {
        // accessing token from headers
        let token = req.headers.Authorization
        if (!token) return res.status(400).send({ status: false, message: 'TOKEN is missing !!!' });

        console.log({ token: token })

        // let user = token.split(' ');

        // console.log({ token: user })

       let decodedToken =  jwt.verify( token, "project/productManagementGroup13",)
        if(!decodedToken) return res.status(400).send({msg: "invalid token"})
            
                req.userId = decodedToken.userId
                next()
            
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const Authorization = async function (req, res, next)  {
    try {
        let userId = req.params.userId

        if (!validation.isValidId(userId)) return res.status(400).send({ status: false, message: "User id not valid" });

        // finding user in DB
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, message: "User not found" })

        // authorizing the user
        if (userId != req.userId) return res.status(403).send({ status: false, message: "user not authorized" })

        // sending whole user document to global
        req.checkUser = checkUser;
        next();
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { Authentication, Authorization };