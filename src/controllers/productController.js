const awsCon = require("../controllers/awsController")
const productModel = require("../models/productModel")
const validations = require("../validators/userValidator")

//* PRODUCT VALIDATIONS *//

//------------------ size Validation----------------------->>
const isValidSize = (sizes) => {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizes);
}
 
//--------------------boolean validation---------------------//
const isValidBoolean = (value) => {
    if (!(typeof value === "boolean")) return false
    return true
}


const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files

        if (!Object.keys(data).length || !files)
            return res.status(400).send({ status: false, message: "Send data in body" })

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = data

        let duplicateTitle = await productModel.findOne({ title: title });
        if (duplicateTitle) return res.status(400).send({ status: false, message: "title already exist in use" });

        if (validations.isValidName(title))
            return res.status(400).send({ status: false, message: "title is required or invalid" })

        if (validations.isValidName(description))
            return res.status(400).send({ status: false, message: "description is required or invalid" })

        if (validations.isValidateNum(price))
            return res.status(400).send({ status: false, message: "price is required or invalid" })

        if (validations.isValidateNum(installments))
            return res.status(400).send({ status: false, message: "installments is required or invalid" })

        //will check style vali.

        if (validations.isValidName(style))
            return res.status(400).send({ status: false, message: "style is  invalid" })

        if (isValidBoolean(isFreeShipping))
            return res.status(400).send({ status: false, message: "isFreeShipping is required or invalid" })

        if (isValidSize(availableSizes))
            return res.status(400).send({ status: false, message: "availableSizes is required or invalid" })


        if (files[0].fieldname == "productImage" && files && files.length > 0) {
            let url = await awsCon.uploadFile(files[0])
            data.productImage = url
        } else {
            return res.status(400).send({ status: false, message: "productImage is required or invalid" })
        }

        if (!validations.isValidate(currencyId)) return res.status(400).send({ status: false, message: "currencyId required" });
        if (currencyId != 'INR') return res.status(400).send({ status: false, message: "only indian currencyId INR accepted" });

        if (!validations.isValidate(currencyFormat)) return res.status(400).send({ status: false, message: "currency format required" });
        if (currencyFormat != '₹') return res.status(400).send({ status: false, message: "only indian currency ₹ accepted " });

        if (!validations.isValidate(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes required" });

        // taking size as array of string 
        let sizesList = availableSizes.toUpperCase().split(",").map(x => x.trim());
        console.log(sizesList)
        if (Array.isArray(sizesList)) {
            let newSizeArray = [];
            console.log(newSizeArray)
            let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
            for (let i in sizesList) {
                if (!arr.includes(sizesList[i]))
                    return res.status(400).send({ status: false, message: "Please Enter valid sizes, it should include only sizes from  (S,XS,M,X,L,XXL,XL) " });
                if (!newSizeArray.includes(sizesList[i]))
                    newSizeArray.push(sizesList[i])
            }
        }

        let savedData = await productModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: savedData })


    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }


}


const getProducstById = async function (req, res) {
    try {
        let productId = req.params.productId;

        if (!isValidId(productId))
            return res.status(400).send({ status: false, message: "Invalid Product ID" });

        let getProduct = await productModel.findById(productId);

        if (!getProduct)
            return res.status(404).send({
                status: false,
                message: "ProductID not found ",
            });

        if (getProduct.isDeleted == true)
            return res.status(400).send({ status: false, message: "Product is deleted" });

        return res.status(200).send({ status: true, message: "Success", data: getProduct });

    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


module.exports = { createProduct, getProducstById }







