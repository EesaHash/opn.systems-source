const express = require("express");
const router = express.Router();
const Business = require('../../models/business');

const business = {};

business.addNewBusiness = async (req, res) => {
    try {
        const { businessName, businessType, industry, companySize, coreServices, isManufacture, email  } = req.body;
        // Create a new business
        const newBusiness = await business.create({ businessName, businessType, industry, companySize, coreServices, isManufacture, email });
        console.log(`[Success] Added new business details for ${email} : `, newBusiness.businessName);
      } catch (error) {
        console.error(`[Failure] Could not add business details for ${email}`, error);
        res.status(500).json({ error: `Could not add business for ${email}`});
      }
    };

business.removeBusiness = async (req, res) => {
    try {
        const { id, email } = req.body;
        // Delete the business from the business table
        const business = await Business.destroy({ where: { id } });
        console.log(`[Success] Deleted business ${id} for ${email} : `, business.businessName);
      } catch (error) {
        const { id, email } = req.body;
        console.error(`[Failure] Could not delete business`, error);
        res.status(500).json({ error: `Could not delete business`});
      }
    };


business.updateBusiness = async (req, res) => {
    try {
        const { id, businessName, businessType, industry, companySize, coreServices, isManufacture, email  } = req.body;
        // Update the business record in the database
        const business = await Business.update({ businessName, businessType, industry, companySize, coreServices, isManufacture, email }, { where: { id } });
        console.log(`[Success] Updated business details for ${email} : `, business.businessName);
      } catch (error) {
        console.error(`[Failure] Could not update business details for ${email}`, error);
        res.status(500).json({ error: `Could not update business for ${email}`});
      }
    };

business.getSingleBusiness = async (req, res) => {
    try {
        const { id, email } = req.body;
        // Find all businesses for the given user
        const business = await Business.findAll({ where: { id } });
        console.log(`[Success] Retrieved business details for ${email} : `, business.businessName);
      } catch (error) {
        console.error(`[Failure] Could not retrieve business details`, error);
        res.status(500).json({ error: `Could not retrieve business`});
      }
    };

business.getAllBusinesses = async (req, res) => {
    try {
        const { email } = req.body;
        // Find all businesses for the given user
        const business = await Business.findAll({ where: { email } });
        console.log(`[Success] Retrieved business details for ${email} : `, business.businessName);
      } catch (error) {
        console.error(`[Failure] Could not retrieve business details`, error);
        res.status(500).json({ error: `Could not retrieve business`});
      }
};



// Define the routes
router.post('/addNewBusiness', business.addNewBusiness);
router.put('/updateBusiness', business.updateBusiness);
router.delete('/removeBusiness', business.removeBusiness);
router.get('/getSingleBusiness', business.getSingleBusiness);
router.get('/getAllBusinesses', business.getAllBusinesses);

module.exports = router;