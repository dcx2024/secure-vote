const db = require('../config/db')

const TABLE ='voters';

const Voter={
    async create(voterData){
        const [voter] = await db(TABLE).insert(voterData).returning("*")
        return voter;
    },
    
    
}

module.exports =Voter;