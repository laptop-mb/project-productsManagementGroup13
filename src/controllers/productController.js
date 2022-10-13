const awsCon = require("../controllers/awsController")
const productModel = require("../models/productModel")
const valid = require("../validators/userValidator")

//* PRODUCT valid *//

//------------------ size Validation----------------------->>
const isValidSize = (sizes) => {
    let sizesList = sizes.toUpperCase().split(",").map(x => x.trim());

    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        if (!sizesList.every((elem) => arr.includes(elem))) {
            return true
        }
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

        if (valid.isValidName(title))
            return res.status(400).send({ status: false, message: "title is required or invalid" })

        if (valid.isValidName(description))
            return res.status(400).send({ status: false, message: "description is required or invalid" })

        if (!valid.stringContainsAlphabet(price))
            return res.status(400).send({ status: false, message: "price is required or invalid" })

        if (!valid.stringContainsAlphabet(installments))
            return res.status(400).send({ status: false, message: "installments is required or invalid" })

        //will check style vali.

        if (valid.isValidName(style))
            return res.status(400).send({ status: false, message: "style is  invalid" })

        if (isValidBoolean(isFreeShipping))
            return res.status(400).send({ status: false, message: "isFreeShipping is required or invalid" })

        if (files && files.length > 0 && (files[0].fieldname == "productImage" || files[0].fieldname == "image") ) {
            let url = await awsCon.uploadFile(files[0])
            data.productImage = url
        } else {
            return res.status(400).send({ status: false, message: "productImage is required or invalid" })
        }

        if (currencyId!=undefined)
        {if(!valid.isValidate(currencyId)) return res.status(400).send({ status: false, message: "currencyId wrong format" });
        if (currencyId != 'INR') return res.status(400).send({ status: false, message: "only indian currencyId INR accepted" });
        }
        if (currencyFormat!=undefined)
        {if (!valid.isValidate(currencyFormat)) return res.status(400).send({ status: false, message: "currencySymbol wrong format" });
        if (currencyFormat != '₹') return res.status(400).send({ status: false, message: "only indian currency ₹ accepted " });
        }

        if (isValidSize(availableSizes))return res.status(400).send({ status: false, message: "availableSizes is required or invalid" })

        // taking size as array of string 
        let sizesList = availableSizes.toUpperCase().split(",").map(x => x.trim());
        data.availableSizes = sizesList            
        

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

        if (!valid.isValidId(productId))
            return res.status(400).send({ status: false, message: "Invalid Product ID" });

        let getProduct = await productModel.findById(productId);

        if (!getProduct)
            return res.status(404).send({
                status: false,
                message: "ProductID not found ",
            });

        if (getProduct.isDeleted == true)
            return res.status(404).send({ status: false, message: "Product not found" });

        return res.status(200).send({ status: true, message: "Success", data: getProduct });

    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const getProducts = async function(req,res)
{
    try{
    const query = req.query
    const body={isDeleted:false}
    let data =null
    let check=0

    if (!Object.keys(query).every((elem) => ["size", "name","priceGreaterThan", "priceLessThan","priceSort"].includes(elem))) {
        return res.status(400).send({ status: false, message: "wrong Parameters found" });
    }
    if(query.size)
    {
        if (isValidSize(availableSizes))return res.status(400).send({ status: false, message: "availableSizes is required or invalid" })
        let sizesList = query.size.toUpperCase().split(",").map(x => x.trim());
        body.availableSizes = sizesList 
    }
    if(query.name)
    {
        if(valid.isValidName(query.name))
        return res.status(400).send({ status: false, message: "name is invalid" })
        const regex =  new RegExp(query.name.trim(),'g')
        body.title = regex
    }

    if(query.priceGreaterThan)
    if(!valid.stringContainsAlphabet(query.priceGreaterThan) ||
    parseInt(query.priceGreaterThan)<0)
    return res.status(400).send({ status: false, message: "Invalid priceGreaterThan provided" });       
    
    if(query.priceLessThan)
    if(!valid.stringContainsAlphabet(query.priceLessThan) ||
    parseInt(query.priceLessThan)<0 )
    return res.status(400).send({ status: false, message: "Invalid priceLessThan provided" });       

    if(parseInt(query.priceGreaterThan)>=0 && parseInt(query.priceLessThan)>=0)
    {
        if(parseInt(query.priceGreaterThan)>parseInt(query.priceLessThan))
        return res.status(400).send({ status: false, message: "priceGreaterThan should be less than priceLessThan" });       
        body.price = { $gt: parseInt(query.priceGreaterThan), $lt: parseInt(query.priceLessThan)}
    }
        
    else if(parseInt(query.priceGreaterThan) >=0)
        body.price = { $gt: parseInt(query.priceGreaterThan)}
    else if(parseInt(query.priceLessThan)>=0)
        body.price = { $lt: parseInt(query.priceLessThan)}    

    
    if(query.priceSort)
    {
    if (!["1","-1"].includes(query.priceSort)) {
        return res.status(400).send({ status: false, message: "wrong value in sort" });
    }

    check=1
    data =await productModel.find(body).sort({price:query.priceSort})
    
    }
    console.log(body)
    if(!check)
     data = await productModel.find(body)

    if(!data.length)
    return res.status(404).send({status:false, message:"Products do not exist"})

    return res.status(200).send({status:true, data:data})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }


}

module.exports = {getProducts, createProduct, getProducstById}
