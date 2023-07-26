const StageName = require("../../models/stage_name");

const getStages = async (clientJourneyID) => {
    const stages = (await StageName.findAll({
        where: { clientJourneyID }
    }))[0];
    if(stages)
        return JSON.parse(stages.names).synonyms;
    return stages;
};

module.exports = {getStages}