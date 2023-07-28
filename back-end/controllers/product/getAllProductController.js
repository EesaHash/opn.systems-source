const express = require ("express");
const Product = require("../../models/product");
const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const {businessID} = req.body;
        let products = await getProductsByBusinessID(businessID);
        return res.status(200).json({
            status: true,
            products,
            message: `Successfully retreive team member for business ID: ${businessID}`
        })
    }catch(error){
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

const getProductsByBusinessID = async (businessID) => {
    return (await Product.findAll({
        where: {businessID}
    }));
};