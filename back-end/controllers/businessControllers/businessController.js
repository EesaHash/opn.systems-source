const express = require("express");
const router = express.Router();
const Business = require('../../models/business');
const { addTeamMembers } = require("./addTeamMemberController");

const business = {};

business.addNewBusiness = async (req, res) => {
    try {
        const {
          businessName,
          businessType,
          industry,
          companySize,
          businessObjective,
          coreServices,
          targetMarket,
          isProduct,
          productOrServiceDescription,
          fundingStrategy,
          email,
          teamList
        } = req.body;

        // Create a new business record in the database
        const business = await Business.create({
          businessName,
          businessType,
          industry,
          companySize,
          businessObjective,
          coreServices,
          targetMarket,
          isProduct: (isProduct === "Product" ? true : false),
          productOrServiceDescription,
          fundingStrategy,
          email
        });

        await addTeamMembers(teamList, business.id);

        console.log(`[Success] Added business ${businessName} for ${email} : `, business.id);
        
        return res.status(200).json({ status: true, message: "Successfully added new business!", business: business});
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: error});
      }
};

business.removeBusiness = async (req, res) => {
    try {
        const { id } = req.body;
        // Delete the business from the business table
        const business = await Business.destroy({ where: { id } });
        if (business === 0) return res.status(404).json({ error: `Could not find business`});
        console.log(`[Success] Deleted business ${id}`);
        return res.status(200).json({ Success : `Deleted Bussiness ID: ${id}`});
      } catch (error) {
        res.status(500).json({ error: `Could not delete business`});
      }
    };


business.updateBusiness = async (req, res) => {
    try {
        const {
          id,
          businessName,
          businessType,
          industry,
          companySize,
          businessObjective,
          coreServices,
          targetMarket,
          isProduct,
          productOrServiceDescription,
          fundingStrategy,
          email,
         } = req.body;
        // Update the business record in the database
        const business = await Business.update({
          id,
          businessName,
          businessType,
          industry,
          companySize,
          businessObjective,
          coreServices,
          targetMarket,
          isProduct,
          productOrServiceDescription,
          fundingStrategy,
          email,
        }, { where: { id } });
        console.log(`[Success] Updated business details for ${email} : `, business.businessName);
        res.status(200).json({ Success : `Updated Bussiness ID: ${id} for ${email}`});
      } catch (error) {
        res.status(500).json({ error: `Could not update business`});
      }
    };

business.getSingleBusiness = async (req, res) => {
    try {
        const { id } = req.body;
        // Find all businesses for the given user
        const business = await Business.findAll({ where: { id } });
        console.log(`[Success] Retrieved business details`);
        res.status(200).json({business});
      } catch (error) {
        res.status(500).json({ error: `Could not retrieve business`});
      }
    };

business.getAllBusinesses = async (req, res) => {
    try {
        const { email } = req.body;
        // Find all businesses for the given user
        const businesses = await Business.findAll({ where: { email }, order: ['id']});
        console.log(`[Success] Retrieved business details for ${email}`);
        return res.status(200).json({status: true, businesses: businesses});
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, mesesage: error});
      }
};


// Define the routes
router.post('/addNewBusiness', business.addNewBusiness);
router.put('/updateBusiness', business.updateBusiness);
router.delete('/removeBusiness', business.removeBusiness);
router.post('/getSingleBusiness', business.getSingleBusiness);
router.post('/getAllBusinesses', business.getAllBusinesses);

module.exports = router;