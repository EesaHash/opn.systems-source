const Team_Member = require("../../models/team_member");

const addTeamMembers = async (list, businessID) => {
    list.forEach(async (item) => {
        await addTeamMember(item.email, businessID, item.role);
    });
};
const addTeamMember = async (email, businessID, role) => {
    return await Team_Member.create({
        email: String(email).toLowerCase(),
        id: businessID,
        role: String(role).toLowerCase(),
    });
};
module.exports = {addTeamMembers}