const Product = require("../../models/product");

/**
 * Add a new product to the database for a specific business.
 *
 * @param {object} input - The input object containing the product details.
 * @param {string} input.coreServices - The core services provided by the product.
 * @param {string} input.targetMarket - The target market for the product.
 * @param {string} input.isProduct - Indicates if it's a product ("Product") or service ("Service").
 * @param {string} input.productOrServiceDescription - Description of the product or service.
 * @param {string} input.fundingStrategy - The funding strategy for the business.
 * @param {number} input.businessID - The ID of the business associated with the product.
 * @returns {object} - The newly created product object.
 */
const addProduct = async (input) => {
    try {
        const product = await Product.create({
            coreServices: input.coreServices,
            targetMarket: input.targetMarket,
            isProduct: input.isProduct === "Product" ? true : false,
            productOrServiceDescription: input.productOrServiceDescription,
            fundingStrategy: input.fundingStrategy,
            businessID: input.businessID
        });

        console.log(`[Success] Added Product for Business ID: ${input.businessID}`);
        return product;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { addProduct };
