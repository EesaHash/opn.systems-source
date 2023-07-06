const express = require ("express");
const Team_Member = require("../../models/team_member");
const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const {businessID} = req.body;
        let teamMembers = await getTeamMembers(businessID);
        console.log(`Successfully retreive team member for business ID: ${businessID}`);
        return res.status(200).json({
            status: true,
            teamMembers,
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

const getTeamMembers = async (businessID) => {
    return (await Team_Member.findAll({
        where: {id: businessID}
    }));
};