const express = require ("express");
const Team_Member = require("../../models/team_member");
const router = express.Router();

/**
 * Get team members for a specific business from the database.
 *
 * @param {number} businessID - The ID of the business associated with the team members.
 * @returns {Array} - An array of team members associated with the given business ID.
 */
router.post("/", async (req, res) => {
    try{
        const {businessID} = req.body;
        let teamMembers = await getTeamMembers(businessID);
        console.log(`Successfully retrieve team members for business ID: ${businessID}`);
        return res.status(200).json({
            status: true,
            teamMembers,
            message: `Successfully retrieve team members for business ID: ${businessID}`
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

/**
 * Get team members for a specific business from the database.
 *
 * @param {number} businessID - The ID of the business associated with the team members.
 * @returns {Array} - An array of team members associated with the given business ID.
 */
const getTeamMembers = async (businessID) => {
    return (await Team_Member.findAll({
        where: {id: businessID}
    }));
};