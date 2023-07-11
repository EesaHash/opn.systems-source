const express = require("express");
const Product = require("../../models/product");
const router = express.Router();

/*

REQUEST EXAMPLE

{
    coreServices
    targetMarket
    isProduct
    productOrServiceDescription,
    fundingStrategy,
    businessID,
}
*/

router.post("/", async (req, res) => {
    try {
        const {
            coreServices,
            targetMarket,
            isProduct,
            productOrServiceDescription,
            fundingStrategy,
            businessID,
        } = req.body;

        // Create a new business record in the database
        await Product.create({
            coreServices,
            targetMarket,
            isProduct: (isProduct === "Product" ? true : false),
            productOrServiceDescription,
            fundingStrategy,
            businessID,
        });


        console.log(`[Success] Added Product for business ID : ${businessID}`);

        return res.status(200).json({
            status: true,
            message: "Successfully added new Product",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error });
    }
});


module.exports = router;

