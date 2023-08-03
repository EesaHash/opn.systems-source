const express = require("express");
const Product = require("../../models/product");
const router = express.Router();

/**
 * Fetch products associated with the given business ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} - JSON response containing the fetched products and status.
 */
router.post("/", async (req, res) => {
    try {
        const { businessID } = req.body;

        // Call the function to get products by business ID
        let products = await getProductsByBusinessID(businessID);

        return res.status(200).json({
            status: true,
            products,
            message: `Successfully retrieve products for business ID: ${businessID}`
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error
        });
    }
});
module.exports = router;

/**
 * Get products associated with the given business ID.
 *
 * @param {number} businessID - The ID of the business.
 * @returns {Array} - An array containing the fetched products.
 */
const getProductsByBusinessID = async (businessID) => {
    return (await Product.findAll({
        where: { businessID }
    }));
};
