const Team_Member = require("../../models/team_member");

/**
 * Add multiple team members to the database for a specific business.
 *
 * @param {Array} list - An array of team member objects containing email and role.
 * @param {number} businessID - The ID of the business associated with the team members.
 */
const addTeamMembers = async (list, businessID) => {
    list.forEach(async (item) => {
        await addTeamMember(item.email, businessID, item.role);
    });
};

/**
 * Add a team member to the database for a specific business.
 *
 * @param {string} email - The email of the team member.
 * @param {number} businessID - The ID of the business associated with the team member.
 * @param {string} role - The role of the team member.
 * @returns {object} - The newly created team member object.
 */
const addTeamMember = async (email, businessID, role) => {
    return await Team_Member.create({
        email: String(email).toLowerCase(),
        id: businessID,
        role: String(role).toLowerCase(),
    });
};

module.exports = { addTeamMembers };
