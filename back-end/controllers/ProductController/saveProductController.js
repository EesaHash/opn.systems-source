const Product = require("../../models/product");

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

const addProduct = async (input) => {
    try{
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
    }catch(error){
        console.log(error);
    }
};
module.exports = {addProduct};